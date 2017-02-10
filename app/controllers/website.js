var Website = require('../modules/website')
var _ = require('underscore')
var xlsx = require('node-xlsx')
var path = require('path')
var fs = require('fs')
exports.new = function(req,res,next){
    res.render('website_admin', {
        title: '网站统计录入页',
        website:{},
        currentUrl:'/admin/website/new'
    })
}
exports.xlsx = function(req,res){
    var data =[['网站域名','建设者','网站类别','语种','产品','用户名','密码','服务器地址','上线时间','当前状态','被K日期','第一个询盘时间','询盘是否稳定']]
    var filename = 'website'
    Website.find({},function(err,websites){
        for(var i = 0 ;i<websites.length;i++){
            var isStable = ""
            if(websites[i].isStable!=null&&websites[i].isStable!=undefined&&websites[i].isStable!=""){ 
                if(websites[i].isStable){
                    isStable = "稳定"
                }else{
                    isStable = "不稳定"
                }
            }
            var temp = [websites[i].name,websites[i].builder,websites[i].webcategory,websites[i].language,
                websites[i].product,websites[i].account,websites[i].password,websites[i].serverip,websites[i].uptime,websites[i].status
                ,websites[i].kDate,websites[i].firstDate,isStable];
            data.push(temp)
        }
        var newPath = path.join(__dirname,'../../','/public/upload/'+filename+'.xls')
        var buffer = xlsx.build([{name:filename , data: data}])
        fs.writeFileSync(newPath,buffer,'binary')

        fs.stat(newPath,function(err,stat){
            if(err){
                console.log(err)
                return
            }else if(stat.isFile()){
                var fileStream = fs.createReadStream(newPath)
                res.setHeader('Content-disposition', 'attachment; filename=' +filename+'.xls' )
                res.writeHead(200, {'Content-Type':'application/x-download'});
                fileStream.pipe(res);
                console.log('fileStream pipe');
                fileStream.on('end', function() {
                    res.end();
                })
            }else{
                console.log('没有文件')
                return
            }
        })
    })
}
exports.save = function(req,res,next){
    var _user = req.session.user
    var _website = req.body.website
    var website
    var id = _website._id
    if(id){
        Website.findById(id,function(err,website){
            website = _.extend(website,_website)
            website.save(function(err,website){
                if(err){
                    console.log(err)
                }
                res.redirect('/admin/website/list')
            })
        })
    }else{
        website = new Website(_website)
        website.user =_user._id
        website.save(function(err,website){
            if(err){
                console.log(err)
            }
            res.redirect('/admin/website/list')
        })
    }
}

exports.list = function(req,res){
    var page_size = 8
    var page =parseInt(req.query.p,10) || 0
    var index = page * page_size
    Website.find({}).count().exec(function(err,count){
        Website.find({})
            .limit(page_size)
            .skip(index)
            .exec(function(err,websites){
                res.render('websitelist', {
                    title: '网站统计-分页',
                    websites: websites,
                    currentPage:(page+1),
                    is_admin:'true',
                    totalPage:Math.ceil(count / page_size),
                    currentUrl:'/admin/website/list',
                    name:"",
                    product:"",
                    builder:""
                })
            })
    })
}
exports.del = function(req,res){
    var _id = req.param('id')
    if(_id){
        Website.remove({_id:_id},function(err,website){
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

exports.update = function(req,res){
    var id = req.params.id
    if (id) {
        Website.findById(id, function (err, website) {
            if(err){console.log(err)}
            res.render('website_admin',{
                title:'网站更新页',
                website:website
            })
        })
    }
}

exports.websiteAdminFilter = function (req,res,next){
    var _user = req.session.user
    var role = _user.role
    if(role<=50){
        var page_size = 8
        var page =parseInt(req.query.p,10) || 0
        var index = page * page_size
        Website.find({user:_user._id}).count().exec(function(err,count){
            Website.find({user:_user._id})
                .limit(page_size)
                .skip(index)
                .exec(function(err,websites){
                    res.render('websitelist', {
                        title: '网站统计-分页',
                        websites: websites,
                        currentPage:(page+1),
                        is_admin:'true',
                        totalPage:Math.ceil(count / page_size),
                        currentUrl:'/admin/website/list',
                        name:"",
                        product:"",
                        builder:""
                    })
                })
        })
    }else if(role>50){
        next()
    }
}