var express = require('express')
var port = process.env.PORT || 3000
var app =  express()
var mongoose = require('mongoose')
var session = require('express-session');
var mongoStore = require('connect-mongo')(session)
var path = require('path')
var serveStatic = require('serve-static')
var multer  = require('multer');
var logger = require('morgan');
var moment = require('moment');
var fs = require('fs')

var bodyParser = require('body-parser')
var dbUrl = 'mongodb://localhost/imooc'
var cookieParser = require('cookie-parser')
var modules_path = __dirname + '/app/modules'
var walk = function(path){
    fs.readdirSync(path)
        .forEach(function(file){
            var newPath = path + '/' + file
            var stat =fs.statSync(newPath)
            if(stat.isFile()){
                if(/(.*)\.(js|coffee)/.test(file)){
                    require(newPath)
                    }
                }
            else if (stat.isDirectory()){
                walk(newPath)
            }
        })
}
walk(modules_path)
mongoose.connect(dbUrl)
app.use(cookieParser())
app.use(multer({ dest: './public/upload/'}).array('uploadPoster'))
app.use(session({
    secret:'wuzhe',
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*30
    },
    store:new mongoStore({
        url:dbUrl,
        collection:'sessions'
    })
}))
app.set('views','./app/views/pages/')
app.set('view engine','jade')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(serveStatic(path.join(__dirname,'public')))
app.locals.moment = moment
var env = process.env.NODE_ENV || 'development'
if('development' === env){
    app.set('showStackError',true)
    app.use(logger(':method :url :status'))
    app.locals.pretty = true
    mongoose.set('debug',true)
}
app.listen(port)
console.log('imovie started on port' + port)
require('./config/routes')(app)


