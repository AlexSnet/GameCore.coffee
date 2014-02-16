support = require "./core/support"

GameCore =
    Core: require "./core/core"
    UI: require "./ui/exports"
    Math: require "./math/exports"
    Utils: require "./utils/exports"
    Input: require "./input/exports"
    # Shaders: require "./shaders/exports"


if window
    window.GameCore = window.GameCore or GameCore

module.exports = GameCore