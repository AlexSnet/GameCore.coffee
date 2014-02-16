###
@note Inspired by CreateJS/TweenJS

A collection of Classes that are shared across all the CreateJS libraries.  The classes are included in the minified
files of each library and are available on the createsjs namespace directly.

@example
    #myObject.addEventListener "change", createjs.proxy(myMethod, scope)

@module CreateJS
@main CreateJS

###
class Event
    ###
    The type of event.
    @property type
    @type String
    ###
    type = null

    ###
    The object that generated an event.
    @property target
    @type Object
    @default null
    @readonly
    ###
    target = null

    ###
    The current target that a bubbling event is being dispatched from. For non-bubbling events, this will
    always be the same as target. For example, if childObj.parent = parentObj, and a bubbling event
    is generated from childObj, then a listener on parentObj would receive the event with
    target=childObj (the original target) and currentTarget=parentObj (where the listener was added).
    @property currentTarget
    @type Object
    @default null
    @readonly
    ###
    currentTarget = null

    ###
    For bubbling events, this indicates the current event phase:<OL>
    <LI> capture phase: starting from the top parent to the target</LI>
    <LI> at target phase: currently being dispatched from the target</LI>
    <LI> bubbling phase: from the target to the top parent</LI>
    </OL>

    @property eventPhase
    @type Number
    @default 0
    @readonly
    ###
    eventPhase = 0

    ###
    Indicates whether the event will bubble through the display list.
    @property bubbles
    @type Boolean
    @default false
    @readonly
    ###
    bubbles = false

    ###
    Indicates whether the default behaviour of this event can be cancelled via
    {{#crossLink "Event/preventDefault"}}{{/crossLink}}. This is set via the Event constructor.
    @property cancelable
    @type Boolean
    @default false
    @readonly
    ###
    cancelable = false

    ###
    The epoch time at which this event was created.
    @property timeStamp
    @type Number
    @default 0
    @readonly
    ###
    timeStamp = 0

    ###
    Indicates if {{#crossLink "Event/preventDefault"}}{{/crossLink}} has been called
    on this event.
    @property defaultPrevented
    @type Boolean
    @default false
    @readonly
    ###
    defaultPrevented = false

    ###
    Indicates if {{#crossLink "Event/stopPropagation"}}{{/crossLink}} or
    {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called on this event.
    @property propagationStopped
    @type Boolean
    @default false
    @readonly
    ###
    propagationStopped = false

    ###
    Indicates if {{#crossLink "Event/stopImmediatePropagation"}}{{/crossLink}} has been called
    on this event.
    @property immediatePropagationStopped
    @type Boolean
    @default false
    @readonly
    ###
    immediatePropagationStopped = false

    ###
    Indicates if {{#crossLink "Event/remove"}}{{/crossLink}} has been called on this event.
    @property removed
    @type Boolean
    @default false
    @readonly
    ###
    removed = false

    ###
    Initialization method.
    @method constructor
    @param {String} type The event type.
    @param {Boolean} bubbles Indicates whether the event will bubble through the display list.
    @param {Boolean} cancelable Indicates whether the default behaviour of this event can be cancelled.
    @protected
    ###
    constructor: (@type, @bubbles, @cancelable) ->
        @timeStamp = (new Date()).getTime()

    ###
    Sets {{#crossLink "Event/defaultPrevented"}}{{/crossLink}} to true.
    Mirrors the DOM event standard.
    @method preventDefault
    ###
    preventDefault: ->
        @defaultPrevented = true


    ###
    Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} to true.
    Mirrors the DOM event standard.
    @method stopPropagation
    ###
    stopPropagation: ->
        @propagationStopped = true


    ###
    Sets {{#crossLink "Event/propagationStopped"}}{{/crossLink}} and
    {{#crossLink "Event/immediatePropagationStopped"}}{{/crossLink}} to true.
    Mirrors the DOM event standard.
    @method stopImmediatePropagation
    ###
    stopImmediatePropagation: ->
        @immediatePropagationStopped = @propagationStopped = true


    ###
    Causes the active listener to be removed via removeEventListener();
    
    @example
        myBtn.addEventListener "click", (evt)->
            # do stuff...
            evt.remove() # removes this listener.

    @method remove
    ###
    remove: ->
        @removed = true


    ###
    Returns a clone of the Event instance.
    @method clone
    @return {Event} a clone of the Event instance.
    ###
    clone: ->
        new Event(@type, @bubbles, @cancelable)


    ###
    Returns a string representation of this object.
    @method toString
    @return {String} a string representation of the instance.
    ###
    toString: ->
        "<Event (type=" + @type + ")>"

module.exports = Event