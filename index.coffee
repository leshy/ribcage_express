backbone = require 'backbone4000'
http = require 'http'
express = require 'express'
ejslocals = require 'ejs-locals'
h = require 'helpers'
_ = require 'underscore'
util = require 'util'

exports.lego = backbone.Model.extend4000
    requires: 'logger'
    init: (callback) ->
        @env.app = app = express()
        
        @settings = _.extend {
            static: h.path(@env.root, 'static')
            views: h.path(@env.root, 'static')
            port: 80
        }, @settings

        if @settings.configure then app.configure @settings.configure
        else 
            app.configure =>
                app.engine 'ejs', ejslocals
                app.set 'view engine', 'ejs'
                app.set 'views', @settings.views
                app.use express.compress()
                app.use express.favicon()
                app.use express.bodyParser()
                app.use express.methodOverride()
                app.use express.cookieParser()        
                app.set 'etag', true
                app.set 'x-powered-by', false
                app.use app.router
                app.use express.static(@settings.static)
                app.use (err, req, res, next) =>
                    @env.log 'web request error', { error: util.inspect(err) }, 'error', 'http'
                    console.error util.inspect(err)
                    if @env.settings.dev then res.send 500, util.inspect(err)
                    else res.send 500, 'error 500'
            
        @env.http = http.createServer @env.app
        @env.http.listen @settings.port
        @env.log 'express listening at ' + @settings.port, {}, 'init','ok'
        
        callback()
