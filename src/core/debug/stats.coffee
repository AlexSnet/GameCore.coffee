Text = require "../../ui/text"
Widget = require "../../ui/widget"

module.exports = class Stats extends Widget
    constructor: (@core)->
        super

        @startTime = Date.now()
        @prevTime = @startTime
        @ms = 0
        @msMin = Infinity
        @msMax = 0
        @fps = 0
        @fpsMin = Infinity
        @fpsMax = 0
        @frames = 0
        @mode = 0

        me = @
        @core.on 'update', ()->
            me.update()

        ###
        Creating UI components
        ###
        @text = new GameCore.UI.Text

    update: ()->
        time = Date.now()
        @ms = time - @startTime
        @msMin = Math.min(msMin, ms)
        @msMax = Math.max(msMax, ms)
        # msText.textContent = ms + " MS (" + msMin + "-" + msMax + ")"
        # updateGraph msGraph, Math.min(30, 30 - (ms / 200) * 30)
        @frames++
        if time > prevTime + 1000
            @fps = Math.round((@frames * 1000) / (time - @prevTime))
            @fpsMin = Math.min(@fpsMin, @fps)
            @fpsMax = Math.max(@fpsMax, @fps)
            # fpsText.textContent = fps + " FPS (" + fpsMin + "-" + fpsMax + ")"
            # updateGraph fpsGraph, Math.min(30, 30 - (fps / 100) * 30)
            @prevTime = time
            @frames = 0
        @startTime = time

    _render: (ctx)->
        text.text = "FPS: #{@fps}"
        
