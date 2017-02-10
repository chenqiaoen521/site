var Movie = require('../modules/movie')
var Category =require('../modules/category')
var Website = require('../modules/website')
exports.index = function(req,res){
    Category.find({})
        .populate({path:'movies',options:{limit:5}})
        .exec(function(err,categories){
            if(err){console.log(err)}
            res.render('movie_index', {
                title: '首页',
                categories: categories
            })
        })
}
exports.index2 = function(req,res){
    var page_size = 13
    var page =parseInt(req.query.p,10) || 0
    var index = page * page_size
    var sort = req.query.sort
    var sortid = req.query.sortid
    var _name = req.query.name || '',
    _product = req.query.product|| '',
    _builder = req.query.builder|| ''
    if(sort){
        Website.find({}).count().exec(function(err,count){
            var oj = {};
            oj[sortid] = sort
            Website.find({},{'name':1,'builder':1,'webcategory':1,'language': 1,'serverip':1,'uptime':1,'product':1,'status':1,'kDate':1,'firstDate':1,'isStable':1})
                .sort(oj)
                .limit(page_size)
                .skip(index)
                .exec(function(err,websites) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('index', {
                        title: '首页',
                        websites: websites,
                        currentPage:(page+1),
                        totalPage:Math.ceil(count / page_size),
                        sort:sort,
                        sortid:sortid,
                        name:_name,
                        product:_product,
                        builder:_builder
                    })
                })
        })
    }else if(_name || _product || _builder){
        var _is_admin = req.query.is_admin;
        console.log(_is_admin&&_is_admin === 'true')
        if(_is_admin&&_is_admin === 'true'){
            var _user = req.session.user
            var role = _user.role
            if(role>50){
                Website.find({name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')}).count().exec(function(err,count){
                Website.find({name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')},{'name':1,'builder':1,'webcategory':1,'language': 1,'serverip':1,'uptime':1,'product':1,'status':1,'kDate':1,'firstDate':1,'isStable':1})
                    .limit(page_size-3)
                    .skip(index)
                    .exec(function(err,websites) {
                        if (err) {
                            console.log(err)
                        }
                        res.render('websitelist', {
                            title: '修改页面',
                            websites: websites,
                            currentPage:(page+1),
                            keyword:[_name,_product,_builder],
                            totalPage:Math.ceil(count / page_size),
                            is_admin:_is_admin,
                            sort:'',
                            sortid:'',
                            name:_name,
                            product:_product,
                            builder:_builder
                        })
                    })
                })
            }else{
                Website.find({user:_user._id,name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')}).count().exec(function(err,count){
                Website.find({user:_user._id,name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')},{'name':1,'builder':1,'webcategory':1,'language': 1,'serverip':1,'uptime':1,'product':1,'status':1,'kDate':1,'firstDate':1,'isStable':1})
                    .limit(page_size-3)
                    .skip(index)
                    .exec(function(err,websites) {
                        if (err) {
                            console.log(err)
                        }
                        res.render('websitelist', {
                            title: '修改页面',
                            websites: websites,
                            currentPage:(page+1),
                            keyword:[_name,_product,_builder],
                            totalPage:Math.ceil(count / page_size),
                            is_admin:_is_admin,
                            sort:'',
                            sortid:'',
                            name:_name,
                            product:_product,
                            builder:_builder
                        })
                    })
                })
            }

        }else{   
                Website.find({name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')}).count().exec(function(err,count){
                    Website.find({name:new RegExp(_name+'.*','i'),product:new RegExp(_product+'.*','i'),builder:new RegExp(_builder+'.*','i')},{'name':1,'builder':1,'webcategory':1,'language': 1,'serverip':1,'uptime':1,'product':1,'status':1,'kDate':1,'firstDate':1,'isStable':1})
                        .limit(page_size)
                        .skip(index)
                        .exec(function(err,websites) {
                            if (err) {
                                console.log(err)
                            }
                            res.render('index', {
                                title: '首页',
                                websites: websites,
                                currentPage:(page+1),
                                keyword:[_name,_product,_builder],
                                totalPage:Math.ceil(count / page_size),
                                sort:'',
                                sortid:'',
                                name:_name,
                                product:_product,
                                builder:_builder
                            })
                        })
                    })
                }
            }else{   
        Website.find({}).count().exec(function(err,count){
            Website.find({},{'name':1,'builder':1,'webcategory':1,'language': 1,'serverip':1,'uptime':1,'product':1,'status':1,'kDate':1,'firstDate':1,'isStable':1})
                .limit(page_size)
                .skip(index)
                .exec(function(err,websites) {
                    if (err) {
                        console.log(err)
                    }
                    res.render('index', {
                        title: '首页',
                        websites: websites,
                        currentPage:(page+1),
                        totalPage:Math.ceil(count / page_size),
                        sort:'',
                        sortid:'',
                        name:_name,
                        product:_product,
                        builder:_builder
                    })
                })
             })
        }
}
exports.search = function(req,res){
    var catId = req.query.cat
    var q = req.query.q
    var page_size = 2
    var page =parseInt(req.query.p,10) || 0
    var index = page * page_size
    if(catId){
        Category.find({_id:catId})
            .populate({path:'movies',select:'title poster'})
            .exec(function(err,categories){
                if(err){console.log(err)}
                var category = categories [0]|| {}
                var movies = category.movies || []
                var results = movies.slice(index,index + page_size)
                res.render('result', {
                    title: '分页',
                    keyword:category.name,
                    currentPage:(page+1),
                    query:'cat='+catId,
                    totalPage:Math.ceil(movies.length / page_size),
                    movies: results
                })
            })
    }
    else{
        Movie.find({title:new RegExp(q+'.*','i')})
            .exec(function(err,movies){
                if(err){console.log(err)}
                var results = movies.slice(index,index + page_size)
                res.render('result', {
                    title: '分页',
                    keyword:q,
                    currentPage:(page+1),
                    query:'q='+catId,
                    totalPage:Math.ceil(movies.length / page_size),
                    movies: results
                })
            })
    }
}
exports.lantern = function(req,res){
    res.render('lantern', {
        title: 'lantern'
    })
}
