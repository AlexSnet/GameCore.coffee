context2d = require "./context/2d"
support = require "./support"
Triggerable = require "./triggerable"
UUID = require "../math/uuid"
Stage = require "../ui/stage"

###
Game Core base class

@property {Stage} stage
@property {Boolean} fullScreen
@property {Boolean} paused
@property {Context} context
@property {Int} width
@property {Int} heigth
@property {DOMElement} renderer

@example How to create an game core 
    gc = new GameCore() # Creating core
    gc.renderer = document.body # Appends new canvas element to documents body

@example Making canvas full-sized
    gc = new GameCore() # Creating core
    gc.fullScreen = true

###
class GameCore extends Triggerable
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
        Render tick hooks
        ###
        @_render_tick_hooks = {}

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


        ###
        ###
        Object.defineProperty @, "fullScreen",
            get: ->
                @_in_the_fullscreen_now
            set: (b)->
                if b == true
                    window.addEventListener "resize", @_fullScreen_resizer
                    @_in_the_fullscreen_now = true
                    @setSize document.width, document.height
                else
                    window.removeEventListener "resize", @_fullScreen_resizer
                    @_in_the_fullscreen_now = false
                    @setSize @options.width, @options.height

        @fullScreen = @options.fullScreen

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

        if @fullScreen
            @options.width = window.width
            @options.height = window.height
        @setSize @options.width, @options.height

        ###
        Context element.
        Currently support only Context2d
        ###
        Object.defineProperty @, "context",
            get: ->
                if not @_context
                    @_context = new context2d canvas:@options.canvas
                @_context

        ###
        ###
        Object.defineProperty @, "paused",
            get: ->
                @_paused or false
            set: (paused) ->
                @_paused = if paused then true else false

        ###
        Renderer element.
        ###
        Object.defineProperty @, "renderer",
            get: ->
                @_parent_node or 'undefined'
            set: (node) ->
                if not node.tagName
                    throw Error("Can render only on document elements")
                node.appendChild @options.canvas
                @_parent_node = node

        @_onEnterFrame()

    ###
    ###
    addStage: (stage, setCurrent=false)->
        @_stages[stage.id] = stage
        @stage = stage.id if setCurrent

    ###
    Switch pause state
    ###
    pause: () ->
        @paused = not @paused
    
    ###
    Set's framerate. Not usable at the moment...
    @param {Int} framerate
    @method setFramerate
    ###
    setFramerate: (framerate=60) ->
        window._FPS = framerate

    ###
    Set size of an canvas element.
    @param {Int} width
    @param {Int} height
    @method setSize
    ###
    setSize: (width=400, height=300) ->
        @width = width
        @height = height

    _fullScreen_resizer: ()->
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
    Add render tick hook

    @method addRenderTickHook
    @param {String} name
    @param {Function} functor

    @note Render tick hooks calls after stage was rendered
    ###
    addRenderTickHook: (name, functor)->
        @_render_tick_hooks[name] = functor

    ###
    Removes render tick hook
    @method removeRenderTickHook
    @param {String} name
    ###
    removeRenderTickHook: (name)->
        delete @_render_tick_hooks[name]

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
        @context.render [@stage]
        for name, hook of @_render_tick_hooks
            hook.call()

module.exports = GameCore