var Movie = require('../modules/movie')
var Comment = require('../modules/comment')
var Category = require('../modules/category')
var _= require('underscore')
var fs = require('fs')
var path = require('path')

//detail page
exports.detail = function(req,res){
    var id = req.params.id
    Movie.update({_id:id},{$inc:{pv:1}},function(err){
        if(err){
            console.log(err)
        }
    })
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie:id})
            .populate('from', 'name')
            .populate('reply.from','name')
            .populate('reply.to','name')
            .exec(function(err,comments){
                res.render('detail', {
                    title: '详情页',
                    movie: movie,
                    comments:comments
                })
        })

    })
}

//admin update movie
exports.update = function(req,res) {
    var id = req.params.id
    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({},function(err,categories){
                if(err){console.log(err)}
                res.render('movie_admin',{
                    title:'电影更新页面',
                    movie:movie,
                    categories:categories
                })
            })
        })
    }
}

//admin post movie
exports.save = function(req,res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie
    if(req.poster){
        movieObj.poster = req.poster
    }
    if (id) {
        /*   var catid = movieObj.category   $pull 方式删除
        Category.findByIdAndUpdate(catid,
            {"$pull":{"movies":[movieObj._id]}},
            function(err){

            });
        var newcatid = movieObj.category
        Category.findByIdAndUpdate(newcatid,
            {"$set": {"movies":[movieObj._id]}},
            function(err){

            });*/


        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            Category.findById({_id:movie.category},function(err,category){//删除旧分类下电影 添加新分类下电影
                if(err){console.log(err)}
                category.movies.remove(movieObj._id)
                category.save(category,function(err){
                    if(err){console.log(err)}
                })
            });
            var newcatid = movieObj.category
            Category.findById({_id:newcatid}, function(err,category){
                if(err){console.log(err)}
                category.movies.push(movieObj._id)
                category.save(category,function(err){
                    if(err){console.log(err)}
                })
            });

            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, _movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie(movieObj)
        var categoryName = movieObj.categoryName
        var _categoryId = movieObj.category
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            if(_categoryId){
                Category.findById(_categoryId,function(err,category){
                    category.movies.push(_movie._id)
                    category.save(function(err,category){
                        if(err){console.log(err)}
                        res.redirect('/movie/' + movie._id)
                    })
                })
            }else if(categoryName){
                var category = new Category({
                    name:categoryName,
                    movies:[_movie.id]
                })
                category.save(function(err,category){
                    if(err){console.log(err)}
                    _movie.category = category
                    _movie.save(function(err,_movie){
                        if(err){console.log(err)}
                        res.redirect('/movie/' + movie._id)
                    })

                })

            }

        })
    }

}

//list page
exports.list = function(req,res){
    var page_size = 2
    var page =parseInt(req.query.p,10) || 0
    var index = page * page_size
    Movie.find({}).count().exec(function (err, count) {
        Movie.find({})
             .limit(page_size)
             .skip(index)
             .exec(function(err,movies){
                if (err) {
                    console.log(err)
                }
                res.render('list', {
                    title: '列表页',
                    movies: movies,
                    currentPage:page,
                    totalPage:Math.ceil(count / page_size),
                    currentUrl:'/admin/movie/list'
                })
            })
    })
}
//admin  new page
exports.new = function(req,res){
    Category.find({},function(err,categories){
        res.render('movie_admin',{
            title: '电影录入页',
            categories:categories,
            movie: {},
            currentUrl:'/admin/movie/new'
        })
    })
}

//list delete movie
exports.del = function(req,res){
    var id = req.query.id
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
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
// admin poster image
exports.savePoster = function(req,res,next){
    var uploadPoster = req.files[0]
    if(uploadPoster){
        var filePath = uploadPoster.path
        var originalname = uploadPoster.originalname
        fs.readFile(filePath, function (err, data) {
            if( err ){
                console.log( err );
            }else{
                var timestamp = Date.now()
                var suffixes = originalname.split('.')[1]
                var poster = timestamp+'.'+ suffixes
                var newPath = path.join(__dirname,'../../','/public/upload/'+poster)
                fs.writeFile(newPath,data,function(err){
                    if(err){console.log(err)}
                    req.poster = poster
                    next()
                })
            }
        })
    }
    else{
        next()
    }
}