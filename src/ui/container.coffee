Widget = require "./widget"

###
Base widgets container
@note GameCore.exports.ui.Container
###
module.exports = class Container extends Widget
    constructor: (options={})->
        super options
        @children = {}

    addChild: (child)->
        if child.parent is not @
            child.parent = @
        else
            @children[child.id] = child

    _render:(ctx)->
        for cid, child of @children
            child.render ctx

    render:(ctx)->
        super ctx


