var Index =require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')
var Comment = require('../app/controllers/comment')
var Category = require('../app/controllers/category')
var Website = require('../app/controllers/website')
module.exports = function(app) {
//pre
    app.use(function (req, res, next){
        _user = req.session.user
        app.locals.user = _user
        return next()
    })
//index page
    app.get('/',Index.index )
    app.get('/lantern',User.signinRequired,Index.lantern)

//signup
    app.post('/user/signup',User.signup )
    app.get('/admin/user/list',User.signinRequired,User.adminRequired, User.userlist)
    app.delete('/admin/user/del',User.signinRequired, User.del)
    app.get('/admin/user/update/:id',User.signinRequired, User.update)
    app.post('/admin/user/save',User.signinRequired, User.save)
    app.post('/user/signin', User.signin)
    app.get('/signin',User.showSignin)
    app.get('/signup',User.showSignup)
    app.get('/logout', User.logout)
    app.get('/admin/user/check',User.check)

//movie
//detail page
    app.get('/imovie',User.signinRequired,Index.index)
    app.get('/movie/:id',User.signinRequired,Movie.detail)
//admin update movie
    app.get('/admin/movie/update/:id',User.signinRequired,Movie.update)
//admin post movie
    app.post('/admin/movie/save',User.signinRequired,Movie.savePoster,Movie.save)
//list page
    app.get('/admin/movie/list',User.signinRequired, Movie.list)
//admin new page
    app.get('/admin/movie/new',User.signinRequired,Movie.new)
//list delete movie
    app.delete('/admin/movie/list',User.signinRequired,Movie.del)

//comment save
    app.post('/user/comment',User.signinRequired,Comment.save)


//category new
    app.get('/admin/category/new',User.signinRequired,Category.new)
    app.delete('/admin/category/del',User.signinRequired,Category.del)
    app.post('/admin/category',User.signinRequired,Category.save)
    app.get('/admin/category/list',User.signinRequired,Category.list)

//results
    app.get('/results',Index.search)

//website
    app.get('/website/search',User.signinRequired,Index.index2)
    app.get('/admin/website/new',User.signinRequired,User.adminRequired,Website.new)
    app.post('/admin/website/save',User.signinRequired,User.adminRequired,Website.save)
    app.get('/admin/website/list',User.signinRequired,User.adminRequired,Website.websiteAdminFilter,Website.list)
    app.delete('/admin/website/del',User.signinRequired,User.adminRequired,Website.del)
    app.get('/admin/website/update/:id',User.signinRequired,User.adminRequired,Website.update)

    app.get('/admin/website/excel',User.signinRequired,User.adminRequired,Website.xlsx)
}