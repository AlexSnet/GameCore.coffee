###
Inspired by Font.js by  Mike "Pomax" Kamermans
@see http://github.com/Pomax/Font.js
###

Mathmetics = require "../math/math"

FONT_CACHE = {}

###
Font manipulations and measurement

@note GameCore.exports.Utils.Font
###
class Font
    constructor: ()->
        # if this is not specified, a random name is used
        @fontFamily = "font" + Mathmetics.randomInt(0,999999)
        