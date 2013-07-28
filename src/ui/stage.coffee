container = require "../ui/container"

###
Stage container
@note GameCore.exports.ui.Stage
###
class Stage extends container
    constructor:(options={})->
        super options
        @x=0
        @y=0

    render:(ctx)->
        @width = ctx.canvas.width
        @height= ctx.canvas.height
        super ctx

module.exports = Stage