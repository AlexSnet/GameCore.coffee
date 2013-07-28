###
Mathematical functions

@note GameCore.exports.Math.Math

@see http://docs.closure-library.googlecode.com/git-history/418ef20b29e8f3ebb5121266ec7206ae6943d28d/closure_goog_math_math.js.source.html
###
class Mathematics

    ###
    Clamping a number into a limits
    
    @method clamp
    @param {Number} num
    @param {Number} min
    @param {Number} max
    @return {Number}
    ###
    @clamp: (num, min, max)->
        Math.min(Math.max(num, min), max)

    ###
    Alias to @clamp(num, 0, 1)
    
    @method clamp01
    @param {Number} num
    @return {Number}
    ###
    @clamp01: (num)->
        @clamp num, 0, 1


    ###
    Returns a random integer greater than or equal to $min and less than $max.
    
    @param {Number} a  The lower bound for the random integer inclusive (default=0).
    @param {Number} a  The upper bound for the random integer exlusive (default=1000).
    @return {Number} A random integer N such that $min <= N < $max.
    ###
    @randomInt: (min=0, max=100)->
        Math.floor min + Math.random() * (max-min)

    ###
    The % operator in JavaScript returns the remainder of a / b, but differs from
    some other languages in that the result will have the same sign as the
    dividend. For example, -1 % 8 == -1, whereas in some other languages
    (such as Python) the result would be 7. This function emulates the more
    correct modulo behavior, which is useful for certain applications such as
    calculating an offset index in a circular list.
 
    @param {number} a The dividend.
    @param {number} b The divisor.
    @return {number} a % b where the result is between 0 and b (either 0 <= x < b
      or b < x <= 0, depending on the sign of b).
    ###
    @modulo: (a,b)->
        r = a%b
        if r * b < 0 then r + b else r

    ###
    Performs linear interpolation between values a and b. Returns the value
    between a and b proportional to x (when x is between 0 and 1. When x is
    outside this range, the return value is a linear extrapolation).

    @param {number} a A number.
    @param {number} b A number.
    @param {number} x The proportion between a and b.
    @return {number} The interpolated value between a and b.
    ###
    @lerp: (a,b,x)->
        a + x * (b - a)

    ###
    Tests whether the two values are equal to each other, within a certain
    tolerance to adjust for floating pount errors.
    
    @param {Number} a A number.
    @param {Number} b A number.
    @param {Number=} opt_tolerance Optional tolerance range.
        Defaults to 0.000001. If specified, should be greater than 0.
    @return {Boolean} Whether $a and $b are nearly equal.
    ###
    @nearlyEquals: (a, b, opt_tolerance=0.000001)->
        Math.abs(a - b) <= opt_tolerance

module.exports = Mathematics