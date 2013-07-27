class Color
    ###
    @param {String | Number} hexOrRed hexadecimal color (String), or red (Number)
    @param {Number} green
    @param {Number} blue
    @param {Number} alpha

    @example
    // color name
    var color = new Joy.Color("red");

    @example
    // hexadecimal
    var color = new Joy.Color("#fff");

    @example
    // rgb
    var color = new Joy.Color(255, 50, 255);

    @example
    // rgba
    var color = new Joy.Color(255, 50, 255, 100);

    @class Color
    @constructor
    ###
    constructor: (@r=0,@g=0,@b=0,@a=1) ->

    toString:()->
        if not @green and not @blue
            r = @red
        else if @alpha
            r = "rgba( #{@red}, #{@green}, #{@blue}, #{@alpha})"
        else
            r = "rgb( #{@red}, #{@green}, #{@blue})"
        r

    @random: (alpha=255)->
        new Color parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255, 10), parseInt(Math.random() * 255,10), alpha

module.exports = Color