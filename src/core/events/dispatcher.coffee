###
Inspired by CreateJS/TweenJS
###

Event = require "./event"

class EventsDispatcher

    ###
    Static initializer to mix EventDispatcher methods into a target object or prototype.
    @method constructor
    @static
    @param {Object} target The target object to inject EventDispatcher methods into. This can be an instance or aprototype.
    ###
    constructor: ()->
        @_listeners = null
        @_captureListeners = null

    ###
    Adds the specified event listener. Note that adding multiple listeners to the same function will result in
    multiple callbacks getting fired.

    @example
        Object.addEventListener "click", handleClick
        handleClick = (event)->
            # Handle click function body

    @method addEventListener
    @param {String} type The string type of the event.
    @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
    @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
    @return {Function | Object} Returns the listener for chaining or assignment.
    ###
    addEventListener: (type, listener, useCapture) ->
        listeners = undefined
        if useCapture
          listeners = @_captureListeners = @_captureListeners or {}
        else
          listeners = @_listeners = @_listeners or {}
        arr = listeners[type]
        @removeEventListener type, listener, useCapture  if arr
        arr = listeners[type] # remove may have deleted the array
        unless arr
          listeners[type] = [listener]
        else
          arr.push listener
        listener

    ###
    A shortcut method for using addEventListener that makes it easier to specify an execution scope, have a listener
    only run once, associate arbitrary data with the listener, and remove the listener.

    This method works by creating an anonymous wrapper function and subscribing it with addEventListener.
    The created anonymous function is returned for use with .removeEventListener (or .off).

    @example
        listener = myBtn.on "click", handleClick, null, false, {count:3}
        handleClick = (evt, data)->
            data.count -= 1
            console.log this == myBtn # true - scope defaults to the dispatcher
            if data.count == 0
                alert "clicked 3 times!"
                myBtn.off "click", listener
                # alternately: evt.remove()

    @method on
    @param {String} type The string type of the event.
    @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when the event is dispatched.
    @param {Object} [scope] The scope to execute the listener in. Defaults to the dispatcher/currentTarget for function listeners, and to the listener itself for object listeners (ie. using handleEvent).
    @param {Boolean} [once=false] If true, the listener will remove itself after the first time it is triggered.
    @param {*} [data] Arbitrary data that will be included as the second parameter when the listener is called.
    @param {Boolean} [useCapture=false] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
    @return {Function} Returns the anonymous function that was created and assigned as the listener. This is needed to remove the listener later using .removeEventListener.
    ###
    on: (type, listener, scope, once, data, useCapture) ->
        if listener.handleEvent
            scope = scope or listener
            listener = listener.handleEvent
        scope = scope or this
        @addEventListener type, ((evt) ->
            listener.call scope, evt, data
            once and evt.remove()
        ), useCapture

    ###
    Removes the specified event listener.

    @note that you must pass the exact function reference used when the event was added. If a proxy
    function, or function closure is used as the callback, the proxy/closure reference must be used - a new proxy or
    closure will not work.

    @example
        displayObject.removeEventListener "click", handleClick

    @method removeEventListener
    @param {String} type The string type of the event.
    @param {Function | Object} listener The listener function or object.
    @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
    ###
    removeEventListener: (type, listener, useCapture) ->
        listeners = (if useCapture then @_captureListeners else @_listeners)
        return  unless listeners
        arr = listeners[type]
        return  unless arr
        i = 0
        l = arr.length

        while i < l
            if arr[i] is listener
                if l is 1 # allows for faster checks.
                    delete (listeners[type])
                else
                    arr.splice i, 1
                break
            i++

    ###
    A shortcut to the removeEventListener method, with the same parameters and return value. This is a companion to the
    .on method.

    @method off
    @param {String} type The string type of the event.
    @param {Function | Object} listener The listener function or object.
    @param {Boolean} [useCapture] For events that bubble, indicates whether to listen for the event in the capture or bubbling/target phase.
    ###
    off: @.prototype.removeEventListener

    ###
    Removes all listeners for the specified type, or all listeners of all types.

    @example Remove all listeners
        displayObject.removeAllEventListeners()

    @example Remove all click listeners
        displayObject.removeAllEventListeners "click"

    @method removeAllEventListeners
    @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
    ###
    removeAllEventListeners: (type) ->
        unless type
            @_listeners = @_captureListeners = null
        else
            delete (@_listeners[type])  if @_listeners
            delete (@_captureListeners[type])  if @_captureListeners

    ###
    Dispatches the specified event to all listeners.

    @example Use a string event
        @dispatchEvent "complete"

    @example Use an Event instance
        event = new Event "progress"
        @dispatchEvent event

    @method dispatchEvent
    @param {Object | String | Event} eventObj An object with a "type" property, or a string type.
    While a generic object will work, it is recommended to use a CreateJS Event instance. If a string is used,
    dispatchEvent will construct an Event instance with the specified type.
    @param {Object} [target] The object to use as the target property of the event object. This will default to the
    dispatching object. <b>This parameter is deprecated and will be removed.</b>
    @return {Boolean} Returns the value of eventObj.defaultPrevented.
    ###
    dispatchEvent: (eventObj, target) ->
        if typeof eventObj is "string"
          # won't bubble, so skip everything if there's no listeners:
          listeners = @_listeners
          return false  if not listeners or not listeners[eventObj]
          eventObj = new Event(eventObj)
    
        # TODO: deprecated. Target param is deprecated, only use case is MouseEvent/mousemove, remove.
        eventObj.target = target or this
        if not eventObj.bubbles or not @parent
            @_dispatchEvent eventObj, 2
        else
            top = this
            list = [top]
            list.push top = top.parent  while top.parent
            i = undefined
            l = list.length
          
            # capture & atTarget
            i = l - 1
            while i >= 0 and not eventObj.propagationStopped
                list[i]._dispatchEvent eventObj, 1 + (i is 0)
                i--
          
            # bubbling
            i = 1
            while i < l and not eventObj.propagationStopped
                list[i]._dispatchEvent eventObj, 3
                i++
            eventObj.defaultPrevented

    ###
    Indicates whether there is at least one listener for the specified event type.
    @method hasEventListener
    @param {String} type The string type of the event.
    @return {Boolean} Returns true if there is at least one listener for the specified event.
    ###
    hasEventListener: (type) ->
        listeners = @_listeners
        captureListeners = @_captureListeners
        !!((listeners and listeners[type]) or (captureListeners and captureListeners[type]))

    ###
    Indicates whether there is at least one listener for the specified event type on this object or any of its
    ancestors (parent, parent's parent, etc). A return value of true indicates that if a bubbling event of the
    specified type is dispatched from this object, it will trigger at least one listener.

    This is similar to {{#crossLink "EventDispatcher/hasEventListener"}}{{/crossLink}}, but it searches the entire
    event flow for a listener, not just this object.
    @method willTrigger
    @param {String} type The string type of the event.
    @return {Boolean} Returns `true` if there is at least one listener for the specified event.
    ###
    willTrigger: (type) ->
        o = this
        while o
            return true  if o.hasEventListener(type)
            o = o.parent
        false

    ###
    @method toString
    @return {String} a string representation of the instance.
    ###
    toString: ->
        "<EventDispatcher>"

    ###
    @method _dispatchEvent
    @param {Object | String | Event} eventObj
    @param {Object} eventPhase
    @protected
    ###
    _dispatchEvent: (eventObj, eventPhase) ->
        l = undefined
        listeners = (if (eventPhase is 1) then @_captureListeners else @_listeners)
        if eventObj and listeners
            arr = listeners[eventObj.type]
            return  if not arr or not (l = arr.length)
            eventObj.currentTarget = this
            eventObj.eventPhase = eventPhase
            eventObj.removed = false
            arr = arr.slice() # to avoid issues with items being removed or added during the dispatch
            i = 0

        while i < l and not eventObj.immediatePropagationStopped
            o = arr[i]
            if o.handleEvent
                o.handleEvent eventObj
            else
                o eventObj
        
            if eventObj.removed
                @off eventObj.type, o, eventPhase is 1
                eventObj.removed = false
            i++

module.exports = EventsDispatcher