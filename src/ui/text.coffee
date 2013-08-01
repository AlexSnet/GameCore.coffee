Widget = require "./widget"
Color = require "../utils/color"
Font = require "../utils/font"

###
Object.defineProperty this, BASELINE
@static
###
BASELINE =  
    ###
    Object.defineProperty this, BASELINE.TOP
    @type {String}
    @static
    ###
    TOP: "top"

    ###
    Object.defineProperty this, BASELINE.HANGING
    @type {String}
    @static
    ###
    HANGING: "hanging"

    ###
    Object.defineProperty this, BASELINE.MIDDLE
    @type {String}
    @static
    ###
    MIDDLE: "middle"

    ###
    Object.defineProperty this, BASELINE.ALPHABETIC
    @type {String}
    @static
    ###
    ALPHABETIC: "alphabetic"

    ###
    Object.defineProperty this, BASELINE.IDEOGRAPHIC
    @type {String}
    @static
    ###
    IDEOGRAPHIC: "ideographic"

    ###
    Object.defineProperty this, BASELINE.BOTTOM
    @type {String}
    @static
    ###
    BOTTOM: "bottom"


#  Default values
DEFAULT_FONT = new Font()
DEFAULT_COLOR = new Color("black")
DEFAULT_ALIGN = "left"
DEFAULT_BASELINE = BASELINE.TOP

###
Base Text widget
@note GameCore.exports.ui.Text
###
class Text extends Widget
    ###
    @class Text
    @extends DisplayObject

    @param {Object} options any attribute may be initialized by option
    @param {String} [options.text] default - ""
    @param {String} [options.font] default - "Normal 12px Verdana"
    @param {String} [options.align] default - "left"
    @param {String} [options.baseline] default - Joy.Text.BASELINE.TOP
    @param {String} [options.color] default - #000000

    @constructor
    ###
    constructor: (options = {}) ->
        super options

        ###
        Text to be displayed
        @attribute text
        @default ""
        @type {String}
        ###
        @text = options.text or ""

        ###
        Font family and size
        @attribute font
        @default "Normal 12px Verdana"
        @type {String}
        ###
        Object.defineProperty @, 'font',
            get: ()->
                if not @_font
                    @font = options.font or DEFAULT_FONT
                @_font

            set: (font)->
                @_font = font
                @__measure = Text.MeasureText @text, @_font

        ###
        Text horizontal alignment
        @attribute align
        @default "left"
        @type {String}
        ###
        @align = options.align or DEFAULT_ALIGN

        ###
        Text vertical baseline
        @attribute baseline
        @default Joy.Text.BASELINE.TOP
        @type {String}
        ###
        @baseline = options.baseline or DEFAULT_BASELINE

        ###
        Color of the text
        @attribute color
        @default "#000000"
        @type {String, Color}
        ###
        Object.defineProperty this, "color",
            get: ->
                if not @_color
                    @color = options.color or DEFAULT_COLOR

                @_color

            set: (color) ->
                @_color = if typeof color is "string" then new Color(color) else color
                @alpha = @_color.a

            configurable: true

        if options.stroke
            @useStroke()
        else
            @useFill()


        Object.defineProperty @, "width",
            get:->
                if not @__measure
                    @__measure = Text.MeasureText @text, @font

                if @__measure then @__measure.width else 0

        Object.defineProperty @, "height",
            get:->
                if not @__measure
                    @__measure = Text.MeasureText @text, @font

                if @__measure then @__measure.height else 0
    ###
    @method useStroke
    ###
    useStroke: ->
        @stroke = true
        @fillMethod = "strokeText"
        @styleMethod = "strokeStyle"

    ###
    @method useFill
    ###
    useFill: ->
        @stroke = false
        @fillMethod = "fillText"
        @styleMethod = "fillStyle"

    _render: (ctx) ->
        ctx.font = @font.toString()
        ctx.textAlign = @align
        ctx.textBaseline = @baseline
        ctx[@styleMethod] = @color.toString()
        ctx[@fillMethod] @text, 0, 0
        @getMeasure ctx

    ###
    @method getMeasure
    @return {TextMetrics} text metrics
    ###
    getMeasure: (ctx)->
        @__measure = {}
        m = Text.MeasureText @text,  @font
        @__measure.width = m[0]
        @__measure.height = m[1]


    Text.BASELINE = BASELINE
    
    @MeasureText : (text, font) ->
        # This global variable is used to cache repeated calls with the same arguments
        str = text + ":" + font 
        return @__measuretext_cache__[str]  if typeof (@__measuretext_cache__) is "object" and @__measuretext_cache__[str]
        div = document.createElement("DIV")
        div.innerHTML = text
        div.style.position = "absolute"
        div.style.top = "-100px"
        div.style.left = "-100px"
        div.style.font = font.toString()

        # console.log div.style.fontFamily, div.style.fontWeight, div.style.fontSize
        # div.style.fontFamily = font
        # div.style.fontWeight = (if bold then "bold" else "normal")
        # div.style.fontSize = size + "pt"
        document.body.appendChild div
        size = [div.offsetWidth, div.offsetHeight]
        document.body.removeChild div

        # Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
        @__measuretext_cache__ = {}  unless typeof (@__measuretext_cache__) is "object"
        @__measuretext_cache__[str] = size
        size


module.exports = Text