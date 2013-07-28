###
Unique ID generator

@note GameCore.exports.Math.UUID

###
class UUID
    ###
    @method generateUniqueId
    @return {String}
    ###
    @generateUniqueId: ->
        "gc-" + @uuid()

    ###
    @method uuid
    @return {String}
    ###
    @uuid: ->
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) ->
            r = Math.random() * 16 | 0
            v = if c is 'x' then r else (r & 0x3|0x8)
            v.toString(16)
        )

module.exports = UUID