//category del ajax
$(function(){
    $('.del').click(function(e){
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-'+id+'')
        $.ajax({
            type:'DELETE',
            url:'/admin/category/del?id='+id
        }).done(function(results){
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
        })
    })
})

