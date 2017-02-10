$(function(){
    $('.del').click(function(e){
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-'+id)
        $.ajax({
            type:'DELETE',
            url:'/admin/user/del?id='+id,
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
    $('#updatebutton').click(function(e){
        var button = $(this)
        $.ajax({
            type:'POST',
            url:'/admin/user/save',
            data:$('#updateform').serialize()
        }).done(function(results){
            if(results.success ===1)
            {
                button.data('content','Success')
                button.popover('show')

            }else{
                button.data('content','Failed')
                button.popover('show')
                setTimeout(function(){
                    button.popover('hide')
                },1500)
            }
        })
    })
    $('#updatebutton').on('shown.bs.popover', function () {
        setTimeout(function(){
            window.location.href = '/admin/user/list'
        },2000)
    })
})