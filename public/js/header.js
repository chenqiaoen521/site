$(function(){
    $('#adminloginid').click(function(e){
        var signupModal = $('#signupModal')
        var webadmin = $('#webadmin')
        $.ajax({
            type:'GET',
            url:'/admin/user/check',
            success:function(results){
                if(results.success ===1)
                {
                    signupModal.modal('show')
                    signupModal.find('#inputrole').val(15)
                }else{
                    signupModal.modal('hide')
                    webadmin.popover({
                        title:'无此权限',
                        container:'body',
                        placement:'right',
                        content:'请联系管理员'
                    }).popover('show')
                    setTimeout(function(){
                        webadmin.popover('destroy')
                    },1500)
                }
            },
            error:function(e){
                signupModal.modal('hide')
                webadmin.popover({
                    title:'无此权限',
                    container:'body',
                    placement:'right',
                    content:'请联系管理员'
                }).popover('show')
                setTimeout(function(){
                    webadmin.popover('destroy')
                },1500)
            }
        })
    })
})

