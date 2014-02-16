Widget = require "./widget"
Color = require "../utils/color"

module.exports = class Sprite extends Widget
    constructor: (options={})->
        super options
        self = @
        @loaded = false
        if not options.image
            throw new Error('Not found required `src` or `image` atribute in options.') if not options.src
            @image = new Image()
            @image.src = options.src
        else
            @image = options.image

        @image.addEventListener 'load', ->
                self.on_load.apply self, [options.width or false, options.height or false]

    on_load: (w,h)->
        @loaded = true
        if not w
            @width = @image.width
        if not h
            @height= @image.height

    _render: (ctx)->
        if @loaded
            ctx.drawImage @image, 0, 0, @width, @height
        else
            ctx.fillRect 0, 0, @width, @height

    clone: ->
        new Sprite
            width: @width
            height: @height
            image: @image
            parent: @parent
            position: @position
            visible: @visible
            alpha: @alpha

    ###
    @method toString
    @return {String} String representation of object
    ###
    toString: ()->
        "<Sprite (#{@id})>"

