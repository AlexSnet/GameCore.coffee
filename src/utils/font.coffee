###
Inspired by Font.js by  Mike "Pomax" Kamermans
@see http://github.com/Pomax/Font.js
###

Mathmetics = require "../math/math"
Triggerable = require "../core/triggerable"

FONT_CACHE = {}
FONT_DEFAULTS =
    fontFamily : 'Verdena'
    fontSize : 12

# decimal to character
chr = (val) ->
    String.fromCharCode val


# decimal to ushort
chr16 = (val) ->
    return chr(0) + chr(val)    if val < 256
    b1 = val >> 8
    b2 = val & 0xFF
    chr(b1) + chr(b2)


# decimal to hexadecimal
# See http://phpjs.org/functions/dechex:382
dechex = (val) ->
    val = 0xFFFFFFFF + val + 1    if val < 0
    parseInt(val, 10).toString 16


# unsigned short to decimal
ushort = (b1, b2) ->
    256 * b1 + b2


# signed short to decimal
fword = (b1, b2) ->
    negative = b1 >> 7 is 1
    val = undefined
    b1 = b1 & 0x7F
    val = 256 * b1 + b2
    
    # positive numbers are already done
    return val    unless negative
    
    # negative numbers need the two's complement treatment
    val - 0x8000


# unsigned long to decimal
ulong = (b1, b2, b3, b4) ->
    16777216 * b1 + 65536 * b2 + 256 * b3 + b4


###
Font manipulations and measurement

@note GameCore.exports.Utils.Font
###
class Font extends Triggerable
    constructor: (options={})->
        # the font resource URL
        @url = options.url or options.src or ""

        # if this is not specified, a random name is used
        @fontFamily = if @url then options.fontFamily or "font" + Mathmetics.randomInt(0,999999) else FONT_DEFAULTS.fontFamily

        @fontSize = options.fontSize or options.size or FONT_DEFAULTS.fontSize

        # the font's format ('truetype' for TT-OTF or 'opentype' for CFF-OTF)
        @format = options.format or ""

        # the font's byte code
        @data = options.data or ""

        # custom font, implementing the letter 'A' as zero-width letter.
        @base64 = "AAEAAAAKAIAAAwAgT1MvMgAAAAAAAACsAAAAWGNtYXAA" +
            "AAAAAAABBAAAACxnbHlmAAAAAAAAATAAAAAQaGVhZAAAA" +
            "AAAAAFAAAAAOGhoZWEAAAAAAAABeAAAACRobXR4AAAAAA" +
            "AAAZwAAAAIbG9jYQAAAAAAAAGkAAAACG1heHAAAAAAAAA" +
            "BrAAAACBuYW1lAAAAAAAAAcwAAAAgcG9zdAAAAAAAAAHs" +
            "AAAAEAAEAAEAZAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
            "AAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAABAAMAAQA" +
            "AAAwABAAgAAAABAAEAAEAAABB//8AAABB////wAABAAAA" +
            "AAABAAAAAAAAAAAAAAAAMQAAAQAAAAAAAAAAAABfDzz1A" +
            "AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAEAAg" +
            "AAAAAAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAA" +
            "AAAAAAAAAAQAAAAAAAAAAAAAAAAAIAAAAAQAAAAIAAQAB" +
            "AAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAIAHgADAAEEC" +
            "QABAAAAAAADAAEECQACAAIAAAAAAAEAAAAAAAAAAAAAAA" +
            "AAAA=="

        ###
        these metrics represent the font-indicated values,
        not the values pertaining to text as it is rendered
        on the page (use fontmetrics.js for this instead).
        ###
        @metrics =
            quadsize: 0
            leading: 0
            ascent: 0
            descent: 0
            weightclass: 400

        # Will this be a remote font, or a system font?
        Object.defineProperty @, "systemfont",
            get: ()->
                if @_systemfont
                    @_systemfont
                else
                    if @url then false else true
            set: (oreally)->
                @_systemfont = oreally

        # internal indicator that the font is done loading
        @loaded = false

        # preassigned quad × quad context, for measurements
        # @canvas = document.createElement('canvas') if not options.context or options.ctx
        # @context = if not options.context or options.ctx then  @canvas.getContext('2d') else options.context or options.ctx
        @canvas = false
        @context = false

        # The stylenode can be added to the document head
        # to make the font available for on-page styling,
        # but it should be requested with .toStyleNode()
        @styleNode = false

        ###
        we want Font to do the same thing Image does when
        we set the "src" property value, so we use the
        Object.defineProperty function to bind a setter
        that does more than just bind values.
        ###
        Object.defineProperty @, "src",
            get: ()->
                @url

            set: (url) ->
                @url = url
                @loadFont()

        @loadFont() if @url

    ###
    This function gets called once the font is done
    loading, its metrics have been determined, and it
    has been parsed for use on-page. By default, this
    function does nothing, and users can bind their
    own handler function.
    ###
    onload: ()->

    ###
    This function gets called when there is a problem
    loading the font.
    ###
    onerror: ()->

    ###
    validation function to see if the zero-width styled
    text is no longer zero-width. If this is true, the
    font is properly done loading. If this is false, the
    function calls itself via a timeout
    ###
    validate: (target, zero, mark, font, timeout) ->
        if timeout isnt false and timeout < 0
            @onerror() # @TODO: Error codes
            throw new Error "Requested system font '#{@fontFamily}' could not be loaded (it may not be installed)."
            return
        computedStyle = document.defaultView.getComputedStyle(target, "")
        width = computedStyle.getPropertyValue("width").replace("px", "")

        # font has finished loading - remove the zero-width and
        # validation paragraph, but leave the actual font stylesheet (mark);
        if width > 0
            document.head.removeChild zero
            document.body.removeChild target
            @loaded = true
            @onload()

        # font has not finished loading - wait 50ms and try again
        else
            setTimeout (->
                font.validate target, zero, mark, font, (if timeout is false then false else timeout - 50)
            ), 50

    ###
    This gets called when the file is done downloading.
    ###
    ondownloaded: ()->
        instance = @
        
        # unified error handling
        error = (msg) ->
            instance.onerror msg
        
        # we know about TTF (0x00010000) and CFF ('OTTO') fonts
        ttf = chr(0) + chr(1) + chr(0) + chr(0)
        cff = 'OTTO'
        woff = 'wOFF'

        # so what kind of font is this?
        data = @data
        version = chr(data[0]) + chr(data[1]) + chr(data[2]) + chr(data[3])
        isTTF = (version is ttf)
        isCFF = ((if isTTF then false else version is cff))
        isWOFF= ((if isCFF or isTTF then false else version is woff))

        if isTTF
            @format = "truetype"
        else if isCFF
            @format = "opentype"
        else if isWOFF
            @format = "woff"
        
        # terminal error: stop running code
        else
            throw new Error "Error: file at #{@url} cannot be interpreted as OpenType font."
            return
        
        # ================================================================
        # if we get here, this is a legal font. Extract some font metrics,
        # and then wait for the font to be available for on-page styling.
        # ================================================================
        
        printChar = if @format is 'truetype' or @format is 'opentype' then @_verifyTTForOTF data else 'A'

        @bootstrapValidation printChar
    
    _verifyTTForOTF: (data)->
        # first, we parse the SFNT header data
        numTables = ushort(data[4], data[5])
        tagStart = 12
        ptr = undefined
        end = tagStart + 16 * numTables
        tags = {}
        tag = undefined
        ptr = tagStart
        while ptr < end
            tag = chr(data[ptr]) + chr(data[ptr + 1]) + chr(data[ptr + 2]) + chr(data[ptr + 3])
            tags[tag] =
                name: tag
                checksum: ulong(data[ptr + 4], data[ptr + 5], data[ptr + 6], data[ptr + 7])
                offset: ulong(data[ptr + 8], data[ptr + 9], data[ptr + 10], data[ptr + 11])
                length: ulong(data[ptr + 12], data[ptr + 13], data[ptr + 14], data[ptr + 15])
            ptr += 16
        
        # first we define a quick error shortcut function:
        checkTableError = (tag) ->
            unless tags[tag]
                throw new Error "Error: font is missing the required OpenType '#{tag}' table."
                
                # return false, so that the result of this function can be used to stop running code
                return false
            tag

        
        # Then we access the HEAD table for the "font units per EM" value.
        tag = checkTableError("head")
        return    if tag is false
        ptr = tags[tag].offset
        tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3]
        unitsPerEm = ushort(data[ptr + 18], data[ptr + 19])
        @metrics.quadsize = unitsPerEm
        
        # We follow up by checking the HHEA table for ascent, descent, and leading values.
        tag = checkTableError("hhea")
        return    if tag is false
        ptr = tags[tag].offset
        tags[tag].version = "" + data[ptr] + data[ptr + 1] + data[ptr + 2] + data[ptr + 3]
        @metrics.ascent = fword(data[ptr + 4], data[ptr + 5]) / unitsPerEm
        @metrics.descent = fword(data[ptr + 6], data[ptr + 7]) / unitsPerEm
        @metrics.leading = fword(data[ptr + 8], data[ptr + 9]) / unitsPerEm
        
        # And then finally we check the OS/2 table for the font-indicated weight class.
        tag = checkTableError("OS/2")
        return    if tag is false
        ptr = tags[tag].offset
        tags[tag].version = "" + data[ptr] + data[ptr + 1]
        @metrics.weightclass = ushort(data[ptr + 4], data[ptr + 5])
        
        # ==================================================================
        # Then the mechanism for determining whether the font is not
        # just done downloading, but also fully parsed and ready for
        # use on the page for typesetting: we pick a letter that we know
        # is supported by the font, and generate a font that implements
        # only that letter, as a zero-width glyph. We can then test
        # whether the font is available by checking whether a paragraph
        # consisting of just that letter, styled with "desiredfont, zwfont"
        # has zero width, or a real width. As long as it's zero width, the
        # font has not finished loading yet.
        # ==================================================================
        
        # To find a letter, we must consult the character map ("cmap") table
        tag = checkTableError("cmap")
        return    if tag is false
        ptr = tags[tag].offset
        tags[tag].version = "" + data[ptr] + data[ptr + 1]
        numTables = ushort(data[ptr + 2], data[ptr + 3])
        
        # For the moment, we only look for windows/unicode records, with
        # a cmap subtable format 4 because OTS (the sanitiser used in
        # Chrome and Firefox) does not actually support anything else
        # at the moment.
        #
        # When http://code.google.com/p/chromium/issues/detail?id=110175
        # is resolved, remember to stab me to add support for the other
        # maps, too.
        #
        encodingRecord = undefined
        rptr = undefined
        platformID = undefined
        encodingID = undefined
        offset = undefined
        cmap314 = false
        encodingRecord = 0

        while encodingRecord < numTables
            rptr = ptr + 4 + encodingRecord * 8
            platformID = ushort(data[rptr], data[rptr + 1])
            encodingID = ushort(data[rptr + 2], data[rptr + 3])
            offset = ulong(data[rptr + 4], data[rptr + 5], data[rptr + 6], data[rptr + 7])
            cmap314 = offset    if platformID is 3 and encodingID is 1
            encodingRecord++
        
        # This is our fallback font - a minimal font that implements
        # the letter "A". We can transform this font to implementing
        # any character between 0x0000 and 0xFFFF by altering a
        # handful of letters.
        printChar = "A"
        
        # Now, if we found a format 4 {windows/unicode} cmap subtable,
        # we can find a suitable glyph and modify the 'base64' content.
        if cmap314 isnt false
            ptr += cmap314
            version = ushort(data[ptr], data[ptr + 1])
            if version is 4
                
                # First find the number of segments in this map
                segCount = ushort(data[ptr + 6], data[ptr + 7]) / 2
                
                # Then, find the segment end characters. We'll use
                # whichever of those isn't a whitespace character
                # for our verification font, which we check based
                # on the list of Unicode 6.0 whitespace code points:
                printable = (chr) ->
                    [0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x0020, 0x0085, 0x00A0, 0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x2028, 0x2029, 0x202F, 0x205F, 0x3000].indexOf(chr) is -1

                
                # Loop through the segments in search of a usable character code:
                i = ptr + 14
                e = ptr + 14 + 2 * segCount
                endChar = false
                while i < e
                    endChar = ushort(data[i], data[i + 1])
                    break    if printable(endChar)
                    endChar = false
                    i += 2
                if endChar isnt false
                    
                    # We now have a printable character to validate with!
                    # We need to make sure to encode the correct "idDelta"
                    # value for this character, because our "glyph" will
                    # always be at index 1 (index 0 is reserved for .notdef).
                    # As such, we need to set up a delta value such that:
                    #
                    # [character code] + [delta value] == 1
                    #
                    printChar = String.fromCharCode(endChar)
                    delta = -(endChar - 1) + 65536
                    
                    # Now we need to substitute the values in our
                    # base64 font template. The CMAP modification
                    # consists of generating a new base64 string
                    # for the bit that indicates the encoded char.
                    # In our 'A'-encoding font, this is:
                    #
                    # 0x00 0x41 0xFF 0xFF 0x00 0x00
                    # 0x00 0x41 0xFF 0xFF 0xFF 0xC0
                    #
                    # which is the 20 letter base64 string at [380]:
                    #
                    # AABB//8AAABB////wAAB
                    #
                    # We replace this with our new character:
                    #
                    # [hexchar] 0xFF 0xFF 0x00 0x00
                    # [hexchar] 0xFF 0xFF [ delta ]
                    #
                    # Note: in order to do so properly, we need to
                    # make sure that the bytes are base64 aligned, so
                    # we have to add a leading 0x00:
                    # base64 padding byte
                    # "endCount" array
                    # cmap required padding
                    # "startCount" array
                    # delta value
                    newhex = btoa(chr(0) + chr16(endChar) + chr16(0xFFFF) + chr16(0) + chr16(endChar) + chr16(0xFFFF) + chr16(delta) + chr16(1)) # delta terminator
                    
                    # And now we replace the text in 'base64' at
                    # position 380 with this new base64 string:
                    @base64 = @base64.substring(0, 380) + newhex + @base64.substring(380 + newhex.length)
        printChar

    bootstrapValidation: (printChar, timeout=false) ->
        
        # Create a stylesheet for using the zero-width font:
        tfName = @fontFamily + " testfont"
        zerowidth = document.createElement("style")
        zerowidth.setAttribute "type", "text/css"
        zerowidth.innerHTML = "@font-face {\n" + " font-family: '" + tfName + "';\n" + " src: url('data:application/x-font-ttf;base64," + @base64 + "')\n" + " format('truetype');}"
        document.head.appendChild zerowidth
        
        # Create a validation stylesheet for the requested font, if it's a remote font:
        realfont = false
        unless @systemfont
            realfont = @toStyleNode()
            document.head.appendChild realfont
        
        # Create a validation paragraph, consisting of the zero-width character
        para = document.createElement("p")
        para.style.cssText = "position: absolute; top: 0; left: 0; opacity: 0;"
        para.style.fontFamily = "'" + @fontFamily + "', '" + tfName + "'"
        para.innerHTML = printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar + printChar
        document.body.appendChild para
        
        # Quasi-error: if there is no getComputedStyle, claim loading is done.
        unless document.defaultView.getComputedStyle
            @onload()
            error "Error: document.defaultView.getComputedStyle is not supported by this browser.\n" + "Consequently, Font.onload() cannot be trusted."
        
        # If there is getComputedStyle, we do proper load completion verification.
        else
            
            # If this is a remote font, we rely on the indicated quad size
            # for measurements. If it's a system font there will be no known
            # quad size, so we simply fix it at 1000 pixels.
            quad = (if @systemfont then 1000 else @metrics.quadsize)
            
            # Because we need to 'preload' a canvas with this
            # font, we have no idea how much surface area
            # we'll need for text measurements later on. So
            # be safe, we assign a surface that is quad² big,
            # and then when measureText is called, we'll
            # actually build a quick <span> to see how much
            # of that surface we don't need to look at.
            canvas = document.createElement("canvas")
            canvas.width = quad
            canvas.height = quad
            @canvas = canvas
            
            # The reason we preload is because some browsers
            # will also take a few milliseconds to assign a font
            # to a Canvas2D context, so if measureText is called
            # later, without this preloaded context, there is no
            # time for JavaScript to "pause" long enough for the
            # context to properly load the font, and metrics may
            # be completely wrong. The solution is normally to
            # add in a setTimeout call, to give the browser a bit
            # of a breather, but then we can't do synchronous
            # data returns, and we need a callback just to get
            # string metrics, which is about as far from desired
            # as is possible.
            context = canvas.getContext("2d")
            context.font = "1em '" + @fontFamily + "'"
            context.fillStyle = "white"
            context.fillRect -1, -1, quad + 2, quad + 2
            context.fillStyle = "black"
            context.fillText "test text", 50, quad / 2
            @context = context
            
            # ===================================================
            # Thanks to Opera and Firefox, we need to add in more
            # "you can do your thing, browser" moments. If we
            # call validate() as a straight function call, the
            # browser doesn't get the breathing space to perform
            # page styling. This is a bit mad, but until there's
            # a JS function for "make the browser update the page
            # RIGHT NOW", we're stuck with this.
            # ===================================================
            
            # We need to alias "this" because the keyword "this"
            # becomes the global context after the timeout.
            local = @
            delayedValidate = ->
                local.validate para, zerowidth, realfont, local, timeout

            setTimeout delayedValidate, 50

    
    ###
    We take a different path for System fonts, because
    we cannot inspect the actual byte code.
    ###
    processSystemFont: ()->
        
        # Mark system font use-case
        @systemfont = true
        
        # There are font-declared metrics to work with.
        @metrics = false
        
        # However, we do need to check whether the font
        # is actually installed.
        @bootstrapValidation "A", 1000

    
    ###
    This gets called when font.src is set, (the binding
    for which is at the end of this file).
    ###
    loadFont: ()->
        font = @
        
        # System font?
        if @url.indexOf(".") is -1
            setTimeout (->
                font.processSystemFont()
            ), 10
            return
        
        # Remote font.
        xhr = new XMLHttpRequest()
        xhr.open "GET", font.url, true
        xhr.responseType = "arraybuffer"
        xhr.onreadystatechange = (evt) ->
            #console.log xhr, xhr.readyState, evt
            return unless xhr.readyState is 4
            unless xhr.status is 200
                throw new Error "Can't load from #{@url}. Please, verify source urls."

            arrayBuffer = xhr.response
            if arrayBuffer
                font.data = new Uint8Array(arrayBuffer)
                font.ondownloaded()
            else
                font.onerror "Error downloading font resource from " + font.url

        xhr.send(null)

    
    ###
    Get the DOM node associated with this Font
    object, for page-injection.
    ###
    toStyleNode: ()->
        
        # If we already built it, pass that reference.
        return @styleNode    if @styleNode
        
        # If not, build a style element
        @styleNode = document.createElement("style")
        @styleNode.type = "text/css"
        styletext = "@font-face {\n"
        styletext += " font-family: '#{@fontFamily}';\n"
        styletext += " src: local('#{@fontFamily}'), url('#{@url}') format('#{@format}');\n"
        styletext += "}"
        @styleNode.innerHTML = styletext
        @styleNode

    
    ###
    Measure a specific string of text, given this font.
    If the text is too wide for our preallocated canvas,
    it will be chopped up and the segments measured
    separately.
    ###
    measureText: (textString) ->
        
        # error shortcut
        unless @loaded and not @systemfont
            throw new Error "measureText() was called while the font was not yet loaded"
            return false
        
        # Set up the right font size.
        @context.font = @.toString()
        
        # Get the initial string width through our preloaded Canvas2D context
        metrics = @context.measureText(textString)
        
        # Assign the remaining default values, because the
        # TextMetrics object is horribly deficient.
        metrics.fontsize = @fontSize
        metrics.ascent = 0
        metrics.descent = 0
        metrics.bounds =
            minx: 0
            maxx: metrics.width
            miny: 0
            maxy: 0

        metrics.height = 0
        
        # Does the text fit on the canvas? If not, we have to
        # chop it up and measure each segment separately.
        segments = []
        minSegments = metrics.width / @metrics.quadsize
        if minSegments <= 1
            segments.push textString
        else
            
            # TODO: add the chopping code here. For now this
            # code acts as placeholder
            segments.push textString
        
        # run through all segments, updating the metrics as we go.
        segmentLength = segments.length
        i = undefined
        i = 0
        while i < segmentLength
            @measureSegment segments[i], metrics
            i++
        metrics

    
    ###
    Measure a section of text, given this font, that is
    guaranteed to fit on our preallocated canvas.
    ###
    measureSegment: (textSegment, metrics) ->
        
        # Shortcut function for getting computed CSS values
        getCSSValue = (element, property) ->
            document.defaultView.getComputedStyle(element, null).getPropertyValue property

        
        # We are going to be using you ALL over the place, little variable.
        i = undefined
        
        # For text leading values, we measure a multiline
        # text container as built by the browser.
        leadDiv = document.createElement("div")
        leadDiv.style.position = "absolute"
        leadDiv.style.opacity = 0
        leadDiv.style.font = @.toString()
        numLines = 10
        leadDiv.innerHTML = textSegment
        i = 1
        while i < numLines
            leadDiv.innerHTML += "<br/>" + textSegment
            i++
        document.body.appendChild leadDiv
        
        # First we guess at the leading value, using the standard TeX ratio.
        metrics.leading = 1.2 * @fontSize
        
        # We then try to get the real value based on how
        # the browser renders the text.
        leadDivHeight = getCSSValue(leadDiv, "height")
        leadDivHeight = leadDivHeight.replace("px", "")
        metrics.leading = (leadDivHeight / numLines) | 0    if leadDivHeight >= @fontSize * numLines
        document.body.removeChild leadDiv
        
        # If we're not with a white-space-only string,
        # this is all we will be able to do.
        return metrics    if /^\s*$/.test(textSegment)
        
        # If we're not, let's try some more things.
        canvas = @canvas
        ctx = @context
        quad = (if @systemfont then 1000 else @metrics.quadsize)
        w = quad
        h = quad
        baseline = quad / 2
        padding = 50
        xpos = (quad - metrics.width) / 2
        
        # SUPER IMPORTANT, HARDCORE NECESSARY STEP:
        # xpos may be a fractional number at this point, and
        # that will *complete* screw up line scanning, because
        # cropping a canvas on fractional coordiantes does
        # really funky edge interpolation. As such, we force
        # it to an integer.
        xpos = xpos | 0    if xpos isnt (xpos | 0)
        
        # Set all canvas pixeldata values to 255, with all the content
        # data being 0. This lets us scan for data[i] != 255.
        ctx.fillStyle = "white"
        ctx.fillRect -padding, -padding, w + 2 * padding, h + 2 * padding
        
        # Then render the text centered on the canvas surface.
        ctx.fillStyle = "black"
        ctx.fillText textSegment, xpos, baseline
        
        # Rather than getting all four million+ subpixels, we
        # instead get a (much smaller) subset that we know
        # contains our text. Canvas pixel data is w*4 by h*4,
        # because {R,G,B,A} is stored as separate channels in
        # the array. Hence the factor 4.
        scanwidth = (metrics.width + padding) | 0
        scanheight = 4 * @fontSize
        x_offset = xpos - padding / 2
        y_offset = baseline - scanheight / 2
        pixelData = ctx.getImageData(x_offset, y_offset, scanwidth, scanheight).data
        
        # Set up our scanline variables
        i = 0
        j = 0
        w4 = scanwidth * 4
        len = pixelData.length
        mid = scanheight / 2
        
        # Scan 1: find the ascent using a normal, forward scan
        continue    while ++i < len and pixelData[i] is 255
        ascent = (i / w4) | 0
        
        # Scan 2: find the descent using a reverse scan
        i = len - 1
        continue    while --i > 0 and pixelData[i] is 255
        descent = (i / w4) | 0
        
        # Scan 3: find the min-x value, using a forward column scan
        i = 0
        j = 0

        while j < scanwidth and pixelData[i] is 255
            i += w4
            if i >= len
                j++
                i = (i - len) + 4
        minx = j
        
        # Scan 3: find the max-x value, using a reverse column scan
        step = 1
        i = len - 3
        j = 0

        while j < scanwidth and pixelData[i] is 255
            i -= w4
            if i < 0
                j++
                i = (len - 3) - (step++) * 4
        maxx = scanwidth - j
        
        # We have all our metrics now, so fill in the
        # metrics object and return it to the user.
        metrics.ascent = (mid - ascent)
        metrics.descent = (descent - mid)
        metrics.bounds =
            minx: minx - (padding / 2)
            maxx: maxx - (padding / 2)
            miny: -metrics.descent
            maxy: metrics.ascent

        metrics.height = 1 + (descent - ascent)
        metrics

    toString: ()->
        "#{@fontSize}px '#{@fontFamily}'"


module.exports = Font