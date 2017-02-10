$(function(){
    $('.del').click(function(e){
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-'+id)
        $.ajax({
            type:'DELETE',
            url:'/admin/movie/list?id='+id,
            success:function(results){
                if(results.success ===1)
                {
                    target.data('content','Success')
                    target.popover('show')
                    target.on('shown.bs.popover', function () {
                        setTimeout(function(){
                            if(tr.length >0){
                                target.popover('destroy')
                                tr.remove()
                            }
                        },1500)
                    })
                }else{
                    target.data('content','Failed')
                    target.popover('show')
                        setTimeout(function(){
                            target.popover('hide')
                        },1500)
                }
            },
        error:function(e){
            target.data('content','Failed')
            target.popover('show')
                setTimeout(function(){
                    target.popover('hide')
                },1500)
            }
        })
    })
    $('#douban').blur(function(){
        var douban = $(this)
        var id = douban.val()
        $.ajax({
            url:'https://api.douban.com/v2/movie/subject/'+id,
            catch:true,
            type:'get',
            dataType:'jsonp',
            crossDomain:true,
            jsonp:'callback',
            success:function(data){//alert(JSON.stringify(data.images.large))
                $('#inputTitle').val(data.title)
                $('#inputDoctor').val(data.directors[0].name)
                $('#inputCountry').val(data.countries[0])
                $('#inputLanguage').val('英语')
                $('#inputPoster').val(data.images.large)
                $('#inputYear').val(data.year)
                $('#inputSummary').val(data.summary)

            }
        })
    })
})