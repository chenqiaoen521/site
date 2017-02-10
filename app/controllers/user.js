var User = require('../modules/user')
var _= require('underscore')
//signup
exports.signup = function(req,res){
    /*
     var _userid = req.params.userid
     var _userid = req.query.suerid
     var _userid = req.body.userid
     var _userid = req.param('userid')
     */
    var _user = req.body.user
    var inputrole = req.body.inputrole
    if(inputrole){
        _user.role = inputrole
    }
    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (user) {
            //res.redirect('/signin')
            return res.render('signin', {
                title: '登录页面',
                message:_user.name+':已经被注册'
            })
        } else {
            var newuser = new User(_user)
            newuser.save(function (err, newuser) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/')
            })
        }
    })
}
//user check
exports.check = function(req,res){
    var _user = req.session.user
    if(_user){
        var role = _user.role
        if(role<=50){
            res.json({success: 0})
        }else if(role>50){
            res.json({success: 1})
        }
    }else{
        res.json({success: 0})
    }

}

//list delete user
exports.del = function(req,res){
    var id = req.query.id
    if (id) {
        User.remove({_id: id}, function (err, user) {
            if (err) {
                console.log(err)
                res.json({success: 0})
            }
            else {
                res.json({success: 1})
            }
        })
    }
}

//admin update user
exports.update = function(req,res) {
    var id = req.params.id
    if (id) {
        User.findById(id, function (err, user) {
            if(err){console.log(err)}
            res.render('user_admin',{
                title:'用户更新页',
                user:user
            })
        })
    }
}
exports.save = function(req,res){
    var _user = req.body.user
    User.findById(_user._id,function(err,user){
        if(err){
            console.log(err)
        }
        if(!_user.password){
            _user.password = user.password
            var user_mod = _.extend(user, _user)
            user_mod.isChange = true
            user_mod.save(function(err,user_mod){
                if(err){
                    console.log(err)
                    res.json({success: 0})
                }else {
                    res.json({success: 1})
                }
            })    
        }else{
            var user_mod2 = _.extend(user, _user)
            user_mod2.save(function(err,user_mod2){
                if(err){
                    console.log(err)
                    res.json({success: 0})
                }else {
                    res.json({success: 1})
                }
            })
        }
    })
}

//list_user page
exports.userlist = function(req,res){
    var page_size = 8
    var page =parseInt(req.query.p,10) || 0
    var index = page * page_size
    User.find({}).count().exec(function(err,count){
        User.find({})
            .limit(page_size)
            .skip(index)
            .exec(function(err,users) {
                if (err) {
                    console.log(err)
                }
                res.render('user_list', {
                    title: '用户 列表页',
                    users: users,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(count / page_size),
                    currentUrl:'/admin/user/list'
                })
            })
        })
}

//signin
exports.signin = function(req,res){
    var _user = req.body.user
    var name = _user.name
    var password = _user.password
    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.render('signin',{
                title:'登录页面',
                message:'用户名不存在'
            })
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                req.session.user = user
                return res.redirect('/')
            } else {
                return res.render('signin',{
                    title:'登录页面',
                    message:'!您好: '+_user.name+' 您的密码错误'
                })
            }
        })
    })
}
//logout
exports.logout = function(req,res){
    delete req.session.user
    //delete app.locals.user
    res.redirect('/')
}
//show signin
exports.showSignin = function(req,res){
        res.render('signin', {
                title: '登录页面'
            }
        )
}
//show signup
exports.showSignup = function(req,res){
        res.render('signup', {
                title: '注册页面'
            }
        )
}

exports.signinRequired = function(req,res,next){
    var _user = req.session.user
        if(!_user){
            return res.render('signin',{
                title:'登录页面',
                message:'!welcome,please register and sign'
            })
        }else{
            next()
        }
}
exports.adminRequired = function(req,res,next){
    var _user = req.session.user
    var role = _user.role
    if(role<=10){
        return res.render('signin',{
            title:'登录页面',
            message:'!您好: '+_user.name+' 您的权限不足'
        })
    }else{
        next()
    }
}
exports.kingRequired = function(req,res,next){
    var _user = req.session.user
    var role = _user.role
    if(role<=50){
        return res.render('signin',{
            title:'登录页面',
            message:'!您好: '+_user.name+' 您的权限不足'
        })
    }else if(role>50){
        next()
    }
}