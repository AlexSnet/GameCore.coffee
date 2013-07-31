UUID = require "../math/uuid"
Triggerable = require "../core/triggerable"
Vector2d = require "../math/vector2d"
Matrix2d = require "../math/matrix2d"
Support = require "../core/support"
Color = require "../utils/color"

###
Base renderable element

@note GameCore.exports.ui.Widget
###
class Widget extends Triggerable
    constructor: (options={})->
        @id = UUID.generateUniqueId()
        super options

        ###
        @attribute pivot
        @type {Vector2d}
        @default 0,0
        ###
        @pivot = options.pivot or new Vector2d(options.pivotX or 0, options.pivotY or 0)
        
        ###
        @attribute skewX
        @type {Number}
        @default 0
        ###
        @skew = options.skew or new Vector2d(options.skewX or 0, options.skewY or 0)
        
        ###
        @attribute scale
        @type {Vector2d}
        @default 1,1
        ###
        @scale = options.scale or new Vector2d(options.scaleX or 1, options.scaleY or 1)
        
        ###
        @attribute alpha
        @type {Number}
        @default 1
        ###
        @alpha = (if (typeof (options.alpha) is "undefined") then 1 else options.alpha)
        
        ###
        @attribute rotation
        @type {Number}
        @default 0
        ###
        @rotation = options.rotation or 0
        
        ###
        @attribute smooth
        @type {Boolean}
        @default false
        ###
        @smooth = (if (typeof (options.smooth) is "undefined") then true else options.smooth)
        
        @_matrix = Matrix2d.identity.clone()

        Object.defineProperty @, "position",
            get:->
                if not @_position
                    @_position = new Vector2d 0, 0
                @_position
            set: (vector)->
                @_position = vector.clone()

        Object.defineProperty @, "x",
            get:->
                @position.x or 0
            set: (x)->
                @position.x = x
        @x = options.x if options.x
        
        Object.defineProperty @, "y",
            get:->
                @position.y or 0
            set: (y)->
                @position.y = y
        @y = options.y if options.y

        Object.defineProperty @, "width",
            get:->
                @_width or 10
            set: (w)->
                @_width = w
            configurable: true
        @width = options.width if options.width

        Object.defineProperty @, "height",
            get:->
                @_height or 10
            set: (h)->
                @_height = h
            configurable: true
        @height = options.height if options.height


        Object.defineProperty @, "parent",
            get:->
                @_parent or 'undefined'
            set: (parent)->
                @_parent = parent
                @_parent.addChild @
        @parent = options.parent if options.parent

        Object.defineProperty @, "drawBoundingBox",
            get:->
                @_bounding_box or false
            set:(boool)->
                @_bounding_box = boool or false
        @drawBoundingBox = options.bbox if options.bbox

    render: (ctx)->
        bit = 
            false: -1
            true: 1

        mtx = Matrix2d.identity.appendTransform(
            @position.x + @width * (@flipX + 0),
            @position.y + @height * (@flipY + 0),
            @scale.x * bit[not @flipX],
            @scale.y * bit[not @flipY],
            @rotation,
            @skew.x,
            @skew.y,
            @pivot.x,
            @pivot.y
            )
        # console.log @_matrix.clone().identity(), mtx
        
        ctx.beginPath()
        ctx.scale @scale.x, @scale.y
        ctx.translate @position.x, @position.y

        ctx.transform mtx.m11, mtx.m12, mtx.m21, mtx.m22, mtx.dx, mtx.dy
        ctx.setAlpha @alpha
        ctx.globalCompositeOperation = @compositeOperation    if @compositeOperation
        ctx[Support.imageSmoothingEnabled] = @smooth

        if @drawBoundingBox is true
            ctx.setAlpha 1
            # ctx.rect @x,@y,@width,@height
            # color = Color.random()
            # console.log color.toString()
            # ctx.fillStyle = color
            # ctx.fillRect 0,0,@width,@height
            ctx.rect 0,0,@width,@height

        ctx.setAlpha @alpha
        @_render ctx if @_render

        ctx.scale 1/@scale.x, 1/@scale.y
        ctx.translate -@position.x, -@position.y
        ctx.closePath()

module.exports = Widget