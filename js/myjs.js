$(document).ready(function () {

    var siteurl = $("#siteurl").val();
    var authorpath = "/authors.json";
    var searchdatapath = "/searchdata.json";
    var authors = "";
    var searchdata = "";
    $.ajaxSettings.async = false; //设置getJson同步
    $.getJSON(authorpath,function (data) {
        authors = data;
    })
    $.getJSON(searchdatapath,function (data) {
        searchdata = data;
    })
    $.ajaxSettings.async = true;//设置getJson异步
    //搜索  searchdata
  $(".search-text").bind("input propertychange",function () {
	var userInput = $(this).val();
	var searchresult = "";
	var subResult = "";
	if ( userInput != ""){
        $.each(searchdata,function (i, sdata) {
            if (sdata.toLowerCase().indexOf(userInput.toLowerCase())>=0){
            	var existFlag = 0;
            	var authorBlogPath = ""
            	$.each(authors,function (i, author) {
					if (author.name == sdata){
                        existFlag = 1;
                        authorBlogPath = author.path;
					}
                });
				if (existFlag == 1){
                    subResult = '<li class="searchresultitem"><a target="_blank" href="'+siteurl+authorBlogPath+'">'+sdata+'</li> </a> ';
				}else{
                    subResult = '<li class="searchresultitem"><a target="_blank" href="'+siteurl+'/categories/'+sdata+'">'+sdata+'</li></a> ';
				}
                searchresult += subResult;
                subResult = "";
            }
        });
	}
	$(".searchresult").html(searchresult);
  })

    $(document).click(function(){
        $(".searchresult").html("");
        $(".search-text").val("");
    })

})
