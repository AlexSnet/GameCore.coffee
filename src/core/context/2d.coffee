support = require "../support"

class Context2d
    constructor: (options={}) ->
        @pixelRatio = options.pixelRatio or 1
        @setCanvas options.canvas

    setCanvas: (@canvas) ->
        @ctx = support.getContext2d @canvas
        @applyPixelRatio @pixelRatio
        @

    setPixelRatio: (ratio=1) ->
        @pixelRatio = ratio or 1
        @applyPixelRatio @pixelRatio
        @

    applyPixelRatio: (ratio=1) ->
        return @ unless @ctx

        @ctx.setTransform ratio, 0, 0, ratio, 0, 0
        @

    clear: () ->
        return @ unless @ctx

        if typeof @ctx.reset is "function"
            @ctx.reset()
        else
            support.resetContext2d @ctx

        @ctx.clearRect 0, 0, @ctx.canvas.width / @pixelRatio, @ctx.canvas.height / @pixelRatio
        @applyPixelRatio @pixelRatio
        @

    render: (layers=[]) ->
        @clear()
        layer.render @ctx for layer in layers
        
module.exports = Context2d
