backbone = require 'backbone4000'

exports.lego = backbone.Model.extend4000
    requires: 'logger'
    init: (callback) ->
        true