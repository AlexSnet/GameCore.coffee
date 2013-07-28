###
2D Matrix manipulations

@note GameCore.exports.Math.Matrix2D

###
class Matrix2D
    ###
    Based on [EaselJS](https://github.com/CreateJS/EaselJS/) Matrix2D implementation.

    @class Matrix2D
    @constructor

    @param {Number} m11
    @param {Number} m12
    @param {Number} m21
    @param {Number} m22
    @param {Number} dx
    @param {Number} dy
    ###
    constructor: (m11, m12, m21, m22, dx, dy) ->
        @m11 = m11  if m11 isnt null
        @m12 = m12 or 0
        @m21 = m21 or 0
        @m22 = m22  if m22 isnt null
        @dx = dx or 0
        @dy = dy or 0
    
    ###
    Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
    For example, you can use this to generate m11 matrix from m11 display object: var mtx = new Matrix2D();
    mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
    @method appendTransform
    @param {Number} x
    @param {Number} y
    @param {Number} scaleX
    @param {Number} scaleY
    @param {Number} rotation
    @param {Number} skewX
    @param {Number} skewY
    @param {Number} pivotX Optional.
    @param {Number} pivotY Optional.
    @return {Matrix2D} This matrix. Useful for chaining method calls.
    ###
    appendTransform: (x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY) ->
        cos = undefined
        sin = undefined
        r = undefined

        if rotation % 360
            r = rotation * Matrix2D.DEG_TO_RAD
            cos = Math.cos(r)
            sin = Math.sin(r)
        else
            cos = 1
            sin = 0
        
        if skewX or skewY
            # TODO: can this be combined into m11 single append?
            skewX *= Matrix2D.DEG_TO_RAD
            skewY *= Matrix2D.DEG_TO_RAD
            @append Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y
            @append cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0
        else
            @append cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y
        
        if pivotX or pivotY  
            # prepend the registration offset:
            @dx -= pivotX * @m11 + pivotY * @m21
            @dy -= pivotX * @m12 + pivotY * @m22
        @

    ###
    Appends the specified matrix properties with this matrix. All parameters are required.
    @method append
    @param {Number} m11
    @param {Number} m12
    @param {Number} m21
    @param {Number} m22
    @param {Number} dx
    @param {Number} dy
    @return {Matrix2D} This matrix. Useful for chaining method calls.
    ###
    append: (m11, m12, m21, m22, dx, dy) ->
        a1 = @m11
        b1 = @m12
        c1 = @m21
        d1 = @m22
        @m11 = m11 * a1 + m12 * c1
        @m12 = m11 * b1 + m12 * d1
        @m21 = m21 * a1 + m22 * c1
        @m22 = m21 * b1 + m22 * d1
        @dx = dx * a1 + dy * c1 + @dx
        @dy = dx * b1 + dy * d1 + @dy
        @

    ###
    Inverts the matrix, causing it to perform the opposite transformation.
    @method invert
    @return {Matrix2D} this
    ###
    invert: ->
        a1 = @m11
        b1 = @m12
        c1 = @m21
        d1 = @m22
        tx1 = @dx
        n = a1 * d1 - b1 * c1
        @m11 = d1 / n
        @m12 = -b1 / n
        @m21 = -c1 / n
        @m22 = a1 / n
        @dx = (c1 * @dy - d1 * tx1) / n
        @dy = -(a1 * @dy - b1 * tx1) / n
        @

    ###
    Clone Matrix2D instance
    @return {Matrix2D}
    ###
    clone: ->
        new Matrix2D(@m11, @m12, @m21, @m22, @dx, @dy)


    ###
    Reset matrix to it's identity
    @return {Matrix2D} this
    ###
    identity: ->
        @m11 = @m22 = 1
        @m12 = @m21 = @dx = @dy = 0
        @

    ###           
    Multiplier for converting degrees to radians. Used internally by Matrix2D.

    @attribute DEG_TO_RAD
    @static
    @readonly
    @return {Number}
    ###
    @DEG_TO_RAD:  Math.PI / 180
    @identity: new Matrix2D(1, 0, 0, 1, 0, 0)

module.exports = Matrix2D
