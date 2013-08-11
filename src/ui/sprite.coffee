Widget = require "./widget"
Color = require "../utils/color"

class Sprite extends Widget
    constructor: (options={})->
        self = @
        
        @src = options.src or false
        throw new Error('No required `src` atribute in options.') if not @src
        
        @image = new Image()
        @image.onload = ()-> self._loaded()


    @_loaded: ()->
        @trigger 'loaded'


    @_render: (ctx)->
        ctx.drawImage @image @x @y @width @height

module.exports = Sprite