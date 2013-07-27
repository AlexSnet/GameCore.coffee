class Context2d
    constructor: (options) ->
        @setCanvas options.canvas

    setCanvas: (@canvas) ->
        @ctx = @canvas.getContext '2d'
        @

    clear: () ->
        @ctx.clearRect 0, 0, @ctx.canvas.width, @ctx.canvas.height
        @

    render: (layers=[]) ->
        @clear()
        layer.render @ctx for layer in layers 
        
module.exports = Context2d