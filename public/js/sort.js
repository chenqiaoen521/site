$(function(){
    $('.table thead tr th').click(function(e){
        var currentPage =$('#pagers').data('current')
        currentPage = parseInt(currentPage)-1
        var th = $(e.target)
        var id = th.data('id')
        if(!th.hasClass('glyphicon')){
            window.location.href ='/?p='+currentPage+'&sort=-1&sortid='+id
        }else if(th.hasClass('glyphicon-chevron-down')){
            window.location.href ='/?p='+currentPage+'&sort=1&sortid='+id
        }
        else if(th.hasClass('glyphicon-chevron-up')){
            window.location.href ='/?p='+currentPage+'&sort=-1&sortid='+id
        }
    })
})