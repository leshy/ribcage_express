// Generated by CoffeeScript 1.8.0
(function() {
  var backbone, ejslocals, express, h, http, util, _;

  backbone = require('backbone4000');

  http = require('http');

  express = require('express');

  ejslocals = require('ejs-locals');

  h = require('helpers');

  _ = require('underscore');

  util = require('util');

  exports.lego = backbone.Model.extend4000({
    requires: 'logger',
    init: function(callback) {
      var app;
      this.env.app = app = express();
      this.settings = _.extend({
        "static": h.path(this.env.root, 'static'),
        views: h.path(this.env.root, 'static'),
        port: 80
      }, this.settings);
      if (this.settings.configure) {
        app.configure(this.settings.configure);
      } else {
        app.configure((function(_this) {
          return function() {
            app.engine('ejs', ejslocals);
            app.set('view engine', 'ejs');
            app.set('views', _this.settings.views);
            app.use(express.compress());
            app.use(express.favicon());
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.cookieParser());
            app.set('etag', true);
            app.set('x-powered-by', false);
            app.use(app.router);
            app.use(express["static"](_this.settings["static"]));
            return app.use(function(err, req, res, next) {
              _this.env.log('web request error', {
                error: util.inspect(err)
              }, 'error', 'http');
              console.error(util.inspect(err));
              if (_this.env.settings.dev) {
                return res.send(500, util.inspect(err));
              } else {
                return res.send(500, 'error 500');
              }
            });
          };
        })(this));
      }
      this.env.http = http.createServer(this.env.app);
      this.env.http.listen(this.settings.port);
      this.env.log('express listening at ' + this.settings.port, {}, 'init', 'ok');
      return callback();
    }
  });

}).call(this);
