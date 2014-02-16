context2d = require "./context/2d"
support = require "./support"
Events = require "./events/dispatcher"
UUID = require "../math/uuid"
Stage = require "../ui/stage"

Stats = require "./debug/stats"

###
Game Core base class

@property {Stage} stage
@property {Boolean} fullWindowSize
@property {Boolean} paused
@property {Context} context
@property {Int} width
@property {Int} heigth
@property {DOMElement} renderer
@property {Boolean} debug

@example How to create an game core 
    gc = new GameCore() # Creating core
    gc.renderer = document.body # Appends new canvas element to documents body

@example Making canvas full-sized
    gc = new GameCore() # Creating core
    gc.fullWindowSize = true

###
module.exports = class GameCore extends Events
    ###
    GameCore instancec archive
    ###
    @cores = {}
    
    ###
    Start your application from here.

    @param {Object} options
    ###
    constructor: (@options={}) ->
        super @options
        ###
        In the first case we need to generate id for new instance, if it not
         present in options.
        ###
        @id = @options.id or UUID.generateUniqueId()

        ###
        Checing for runtime errors
        ###
        if support.ERRORS
            for error in support.ERRORS
                throw error

        ###
        Setting up a canvas.
        If canvas doesn't present in options then create it.
        ###
        @options.canvas = @options.canvas or @createCanvas()
        
        ###
        Registrating GameCore instance in canvas ang GameCore global.
        ###
        @options.canvas.core = @
        GameCore.cores[@id] = @

        ###
        Setting up framerate
        ###
        @setFramerate()

        ###
        Stages map
        ###
        @_stages = {}
        Object.defineProperty @, "stage",
            get: ->
                if @_current_stage_id
                    @_stages[@_current_stage_id]
                else
                    stage = new Stage
                    @_current_stage_id = stage.id
                    @addStage stage
                    stage
            set: (stage)->
                if not @_stages[stage.id]
                    @addStage stage
                @_current_stage_id = stage.id
                @dispatchEvent 'stage_changed', stage


        ###
        ###
        Object.defineProperty @, "fullWindowSize",
            get: ->
                @_in_the_fullscreen_now
            set: (b)->
                if b == true
                    window.addEventListener "resize", @_fullWindowSize_resizer
                    @_in_the_fullscreen_now = true
                    @setSize document.width, document.height
                else
                    window.removeEventListener "resize", @_fullWindowSize_resizer
                    @_in_the_fullscreen_now = false
                    @setSize @options.width, @options.height

        @fullWindowSize = @options.fullWindowSize

        ###
        ###
        Object.defineProperty @, "width",
            get: ->
                @options.canvas.width

            set: (width) ->
                @options.canvas.width = width     
                @options.canvas.style.width = width + "px"         

        ###
        ###
        Object.defineProperty @, "height",
            get: ->
                @options.canvas.height

            set: (height) ->
                @options.canvas.height = height
                @options.canvas.style.height = height + "px"     

        ###
        ###
        if @fullWindowSize
            @options.width = window.width
            @options.height = window.height
        @setSize @options.width, @options.height

        ###
        Context element.
        @note Currently support only Context2d
        @property context
        ###
        Object.defineProperty @, "context",
            get: ->
                if not @_context
                    @_context = new context2d canvas:@options.canvas
                @_context

        ###
        @property paused
        ###
        Object.defineProperty @, "paused",
            get: ->
                @_paused or false
            set: (paused) ->
                @_paused = if paused then true else false

        ###
        ###
        Object.defineProperty @, "debug",
            get: ->
                @_debug or false
            set: (debug) ->
                @_debug = !!debug   

        ###
        Renderer element.
        @property renderer
        ###
        Object.defineProperty @, "renderer",
            get: ->
                @_parent_node or 'undefined'
            set: (node) ->
                if not node.tagName
                    throw Error("Can render only on document elements")
                node.appendChild @options.canvas
                @_parent_node = node

        @_stats = new Stats @
        @_onEnterFrame()

    ###
    ###
    addStage: (stage, setCurrent=false)->
        stage = stage or new Stage
        @_stages[stage.id] = stage
        @stage = stage.id if setCurrent
        @dispatchEvent 'stage_added'
        @dispatchEvent 'stage', stage
        stage

    ###
    Switch pause state
    ###
    pause: () ->
        @paused = not @paused
        if @paused then @dispatchEvent 'paused' else @dispatchEvent 'unpaused'
    
    ###
    Set's framerate. Not usable at the moment...
    @param {Int} framerate
    @method setFramerate
    ###
    setFramerate: (framerate=60) ->
        @_FPS = framerate

    ###
    Set size of an canvas element.
    @param {Int} width
    @param {Int} height
    @method setSize
    ###
    setSize: (width=400, height=300) ->
        @width = width
        @height = height
        @dispatchEvent 'sizeChanged'

    _fullWindowSize_resizer: ()->
        gci = @
        (e) -> gci.setSize window.width, window.height
    
    ###
    Creates a canvas element
    @method createCanvas
    ###
    createCanvas: () ->
        canvas = document.createElement 'canvas'
        # document.body.appendChild canvas
        canvas

    ###
    Call window's requestAnimationFrame.
    @method _onEnterFrame
    ###
    _onEnterFrame: (gci=@)->
        unless @paused
            # Update tweening engine
            #@core.TweenManager.update()
            # Update rendering
            gci._render gci.stage
        window.onEnterFrame ()-> gci._onEnterFrame(gci)

    _render: ()-> 
        @dispatchEvent 'render_start'
        
        @stage.width = @width
        @stage.height = @height

        @context.render [@stage]
        
        @dispatchEvent 'render_end'
        @dispatchEvent 'render'

    ###
    @method addInput
    ###
    addInput: (hid)->
        unless @_installedInputs
            @_installedInputs = {}
        unless input in @_installedInputs
            input = new hid @
            @_installedInputs[hid] = input
