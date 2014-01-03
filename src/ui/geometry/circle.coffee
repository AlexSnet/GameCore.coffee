Widget = require "../widget"

class Circle extends Widget
    constructor: (options={})->
        super options

    _render: (ctx)->
        ctx.beginPath()
        ctx.arc @radius, @radius, @radius, 0, 2 * Math.PI
        ctx.fillStyle = @color
        ctx.fill()


    
