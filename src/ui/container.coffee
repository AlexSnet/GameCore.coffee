Widget = require "./widget"

###
Base widgets container
@note GameCore.exports.ui.Container
###
class Container extends Widget
    constructor: (options={})->
        super options
        @children = {}

    addChild: (child)->
        if child.parent is not @
            child.parent = @
        else
            @children[child.id] = child

    render:(ctx)->
        super ctx
        for cid, child of @children
            child.render ctx

module.exports = Container