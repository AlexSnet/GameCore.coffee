container = require "../ui/container"

###
Stage container
@note GameCore.exports.ui.Stage
###
class Stage extends container
    constructor:(options={})->
        super options
        @x= options.x or 0
        @y= options.y or 0

        @shaders = []

        @canvas = document.createElement 'canvas'
        @ctx = @canvas.getContext '2d'

    addShader: (shader)->
        @shaders.push shader

    render:(ctx)->
        @width = @width or ctx.canvas.width
        @height= @width or ctx.canvas.height

        if @shaders
            @canvas.width = @width
            @canvas.height= @height

            super @ctx

            for shader in @shaders
                shader.process @ctx

            data = @ctx.getImageData 0, 0, @width, @height

            ctx.putImageData data, @x, @y
        else
            super ctx

module.exports = Stage