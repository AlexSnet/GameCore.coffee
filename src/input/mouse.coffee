Vector2d = require "../math/vector2d"

class MouseCursor
    constructor: (@mouse, @x=-1, @y=-1) ->

    handleEvent: (e) ->
        coords = @mouse.eventToCanvas e
        @x = coords.x
        @y = coords.y


MouseEvents =
    ###
    Events.MOUSE_DOWN
    @type {String}
    @static
    @final
    ###
    MOUSE_DOWN: "mousedown"

    ###
    Events.MOUSE_UP
    @type {String}
    @static
    @final
    ###
    MOUSE_UP: "mouseup"

    ###
    Events.MOUSE_MOVE
    @type {String}
    @static
    @final
    ###
    MOUSE_MOVE: "mousemove"

    ###
    Events.CLICK
    @type {String}
    @static
    @final
    ###
    CLICK: "click"

    ###
    Events.DOUBLE_CLICK
    @type {String}
    @static
    @final
    ###
    DOUBLE_CLICK: "dblclick"

    ###
    TODO: not implemented yet
    only available attaching Joy.Behaviour.Button behaviour

    Events.MOUSE_OVER
    @type {String}
    @static
    @final
    ###
    MOUSE_OVER: "mouseover"


module.exports = class Mouse
    ###
    Mouse input mapped to GameCore canvas coordinates.
    ###
    constructor: (@core) ->
        if @core.mouse
            throw new Error "Mouse already attached to this core. Only one instance of mouse is allowed."

        @core.mouse = @
        @handlers = {}
        @cursor = new MouseCursor @, -1, -1
        @lastEvent = null
        @_onMouseEvent = @triggerMouseEvents()

        for eventType in [
            MouseEvents.CLICK
            MouseEvents.DOUBLE_CLICK
            MouseEvents.MOUSE_MOVE
            MouseEvents.MOUSE_DOWN
            MouseEvents.MOUSE_UP
        ]
            @handlers[eventType] = []
            @core.options.canvas.addEventListener eventType, @_onMouseEvent

    eventToCanvas: (e) ->
        canvas = @core.options.canvas
        rect = canvas.getBoundingClientRect()
        width = @core.width or rect.width or 1
        height = @core.height or rect.height or 1
        scaleX = if rect.width > 0 then width / rect.width else 1
        scaleY = if rect.height > 0 then height / rect.height else 1

        x: (e.clientX - rect.left) * scaleX
        y: (e.clientY - rect.top) * scaleY

    triggerMouseEvents: ->
        mi = @
        (e) ->
            handlers = mi.handlers[e.type]
            return unless handlers

            mi.lastEvent = e
            mi.cursor.handleEvent e

            i = 0
            while i < handlers.length
                entry = handlers[i]
                if entry.target?.visible and mi.isOver(entry.target)
                    entry.handler.call entry.target, e
                ++i

    isOver: (target) ->
        return false unless target

        x = @cursor.x
        y = @cursor.y
        left = target.x or 0
        top = target.y or 0
        right = left + (target.width or 0)
        bottom = top + (target.height or 0)

        x >= left and x <= right and y >= top and y <= bottom
