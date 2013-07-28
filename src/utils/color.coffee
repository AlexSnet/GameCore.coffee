###
Inspired by TinyColor
@see https://github.com/bgrins/TinyColor
###

Mathmetics = require "../math/math"

###
###
COLOR_NAMES =
    aliceblue: "f0f8ff"
    antiquewhite: "faebd7"
    aqua: "0ff"
    aquamarine: "7fffd4"
    azure: "f0ffff"
    beige: "f5f5dc"
    bisque: "ffe4c4"
    black: "000"
    blanchedalmond: "ffebcd"
    blue: "00f"
    blueviolet: "8a2be2"
    brown: "a52a2a"
    burlywood: "deb887"
    burntsienna: "ea7e5d"
    cadetblue: "5f9ea0"
    chartreuse: "7fff00"
    chocolate: "d2691e"
    coral: "ff7f50"
    cornflowerblue: "6495ed"
    cornsilk: "fff8dc"
    crimson: "dc143c"
    cyan: "0ff"
    darkblue: "00008b"
    darkcyan: "008b8b"
    darkgoldenrod: "b8860b"
    darkgray: "a9a9a9"
    darkgreen: "006400"
    darkgrey: "a9a9a9"
    darkkhaki: "bdb76b"
    darkmagenta: "8b008b"
    darkolivegreen: "556b2f"
    darkorange: "ff8c00"
    darkorchid: "9932cc"
    darkred: "8b0000"
    darksalmon: "e9967a"
    darkseagreen: "8fbc8f"
    darkslateblue: "483d8b"
    darkslategray: "2f4f4f"
    darkslategrey: "2f4f4f"
    darkturquoise: "00ced1"
    darkviolet: "9400d3"
    deeppink: "ff1493"
    deepskyblue: "00bfff"
    dimgray: "696969"
    dimgrey: "696969"
    dodgerblue: "1e90ff"
    firebrick: "b22222"
    floralwhite: "fffaf0"
    forestgreen: "228b22"
    fuchsia: "f0f"
    gainsboro: "dcdcdc"
    ghostwhite: "f8f8ff"
    gold: "ffd700"
    goldenrod: "daa520"
    gray: "808080"
    green: "008000"
    greenyellow: "adff2f"
    grey: "808080"
    honeydew: "f0fff0"
    hotpink: "ff69b4"
    indianred: "cd5c5c"
    indigo: "4b0082"
    ivory: "fffff0"
    khaki: "f0e68c"
    lavender: "e6e6fa"
    lavenderblush: "fff0f5"
    lawngreen: "7cfc00"
    lemonchiffon: "fffacd"
    lightblue: "add8e6"
    lightcoral: "f08080"
    lightcyan: "e0ffff"
    lightgoldenrodyellow: "fafad2"
    lightgray: "d3d3d3"
    lightgreen: "90ee90"
    lightgrey: "d3d3d3"
    lightpink: "ffb6c1"
    lightsalmon: "ffa07a"
    lightseagreen: "20b2aa"
    lightskyblue: "87cefa"
    lightslategray: "789"
    lightslategrey: "789"
    lightsteelblue: "b0c4de"
    lightyellow: "ffffe0"
    lime: "0f0"
    limegreen: "32cd32"
    linen: "faf0e6"
    magenta: "f0f"
    maroon: "800000"
    mediumaquamarine: "66cdaa"
    mediumblue: "0000cd"
    mediumorchid: "ba55d3"
    mediumpurple: "9370db"
    mediumseagreen: "3cb371"
    mediumslateblue: "7b68ee"
    mediumspringgreen: "00fa9a"
    mediumturquoise: "48d1cc"
    mediumvioletred: "c71585"
    midnightblue: "191970"
    mintcream: "f5fffa"
    mistyrose: "ffe4e1"
    moccasin: "ffe4b5"
    navajowhite: "ffdead"
    navy: "000080"
    oldlace: "fdf5e6"
    olive: "808000"
    olivedrab: "6b8e23"
    orange: "ffa500"
    orangered: "ff4500"
    orchid: "da70d6"
    palegoldenrod: "eee8aa"
    palegreen: "98fb98"
    paleturquoise: "afeeee"
    palevioletred: "db7093"
    papayawhip: "ffefd5"
    peachpuff: "ffdab9"
    peru: "cd853f"
    pink: "ffc0cb"
    plum: "dda0dd"
    powderblue: "b0e0e6"
    purple: "800080"
    red: "f00"
    rosybrown: "bc8f8f"
    royalblue: "4169e1"
    saddlebrown: "8b4513"
    salmon: "fa8072"
    sandybrown: "f4a460"
    seagreen: "2e8b57"
    seashell: "fff5ee"
    sienna: "a0522d"
    silver: "c0c0c0"
    skyblue: "87ceeb"
    slateblue: "6a5acd"
    slategray: "708090"
    slategrey: "708090"
    snow: "fffafa"
    springgreen: "00ff7f"
    steelblue: "4682b4"
    tan: "d2b48c"
    teal: "008080"
    thistle: "d8bfd8"
    tomato: "ff6347"
    turquoise: "40e0d0"
    violet: "ee82ee"
    wheat: "f5deb3"
    white: "fff"
    whitesmoke: "f5f5f5"
    yellow: "ff0"
    yellowgreen: "9acd32"

trimLeft = /^[\s,#]+/
trimRight = /\s+$/

# `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
flip = (o) ->
    flipped = {}
    for k,v of o
      flipped[v] = k
    flipped

# Take input from [0, n] and return it as [0, 1]
bound01 = (n, max) ->
    n = "100%"  if isOnePointZero(n)
    processPercent = isPercentage(n)
    n = Math.min(max, Math.max(0, parseFloat(n)))

    # Automatically convert percentage into number
    n = parseInt(n * max, 10) / 100  if processPercent

    # Handle floating point rounding errors
    return 1  if Math.abs(n - max) < 0.000001

    # Convert into [0, 1] range if it isn't already
    (n % max) / parseFloat(max)

# Parse an integer into hex
parseHex = (val) ->
    parseInt val, 16

# Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
# <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
isOnePointZero = (n) ->
    typeof n is "string" and n.indexOf(".") isnt -1 and parseFloat(n) is 1

# Check to see if string passed in is a percentage
isPercentage = (n) ->
    typeof n is "string" and n.indexOf("%") isnt -1

# Force a hex value to have 2 characters
pad2 = (c) ->
    (if c.length is 1 then "0" + c else "" + c)

# Replace a decimal with it's percentage value
convertToPercentage = (n) ->
    n = (n * 100) + "%"  if n <= 1
    n

COLOR_NAMES_F = flip(COLOR_NAMES)


CSS_INTEGER = "[-\\+]?\\d+%?"
CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?"
CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")"
PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?"
PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?"

matchers =
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3)
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4)
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3)
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4)
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3)
    hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/
    hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/


###
Color operations

@note GameCore.exports.utils.Color
###
class Color
    ###
    @param {String | Color} hex color string or color name or Color instance
    @param {Object} options
    ###
    constructor: (color="", opts={}) ->
        rgb = Color.inputToRGB(color)
        
        @r = rgb.r
        @g = rgb.g
        @b = rgb.b
        @a = rgb.a
        
        @roundA = Math.round(100 * @a) / 100
        format = opts.format or rgb.format or false
        
        # Don't let the range of [0,255] come back in [0,1].
        # Potentially lose a little bit of precision here, but will fix issues where
        # .5 gets interpreted as half of the total, instead of half of 1
        # If it was supposed to be 128, this was already taken care of by `inputToRgb`
        @r = Math.round(@r)  if @r < 1
        @g = Math.round(@g)  if @g < 1
        @b = Math.round(@b)  if @b < 1

    ###
    @method toHsv
    @return {Object} {h,s,v,a}
    ###
    toHsv: ->
        hsv = Color.rgbToHsv(@r, @g, @b)
        h: hsv.h * 360
        s: hsv.s
        v: hsv.v
        a: @a

    ###
    @method toHsvString
    @return {String}
    ###
    toHsvString: ->
        hsv = Color.rgbToHsv(@r, @g, @b)
        h = Math.round(hsv.h * 360)
        s = Math.round(hsv.s * 100)
        v = Math.round(hsv.v * 100)
        (if (@a is 1) then "hsv(" + h + ", " + s + "%, " + v + "%)" else "hsva(" + h + ", " + s + "%, " + v + "%, " + @roundA + ")")

    ###
    @method toHsl
    @return {Object} {h,s,l,a}
    ###
    toHsl: ->
        hsl = Color.rgbToHsl(@r, @g, @b)

        h: hsl.h * 360
        s: hsl.s
        l: hsl.l
        a: @a

    ###
    @method toHslString
    @return {String}
    ###
    toHslString: ->
        hsl = Color.rgbToHsl(@r, @g, @b)
        h = Math.round(hsl.h * 360)
        s = Math.round(hsl.s * 100)
        l = Math.round(hsl.l * 100)
        if (@a is 1) then  "hsl(" + h + ", " + s + "%, " + l + "%)" else "hsla(" + h + ", " + s + "%, " + l + "%, " + @roundA + ")"

    ###
    @method toHex
    @param {Boolean} allow3Char defaults=false
    @return {String}
    ###
    toHex: (allow3Char=false) ->
        Color.rgbToHex @r, @g, @b, allow3Char

    ###
    @method toHexString
    @param {Boolean} allow3Char defaults=false
    @return {String} # + toHex()
    ###
    toHexString: (allow3Char=false) ->
        "#" + @toHex allow3Char

    ###
    @method toRgb
    @return {Object} {r,g,b,a}
    ###
    toRgb: ->
        r: Math.round(@r)
        g: Math.round(@g)
        b: Math.round(@b)
        a: @a

    ###
    @method toRgbString
    @return {String}
    ###
    toRgbString: ->
        (if (@a is 1) then "rgb(" + Math.round(@r) + ", " + Math.round(@g) + ", " + Math.round(@b) + ")" else "rgba(" + Math.round(@r) + ", " + Math.round(@g) + ", " + Math.round(@b) + ", " + @roundA + ")")


    toPercentageRgb: ->
        r: Math.round(bound01(@r, 255) * 100) + "%"
        g: Math.round(bound01(@g, 255) * 100) + "%"
        b: Math.round(bound01(@b, 255) * 100) + "%"
        a: @a

    toPercentageRgbString: ->
        (if (@a is 1) then "rgb(" + Math.round(bound01(@r, 255) * 100) + "%, " + Math.round(bound01(@g, 255) * 100) + "%, " + Math.round(bound01(@b, 255) * 100) + "%)" else "rgba(" + Math.round(bound01(@r, 255) * 100) + "%, " + Math.round(bound01(@g, 255) * 100) + "%, " + Math.round(bound01(@b, 255) * 100) + "%, " + @a + ")")

    toName: ->
        return "transparent"  if @a is 0
        COLOR_NAMES_F[Color.rgbToHex(@r, @g, @b, true)] or false

    ###
    Outputing current color as string
    ###
    toString: (format) ->
        formatSet = !!format
        format = format or @format
        formattedString = false
        hasAlphaAndFormatNotSet = not formatSet and @a < 1 and @a > 0
        formatWithAlpha = hasAlphaAndFormatNotSet and (format is "hex" or format is "hex6" or format is "hex3" or format is "name")
        formattedString = @toRgbString()  if format is "rgb"
        formattedString = @toPercentageRgbString()  if format is "prgb"
        formattedString = @toHexString()  if format is "hex" or format is "hex6"
        formattedString = @toHexString(true)  if format is "hex3"
        formattedString = @toName()  if format is "name"
        formattedString = @toHslString()  if format is "hsl"
        formattedString = @toHsvString()  if format is "hsv"
        
        return if formatWithAlpha then @toRgbString() else formattedString or @toHexString()


    ###
    If input is an object, force 1 into "1.0" to handle ratios properly
    String input requires "1.0" as input, so 1 will be treated as 1

    Given a string or object, convert that input to RGB
    Possible string inputs:
    
    "red"
    "#f00" or "f00"
    "#ff0000" or "ff0000"
    "rgb 255 0 0" or "rgb (255, 0, 0)"
    "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    
    @param {String | Color} color
    
    ###
    @inputToRGB: (color) ->
        rgb =
          r: 0
          g: 0
          b: 0

        a = 1
        ok = false
        format = false
        color = stringInputToObject(color)  if typeof color is "string"
        if typeof color is "object"
            if color.hasOwnProperty("r") and color.hasOwnProperty("g") and color.hasOwnProperty("b")
                rgb = Color.rgbToRgb(color.r, color.g, color.b)
                ok = true
                format = (if String(color.r).substr(-1) is "%" then "prgb" else "rgb")
            else if color.hasOwnProperty("h") and color.hasOwnProperty("s") and color.hasOwnProperty("v")
                color.s = convertToPercentage(color.s)
                color.v = convertToPercentage(color.v)
                rgb = Color.hsvToRgb(color.h, color.s, color.v)
                ok = true
                format = "hsv"
            else if color.hasOwnProperty("h") and color.hasOwnProperty("s") and color.hasOwnProperty("l")
                color.s = convertToPercentage(color.s)
                color.l = convertToPercentage(color.l)
                rgb = Color.hslToRgb(color.h, color.s, color.l)
                ok = true
                format = "hsl"
            a = color.a  if color.hasOwnProperty("a")
        a = parseFloat(a)

        # Handle invalid alpha characters by setting to 1
        a = 1  if isNaN(a) or a < 0 or a > 1
        
        ok: ok
        format: color.format or format
        r: Math.min(255, Math.max(rgb.r, 0))
        g: Math.min(255, Math.max(rgb.g, 0))
        b: Math.min(255, Math.max(rgb.b, 0))
        a: a

    # Conversion Functions
    # --------------------    
    # `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    # <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
    
    ###
    Handle bounds / percentage checking to conform to CSS color spec
    <http://www.w3.org/TR/css3-color/>
    
    @method rgbToRgb

    @param {Integer} r in 0..255 or 0..1
    @param {Integer} g in 0..255 or 0..1
    @param {Integer} b in 0..255 or 0..1
    
    @return {Object} { r, g, b } in 0..255
    ###
    @rgbToRgb: (r, g, b) ->
        r: bound01(r, 255) * 255
        g: bound01(g, 255) * 255
        b: bound01(b, 255) * 255

    ###
    Converts an RGB color value to HSL.
    
    @method rgbToHsl
    
    @param {Integer} r in 0..255 or 0..1
    @param {Integer} g in 0..255 or 0..1
    @param {Integer} b in 0..255 or 0..1
    
    @return {Object} { h, s, l } in 0..1
    ###
    @rgbToHsl: (r, g, b) ->
        r = bound01(r, 255)
        g = bound01(g, 255)
        b = bound01(b, 255)

        max = Math.max(r, g, b)
        min = Math.min(r, g, b)
        
        h = undefined
        s = undefined
        l = (max + min) / 2

        if max is min
            h = s = 0 # achromatic
        else
            d = max - min
            s = (if l > 0.5 then d / (2 - max - min) else d / (max + min))
            switch max
                when r
                    h = (g - b) / d + ((if g < b then 6 else 0))
                when g
                    h = (b - r) / d + 2
                when b
                    h = (r - g) / d + 4
            h /= 6

        h: h
        s: s
        l: l

    ###
    Converts an HSL color value to RGB.

    @method hslToRgb
    @param {Integer} h in 0..360 or 0..1
    @param {Integer} s in 0..100 or 0..1
    @param {Integer} l in 0..100 or 0..1
    @return {Object} { r, g, b } in 0..255
    ###
    @hslToRgb: (h, s, l) ->
        hue2rgb = (p, q, t) ->
            t += 1  if t < 0
            t -= 1  if t > 1
            return p + (q - p) * 6 * t  if t < 1 / 6
            return q  if t < 1 / 2
            return p + (q - p) * (2 / 3 - t) * 6  if t < 2 / 3
            p

        r = undefined
        g = undefined
        b = undefined

        h = bound01(h, 360)
        s = bound01(s, 100)
        l = bound01(l, 100)
        
        if s is 0
            r = g = b = l # achromatic
        else
            q = (if l < 0.5 then l * (1 + s) else l + s - l * s)
            p = 2 * l - q
            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)

        r: r * 255
        g: g * 255
        b: b * 255

    ###
    Converts an RGB color value to HSV

    @method rgbToHsv
    @param {Integer} r in 0..255 or 0..1
    @param {Integer} g in 0..255 or 0..1
    @param {Integer} b in 0..255 or 0..1
    @return {Object} { h, s, v } in 0..1
    ###
    @rgbToHsv: (r, g, b) ->
        r = bound01(r, 255)
        g = bound01(g, 255)
        b = bound01(b, 255)
        
        max = Math.max(r, g, b)
        min = Math.min(r, g, b)
        
        h = undefined
        s = undefined
        v = max
        d = max - min
        s = (if max is 0 then 0 else d / max)
        
        if max is min
            h = 0 # achromatic
        else
            switch max
                when r
                  h = (g - b) / d + ((if g < b then 6 else 0))
                when g
                  h = (b - r) / d + 2
                when b
                  h = (r - g) / d + 4
            h /= 6

        h: h
        s: s
        v: v

    ###
    Converts an HSV color value to RGB.

    @method hsvToRgb
    @param {Integer} h in 0..360 or 0..1
    @param {Integer} s in 0..100 or 0..1
    @param {Integer} v in 0..100 or 0..1
    @return {Object} { r, g, b } in 0..255
    ###
    @hsvToRgb: (h, s, v) ->
        h = bound01(h, 360) * 6
        s = bound01(s, 100)
        v = bound01(v, 100)
        i = Math.floor(h)
        f = h - i
        p = v * (1 - s)
        q = v * (1 - f * s)
        t = v * (1 - (1 - f) * s)
        mod = i % 6
        r = [v, q, p, p, t, v][mod]
        g = [t, v, v, q, p, p][mod]
        b = [p, p, t, v, v, q][mod]
        r: r * 255
        g: g * 255
        b: b * 255

    ###
    Converts an RGB color to hex

    @method rgbToHex
    @param {Integer} r in 0..255
    @param {Integer} g in 0..255
    @param {Integer} b in 0..255
    @param {Boolean} allow3Char
    @return {String} 3 or 6 character hex
    ###
    @rgbToHex: (r, g, b, allow3Char=false) ->
        hex = [
            pad2(Math.round(r).toString(16)),
            pad2(Math.round(g).toString(16)),
            pad2(Math.round(b).toString(16))
        ]

        # Return a 3 character hex if possible
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) if allow3Char and hex[0].charAt(0) is hex[0].charAt(1) and hex[1].charAt(0) is hex[1].charAt(1)  and hex[2].charAt(0) is hex[2].charAt(1)
        hex.join ""

###
Permissive string parsing. Take in a number of formats, and output an object
based on detected format.
@method stringInputToObject
@param {String | Color} color
@return {Object} `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
###
stringInputToObject = (color) ->
    color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase()
    named = false
    if COLOR_NAMES[color]
        color = COLOR_NAMES[color]
        named = true
    else if color is "transparent"
        r: 0
        g: 0
        b: 0
        a: 0
        format: "name"
        
    # Try to match string input using regular expressions.
    # Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    # Just return an object and let the conversion functions handle that.
    # This way the result will be the same whether the Color is initialized with string or object.
    match = undefined
    if match = matchers.rgb.exec(color)
      return (
        r: match[1]
        g: match[2]
        b: match[3]
      )
    if match = matchers.rgba.exec(color)
      return (
        r: match[1]
        g: match[2]
        b: match[3]
        a: match[4]
      )
    if match = matchers.hsl.exec(color)
      return (
        h: match[1]
        s: match[2]
        l: match[3]
      )
    if match = matchers.hsla.exec(color)
      return (
        h: match[1]
        s: match[2]
        l: match[3]
        a: match[4]
      )
    if match = matchers.hsv.exec(color)
      return (
        h: match[1]
        s: match[2]
        v: match[3]
      )
    if match = matchers.hex6.exec(color)
      return (
        r: parseHex(match[1])
        g: parseHex(match[2])
        b: parseHex(match[3])
        format: (if named then "name" else "hex")
      )
    if match = matchers.hex3.exec(color)
      return (
        r: parseHex(match[1] + "" + match[1])
        g: parseHex(match[2] + "" + match[2])
        b: parseHex(match[3] + "" + match[3])
        format: (if named then "name" else "hex")
      )
    false

Color.fromRatio = (color, opts={}) ->
    if typeof color is "object"
        newColor = {}
        for i of color
            if color.hasOwnProperty(i)
                if i is "a"
                    newColor[i] = color[i]
                else
                    newColor[i] = convertToPercentage(color[i])
        color = newColor
    new Color color, opts

Color.equals = (color1, color2) ->
    return false  if not color1 or not color2
    (new Color color1).toRgbString() is (new Color color2).toRgbString()

Color.random = ->
    Color.fromRatio
      r: Math.random()
      g: Math.random()
      b: Math.random()


Color.desaturate = (color, amount=10) ->
    hsl = (new Color color).toHsl()
    hsl.s -= amount / 100
    hsl.s = Mathematic.clamp01(hsl.s)
    new Color hsl

Color.saturate = (color, amount=10) ->
    hsl = (new Color color).toHsl()
    hsl.s += amount / 100
    hsl.s = Mathematic.clamp01(hsl.s)
    new Color hsl

Color.greyscale = (color) ->
    Color.desaturate color, 100

Color.lighten = (color, amount=10) ->
    hsl = (new Color color).toHsl()
    hsl.l += amount / 100
    hsl.l = Mathematic.clamp01(hsl.l)
    new Color hsl

Color.darken = (color, amount=10) ->
    hsl = (new Color color).toHsl()
    hsl.l -= amount / 100
    hsl.l = Mathematic.clamp01(hsl.l)
    new Color hsl

Color.complement = (color) ->
    hsl = (new Color color).toHsl()
    hsl.h = (hsl.h + 180) % 360
    new Color hsl

Color.triad = (color) ->
    hsl = (new Color(color)).toHsl()
    h = hsl.h
    [
        new Color(color),
        new Color(
            h: (h + 120) % 360
            s: hsl.s
            l: hsl.l
        ),
        new Color(
            h: (h + 240) % 360
            s: hsl.s
            l: hsl.l
        )
    ]

Color.tetrad = (color) ->
    hsl = (new Color color).toHsl()
    h = hsl.h
    [
        new Color(color),
        new Color(
            h: (h + 90) % 360
            s: hsl.s
            l: hsl.l
        ),
        new Color(
            h: (h + 180) % 360
            s: hsl.s
            l: hsl.l
        ),
        new Color(
            h: (h + 270) % 360
            s: hsl.s
            l: hsl.l
        )
    ]

Color.splitcomplement = (color) ->
    hsl = (new Color color).toHsl()
    h = hsl.h
    [
        new Color(color),
        new Color(
            h: (h + 72) % 360
            s: hsl.s
            l: hsl.l
        ),
        new Color(
            h: (h + 216) % 360
            s: hsl.s
            l: hsl.l
        )
    ]

Color.analogous = (color, results=6, slices=30) ->
    hsl = (new Color color).toHsl()
    part = 360 / slices
    ret = [new Color(color)]
    hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360
    while --results
      hsl.h = (hsl.h + part) % 360
      ret.push(new Color hsl)
    ret

Color.monochromatic = (color, results=6) ->
    hsv = (new Color color).toHsv()
    h = hsv.h
    s = hsv.s
    v = hsv.v
    ret = []
    modification = 1 / results
    while results--
      ret.push Color(
        h: h
        s: s
        v: v
      )
      v = (v + modification) % 1
    ret

Color.readability = (color1, color2) ->
    a = (new Color color1).toRgb()
    b = (new Color color2).toRgb()
    brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000
    brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000
    colorDiff = (Math.max(a.r, b.r) - Math.min(a.r, b.r) + Math.max(a.g, b.g) - Math.min(a.g, b.g) + Math.max(a.b, b.b) - Math.min(a.b, b.b))
    
    brightness: Math.abs(brightnessA - brightnessB)
    color: colorDiff

Color.readable = (color1, color2) ->
    readability = Color.readability(color1, color2)
    readability.brightness > 125 and readability.color > 500

Color.mostReadable = (baseColor, colorList) ->
    bestColor = null
    bestScore = 0
    bestIsReadable = false
    i = 0

    while i < colorList.length
      readability = Color.readability(baseColor, colorList[i])
      readable = readability.brightness > 125 and readability.color > 500
      score = 3 * (readability.brightness / 125) + (readability.color / 500)
      if (readable and not bestIsReadable) or (readable and bestIsReadable and score > bestScore) or ((not readable) and (not bestIsReadable) and score > bestScore)
        bestIsReadable = readable
        bestScore = score
        bestColor = new Color colorList[i]
      i++
    bestColor

module.exports = Color