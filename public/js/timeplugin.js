
(function($){
	$('.form_date').datetimepicker({
    format:'yyyy-mm-dd hh:ii:ss',
    weekStart: 1,
    todayBtn:  1,
	autoclose: 1,
	todayHighlight: 1,
	startView: 2,
	minView: 2,
	forceParse: 0,
    language:'zh-CN'
});
	$('#isStable_checkbox').click(function(event) {
		if(event.target.checked){
				$('#isStable').val(true);
			}else{
				$('#isStable').val(false);
			}
	});
})(jQuery)
