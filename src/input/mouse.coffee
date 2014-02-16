Vector2d = require "../math/vector2d"

class MouseCursor
    constructor: (@mouse, @x=-1,@y=-1)->
    handleEvent: (e)->
        @x = e.offsetX * @mouse.core.stage.viewport.scale.x;
        @y = e.offsetY * @mouse.core.stage.viewport.scale.y;
        # Mouse.collider.updateColliderPosition(J.currentEngine.currentScene.viewport.position);


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
    ###
    constructor: (@core)->
        if @core.mouse
            throw new Error "Mouse already attached to this core. Only one instance of mouse is allowed."
            return @core.mouse

        @core.mouse = @

        @handlers = {}

        @cursor = new MouseCursor()
        @lastEvent = null
        
        a = @
        @updateColliderPosition = (e) ->
            Mouse.collider.position.x = e.offsetX * J.currentEngine.currentScene.viewport.scale.x
            Mouse.collider.position.y = e.offsetY * J.currentEngine.currentScene.viewport.scale.y
            Mouse.collider.updateColliderPosition J.currentEngine.currentScene.viewport.position

        @addHandler = (eventType)->
            # console.log a, @, eventType
            a.handlers[eventType] = []
            a.core.renderer["on" + eventType] = a.triggerMouseEvents()

        @addHandler eventType for eventType in [ MouseEvents.CLICK, 
            MouseEvents.DOUBLE_CLICK, MouseEvents.MOUSE_MOVE, 
            MouseEvents.MOUSE_DOWN, MouseEvents.MOUSE_UP ]

    triggerMouseEvents: ()->
        mi = @
        (e) ->
            # console.log @, mi, e, Mouse.handlers
            handlers = mi.handlers[e.type]
            mi.lastEvent = e
            mi. e
            i = 0
            length = handlers.length

            while i < length
                handlers[i].handler.apply handlers[i].target, [e]  if handlers[i].target.visible and Mouse.isOver(handlers[i].target)
                ++i
