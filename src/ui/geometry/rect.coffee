Widget = require "../widget"

module.exports = class Rect extends Widget
    constructor: (options={})->
        super options

        Object.defineProperty this, "color",
            get: ->
                if not @_color
                    @color = options.color or DEFAULT_COLOR

                @_color

            set: (color) ->
                @_color = if typeof color is "string" then new Color(color) else color
                @alpha = @_color.a

            configurable: true

    _render: (ctx)->
        ctx.fillStyle = @color.toString() if @color
        ctx.fillRect 0, 0, @width, @height
