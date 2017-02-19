
var Category = require('../modules/category')
var _=require('underscore')

//admin  new page
exports.new = function(req,res){
    res.render('category_admin', {
        title: '分类录入页',
        category:{},
        currentUrl:'/admin/category/new'
    })
}

exports.save = function(req,res) {
    var _category = req.body.category
    if (_category._id){
        Category.findById(_category._id,function(err,category){
            if(err){
                console.log(err)
            }
            var category_mod = _.extend(category, _category)
                category_mod.save(function(err,category_mod){
                    if(err){
                        console.log(err) 
                    }
                    res.redirect('/admin/category/list')
                })
        })
    } else {
        var catetory = new Category(_category)
        catetory.save(function(err,catetory){
            if(err){
                console.log(err)
            }
            res.redirect('/admin/category/list')
        })
    }
}

exports.update = function(req,res) {
    var id = req.params.id
    if (id) {
        Category.findById(id, function (err, category) {
            if(err){console.log(err)}
            res.render('category_admin',{
                title:'分类更新页面',
                category:category
            })
        })
    }
}


exports.list = function(req,res){
    Category.fetch(function (err, categories) {
        if (err) {
            console.log(err)
        }
        res.render('categorylist', {
                title: '用户 列表页',
                categories: categories,
                currentUrl:'/admin/category/list'
            }
        )
    })
}
exports.del = function(req,res){
    var id = req.query.id
    if (id) {
        Category.remove({_id: id}, function (err, category) {
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