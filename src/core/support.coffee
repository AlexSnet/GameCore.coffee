prefix = (name) ->
    name = name.charAt(0).toUpperCase() + name.slice(1)  if browserPrefix isnt ""
    browserPrefix + name

userAgent = navigator.userAgent
browserPrefix = ((userAgent.match(/opera/i) and "o") or (userAgent.match(/webkit/i) and "webkit") or (userAgent.match(/msie/i) and "ms") or (userAgent.match(/mozilla/i) and "moz") or "")

Function::property = (prop, desc) ->
    Object.defineProperty @prototype, prop, desc

#
#   * Extend HTMLElement to support addEventListener method.
#   
if typeof (window.addEventListener) isnt "function"
    HTMLElement::addEventListener = (type, callback, useCapture) ->
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
        # TODO: use FPS rate from render module
        window.setTimeout callback, 1000 / window._FPS
)()

module.exports = 
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

    #
    #     * Misc / Interal use
    #     
    imageSmoothingEnabled: prefix("imageSmoothingEnabled")