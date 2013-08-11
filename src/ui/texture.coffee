Widget = require "./widget"
Color = require "../utils/color"

class Texture extends Widget
    constructor: (options={})->
        @src = options.src or ''
        