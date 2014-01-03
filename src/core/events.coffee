support = require './support'

class Events
    ###
    Event triggering and handling.

    @class Events
    @constructor
    ###

    constructor: (options={}) ->
        # @events = @events or {}
        # for k,v of Events
        #     @events[k]=v

        # @_handlers = options._handlers or {}
        # @_behaviours = options._behaviours or []

    on: (event, handler) ->
        # throw 'Unknown event "#{event}".' if not ~@events.indexof event
        @_eventHandlers = {} if not @_eventHandlers
        @_eventHandlers[event] = [] if not @_eventHandlers[event]
        @_eventHandlers[event].push handler if not ~@_eventHandlers[event].indexOf handler
        return @

    off: (event, fn) ->
        return @ if not @_eventHandlers
        if ~@_eventHandlers[event].indexOf fn
            @_eventHandlers[event].splice @_eventHandlers[event].indexOf fn
        return @

    trigger: (event, data) ->
        return @ if not @_eventHandlers
        (e.apply @, data for e in @_eventHandlers[event])
        return @

module.exports = Events