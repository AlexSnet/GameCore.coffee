support = require './support'

Events =
    INIT: 'init'

class Triggerable
    ###
    Event triggering and handling.

    @class Triggerable
    @constructor
    ###

    constructor: (options={}) ->
        @events = @events or {}
        for k,v of Events
            @events[k]=v

        @_handlers = options._handlers or {}
        @_behaviours = options._behaviours or []

    ###
    Behave like a {Behaviour}
    @method behave
    @param {String | Behaviour} behaviour
    @return {Triggerable} this
    ###
    behave: (Behaviour, options) ->
        i = undefined
      
        # Split behaviours if string was given
        if typeof (Behaviour) is "string"
            last = undefined
            behaviours = Behaviour.split(",")
            i = 0
            l = behaviours.length

            while i < l
                last = @behave(Behaviours.get(behaviours[i].replace(" ", "")), options)
                i++
            return last

        @_behaviours.push Behaviour.id
        behaviour = new Behaviour(options)
      
        for i of behaviour
            if typeof (@events[i]) is "string"
                @bind @events[i], behaviour[i]
        
            # Deny 'constructor' method of being overwritten
            # Define methods on this instance
            else this[i] = behaviour[i]  if i isnt "constructor"
        
        @

    
    ###
    This object behaves as {target} behaviour?
    @method hasBehaviour
    @param {String} behaviourName
    @return {Boolean}
    ###
    hasBehaviour: (behaviour) ->
        @_behaviours.indexOf(behaviour) >= 0

    
    ###
    Bind event handler
    @method bind
    @param {String} type event type
    @param {Function} handler
    @return {Triggerable} this
    ###
    bind: (type, handler) ->
        data = handler
      
        # Custom bind
        if Triggerable._custom.bind[type] isnt `undefined`
            data =
                target: this
                handler: handler

            Triggerable._custom.bind[type].call this, data
      
        # Register bind in the instance
        @_handlers[type] = []  if @_handlers[type] is `undefined`
        @_handlers[type].push data  if @_handlers[type].indexOf(data) is -1
        @

    
    ###
    Remove event handlers
    @method unbind
    @param {String} type event type
    @return {Triggerable} this
    ###
    unbind: (type) ->
        # Custom unbind
        if Triggerable._custom.unbind[type] isnt `undefined`
            i = 0
            length = @_handlers[type].length

            while i < length
                Triggerable._custom.unbind[type].call this, @_handlers[type][i]
                ++i
      
        # Unbind from this instance
        @_handlers[type] = null
        @

    
    ###
    Triggers event type
    @method trigger
    @param {String} type event type
    @param {Array} arguments arguments for callback
    @param {Number} delay
    @optional
    ###
    trigger: (type, args, delay) ->
        handlers = @_handlers[type] or []
        args = args or []
        delay = delay or 0
        i = 0
        length = handlers.length

        while i < length
            handlers[i].apply this, args
            ++i

    broadcast: (type, args, delay) ->
        @trigger type, args, delay


    @_custom =
        bind: {}
        unbind: {}


    ###
    Register default method handler.
    @method register
    @param {String} type
    @param {Function} bindCallback
    @param {Function} unbindCallback

    @static
    ###
    @register: (type, bindCallback, unbindCallback) ->
        Triggerable._custom.bind[type] = bindCallback
        Triggerable._custom.unbind[type] = unbindCallback
        @

    
    # 'init' is triggered right when it's binded.
    Triggerable.register Events.INIT, (evt) ->
        evt.handler.call this

module.exports = Triggerable