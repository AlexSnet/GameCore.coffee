Sprite = require "./sprite"

class AnimatedSprite extends Sprite
    constructor: (options={})->
        super options

        @frame_width = options.frame_width or 16
        @frame_height = options.frame_height or 16
        
        @frames = options.frames or {}

        @fps = options.fps or 25

    animations: ->
        for key of @frames
            key

    start: (animation, fromFrame=0)->
        self=@

        @currentFrame = fromFrame
        @currentAnimation = @frames[animation] or Object.keys(@frames)[0]

        if @_timer
            @_timer = setInterval self.update.apply(self), 1000 / @fps

    stop: ->
        if @_timer
            clearInterval @_timer

    update: ->
        @currentFrame++
        if @currentFrame >= @currentAnimation.length
            @currentFrame = 0

    _render: (ctx)->
        if @loaded
            # @TODO: make more than one animation
            ctx.drawImage @image, @frame_width * @currentFrame, 0, @frame_width, @frame_height

            # ctx.drawImage @image,
            #              @_width * (@currentAnimation.currentFrame % @_columns),
            #              @_height * ((@currentAnimation.currentFrame / @_columns) >> 0),
            #              @_width,
            #              @_height,
            #              0,
            #              0,
            #              @_width,
            #              @_height
        else
            ctx.fillRect 0, 0, @frame_width, @frame_height