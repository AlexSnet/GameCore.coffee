prefix = (name) ->
    name = name.charAt(0).toUpperCase() + name.slice(1)  if browserPrefix isnt ""
    browserPrefix + name

userAgent = navigator.userAgent
browserPrefix = ((userAgent.match(/opera/i) and "o") or (userAgent.match(/webkit/i) and "webkit") or (userAgent.match(/msie/i) and "ms") or (userAgent.match(/mozilla/i) and "moz") or "")

Function.prototypeproperty = (prop, desc) ->
    Object.defineProperty @prototype, prop, desc

#
#   * Extend HTMLElement to support addEventListener method.
#   
if typeof (window.addEventListener) isnt "function"
    HTMLElement.prototypeaddEventListener = (type, callback, useCapture) ->
        attachEvent "on" + type, callback

###
window.onEnterFrame
###
window.onEnterFrame = (() ->
    window.requestAnimationFrame or 
    window.webkitRequestAnimationFrame or 
    window.mozRequestAnimationFrame or 
    window.oRequestAnimationFrame or 
    window.msRequestAnimationFrame or 
    (callback) -> 
        window.setTimeout callback, 1000 / (window._FPS or 60)
)()


###
Working around Typed arrays
###
(->
    ###
    Trying to create Uint8Array. 
    If everything is ok then return, otherwise we need to create a simulation.

    Code borrowed from pdf.js (https://gist.github.com/1057924)
    ###
    try
        a = new Uint8Array(1)
        return

    # Simulating TypedArrays
    subarray = (start, end) ->
        @slice start, end

    set_ = (array, offset) ->
        i = undefined
        n = array.length
        offset = 0  if arguments_.length < 2
        i = 0
        while i < n
            this[offset] = array[i] & 0xFF
            ++i
            ++offset

    TypedArray = (arg1) ->
        result = undefined
        i = undefined
        if typeof arg1 is "number"
            result = new Array(arg1)
            i = 0
            while i < arg1
                result[i] = 0
                ++i
        else
            result = arg1.slice(0)
        
        result.subarray = subarray
        result.buffer = result
        result.byteLength = result.length
        result.set = set_
        result.buffer = arg1.buffer  if typeof arg1 is "object" and arg1.buffer
        result

    window.Uint8Array = TypedArray
    window.Uint32Array = TypedArray
    window.Int32Array = TypedArray
)()
(->
    # Also make sure XHR understands typing.
    # Code based on pdf.js (https://gist.github.com/1057924)
    
    # shortcut for Opera - it's already fine
    return  if window.opera

    # shortcuts for browsers that already implement XHR minetyping
    return  if "response" of XMLHttpRequest.prototype or "mozResponseArrayBuffer" of XMLHttpRequest.prototype or "mozResponse" of XMLHttpRequest.prototype or "responseArrayBuffer" of XMLHttpRequest.prototype
    
    getter = undefined
    
    if window.VBArray
        # If we have access to the VBArray (i.e., we're in IE), use that
        getter = ->
            new Uint8Array(new VBArray(@responseBody).toArray())
    else
        # Okay... umm.. untyped arrays? This may break completely.
        # (Android browser 2.3 and 3 don't do typed arrays)
        getter = ->
            @responseBody

    Object.defineProperty XMLHttpRequest.prototype, "response",
        get: getter
)()

#IE9 does not have binary-to-ascii built in O_O
(->
    # Code borrowed from PHP.js (http://phpjs.org/functions/base64_encode:358)
    window.btoa = (data) ->
        b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
        o1 = undefined
        o2 = undefined
        o3 = undefined
        h1 = undefined
        h2 = undefined
        h3 = undefined
        h4 = undefined
        bits = undefined
        i = 0
        ac = 0
        enc = ""
        tmp_arr = []
        return data  unless data
        loop
            o1 = data.charCodeAt(i++)
            o2 = data.charCodeAt(i++)
            o3 = data.charCodeAt(i++)
            bits = o1 << 16 | o2 << 8 | o3
            h1 = bits >> 18 & 0x3f
            h2 = bits >> 12 & 0x3f
            h3 = bits >> 6 & 0x3f
            h4 = bits & 0x3f
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
            break unless i < data.length
        enc = tmp_arr.join("")
        r = data.length % 3
        ((if r then enc.slice(0, r - 3) else enc)) + "===".slice(r or 3)
)() if not window.btoa

# (->
#     Object::extend = (others...) ->
#         for o in others
#             @[key] = val for key, val of o
#         @

# )() if not Object::extend

###
Checking for ability to work
###
ERRORS = []
# 1. Do we have a mechanism for binding implicit get/set?
if not Object.defineProperty
    ERRORS.append "Browser doesnt support Object.defineProperty."

# 2. Do we have Canvas2D available?
_testCanvas = document.createElement("canvas")
_testContext = null
try
    _testContext = _testCanvas.getContext("2d")
catch error
    _testContext = null
if not _testContext
    ERRORS.append "Browser doesnt support <canvas> and the Canvas2D API."

###
Returns a CanvasRenderingContext2D using modern context attributes when supported.
@param {HTMLCanvasElement} canvas
@param {Object} [options]
@param {Boolean} [options.willReadFrequently] Hint for frequent getImageData/readbacks
@param {Boolean} [options.alpha] Whether the canvas has an alpha channel
@param {Boolean} [options.desynchronized] Low-latency rendering hint
@param {String} [options.colorSpace] Display color space (e.g. "srgb")
@return {CanvasRenderingContext2D|null}
###
getContext2d = (canvas, options={}) ->
    return null unless canvas?.getContext

    contextOptions = {}
    contextOptions.willReadFrequently = true if options.willReadFrequently
    contextOptions.alpha = options.alpha if options.alpha?
    contextOptions.desynchronized = options.desynchronized if options.desynchronized?
    contextOptions.colorSpace = options.colorSpace if options.colorSpace?

    ctx = null
    if Object.keys(contextOptions).length
        try
            ctx = canvas.getContext("2d", contextOptions)
        catch error
            ctx = null

    ctx ?= canvas.getContext("2d")
    ctx

###
Resolves the image smoothing property name for the current browser.
@return {String|null}
###
resolveImageSmoothingProperty = ->
    probe = getContext2d(document.createElement("canvas"))
    return null unless probe
    if "imageSmoothingEnabled" of probe
        "imageSmoothingEnabled"
    else if "webkitImageSmoothingEnabled" of probe
        "webkitImageSmoothingEnabled"
    else if "mozImageSmoothingEnabled" of probe
        "mozImageSmoothingEnabled"
    else if "msImageSmoothingEnabled" of probe
        "msImageSmoothingEnabled"
    else
        null

IMAGE_SMOOTHING_PROPERTY = resolveImageSmoothingProperty()

###
Sets image smoothing on a 2D context using the standard Canvas API.
@param {CanvasRenderingContext2D} ctx
@param {Boolean} enabled
@param {String} [quality="high"] One of "low", "medium", "high"
###
setImageSmoothing = (ctx, enabled, quality="high") ->
    return unless ctx

    property = IMAGE_SMOOTHING_PROPERTY or "imageSmoothingEnabled"
    ctx[property] = enabled
    ctx.imageSmoothingQuality = quality if enabled and "imageSmoothingQuality" of ctx

###
Resets a 2D context state using the modern reset() API when available.
@param {CanvasRenderingContext2D} ctx
###
resetContext2d = (ctx) ->
    return unless ctx

    if typeof ctx.reset is "function"
        ctx.reset()
    else
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = "source-over"

getViewportSize = ->
    width: window.innerWidth or document.documentElement?.clientWidth or 0
    height: window.innerHeight or document.documentElement?.clientHeight or 0


module.exports = 
    ###
    ###
    ERRORS: ERRORS

    ###
    Browser's user-agent string
    @attribute userAgent
    @type {String}
    @static
    @readonly
    ###
    userAgent: userAgent

    ###
    Device supports touch events?
    @attribute touch
    @type {Boolean}
    @static
    @readonly
    ###
    touch: ("ontouchstart" of window)

    ###
    Device supports Retina Display?
    @attribute retina
    @type {Boolean}
    @static
    @readonly
    ###
    retina: window.devicePixelRatio > 1 or window.matchMedia("(min-resolution: 1.1dppx)").matches

    ###
    Obtain a CanvasRenderingContext2D with modern context attributes.
    @method getContext2d
    @static
    ###
    getContext2d: getContext2d

    ###
    Property name for image smoothing on the current browser.
    @attribute imageSmoothingEnabled
    @type {String|null}
    @static
    @readonly
    ###
    imageSmoothingEnabled: IMAGE_SMOOTHING_PROPERTY

    ###
    Configure image smoothing on a 2D context.
    @method setImageSmoothing
    @static
    ###
    setImageSmoothing: setImageSmoothing

    ###
    Reset a 2D context to its default state.
    @method resetContext2d
    @static
    ###
    resetContext2d: resetContext2d

    ###
    Current viewport size in CSS pixels.
    @method getViewportSize
    @static
    ###
    getViewportSize: getViewportSize