###
2D Vector manipulations

@note GameCore.exports.Math.Vector2D

###
class Vector2d
    constructor: (@x=0, @y=0) ->
        ###
        Get the magnitude of this vector
        @attribute length
        @readonly
        ###
        Object.defineProperty this, "length",
            get: ->
                Math.sqrt (@x * @x) + (@y * @y)

            configurable: true


        ###
        Get this vector with a magnitude of 1.
        @attribute normalized
        @readonly
        ###
        Object.defineProperty this, "normalized",
            get: ->
                magnitude = @length
                new Vector2d @x / magnitude, @y / magnitude

            configurable: true

    ###
    @method set
    @param {Number} x
    @param {Number} y
    @return {Vector2d}
    ###
    set: (@x, @y) ->
        
    ###
    @method sum
    @param {Vector2d} vector2d
    @return {Vector2d}
    ###
    subtract: (vector2d) ->
        @x -= vector2d.x
        @y -= vector2d.y

    ###
    @method sum
    @param {Vector2d} vector2d
    @return {Vector2d}
    ###
    sum: (vector2d) ->
        @x += vector2d.x
        @y += vector2d.y

    ###
    @method scale
    @param {Number} x (or x y)
    @param {Number} y
    @return {Vector2d}
    ###
    scale: (x, y) ->
        @x *= x
        @y *= y or x
    


    ###
    @method clone
    @return {Vector2d}
    ###
    clone: ->
        new Vector2d @x, @y


    ###
    Return unit vector
    @return {Vector2d}
    ###
    unit: ->
        new Vector2d Math.cos(@x), Math.sin(@y)


    ###
    Normalize this vector
    @return {Vector2d}
    ###
    normalize: ->
        normal = @normalized
        @x = normal.x
        @y = normal.y


    ###
    Get the distance between this vector and the argument vector
    @param {Vector2d} vector
    @return {Number}
    ###
    @distance: (v1, v2) ->
        xdiff = v1.x - v2.x
        ydiff = v1.y - v2.y
        Math.sqrt xdiff * xdiff + ydiff * ydiff


    ###
    @method toString
    @return {String}
    ###
    toString: ->
        "#<Vector2d @x=#{@x}, @y=#{@y}>"

    @LEFT = new Vector2d -1, 0
    @RIGHT = new Vector2d 1, 0
    @TOP = new Vector2d 0, -1
    @BOTTOM = new Vector2d 0, 1

module.exports = Vector2d