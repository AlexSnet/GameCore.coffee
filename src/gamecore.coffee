support = require "./core/support"

window.GameCore = window.GameCore or require "./core/core"
window.GameCore.exports =
    UI: require "./ui/exports"
    Math: require "./math/exports"
    Utils: require "./utils/exports"
module.exports = GameCore