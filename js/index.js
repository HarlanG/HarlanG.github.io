$(document).ready(function () {
    //博文图片蒙版的出现与消失
    $(".topicShow").on("mouseenter",".topic-item",function(){
        $(this).find(".hover").css("display","none");
    });
    $(".topicShow").on("mouseleave",".topic-item",function(){
        $(this).find(".hover").css("display","inherit");
    });

    var siteurl = $("#siteurl").val();
    var getmoredisplay = 1;     //加载提示框是否显示  0不显示，1显示
    var authorpath = "/authors.json";
    var datapath = "/postdetails.json";
    var authors = "";
    var postdetails = "";
    $.ajaxSettings.async = false; //设置getJson同步
    $.getJSON(authorpath,function (data) {
        authors = data;
    })

   $.getJSON(datapath,function (data) {
        postdetails = data;
	})
    $.ajaxSettings.async = true;//设置getJson异步

   //人气博主
  	var blogerpath = "/blogerdetails.json";                	//博主详情（姓名，头像，博文数，博主页面地址）　ｊｓｏｎ文件地址
	var blogercontent = "";																	//人气博主栏ＨＴＭＬ代码
	$.getJSON(blogerpath,function(data) {
												//读取数据
			var blogers = data;																		//对象元素的数组
			for(var i = 0; i < 5 ;i++){																				//选择排序选出博文数最高前五
				var indexMax = i;
				for(var j = i;j < blogers.length;j++){
						if(blogers[indexMax].articles < blogers[j].articles){
							indexMax = j;
						}
				}
				var bloger = blogers[indexMax];
				blogers[indexMax] = blogers[i];
				blogers[i] = bloger;
			}																												//拼接ＨＴＭＬ代码
			for(var k = 0 ;k < 5;k++){
				var blogeritem = '<li class="list-group-item margin-top-3 margin-top-5px ">'+
       '<a href="'+siteurl+blogers[k].path+'"><img class="blogers-img vertical-align-bottom" src="'+siteurl+blogers[k].image+'"></a>'+
      	'<div class="inline-block blogers-info"><a class="a-black-noline" href="'+siteurl+blogers[k].path+'"><span >'+blogers[k].name+'</span></a>'+
      	'<br><span class="line-height-25">上传:&nbsp;<a href="#">'+blogers[k].articles+'</a>&nbsp;&nbsp;人气:&nbsp;999</span></div>'+
      	'</li>  <div class="spritline"></div> ';
      	blogercontent += blogeritem;
			}
																														//生成HTML内容
			$("#blogers-tags").html(blogercontent);
		})

    //遍历所有用户信息，选取该用户博客路径
	function getBlogerPath(authors,array){
		var authorPath = "";
		 $.each(authors,function (i, item) {
					if (array[2] == item.name){
					authorPath =  item.path;
					}
			 }) ;
			return  authorPath;
	}
	//确定博文图片
	function getBlogImage(array){
		var image = "";
		if(array[3] == ""){
				image = "/images/blogways.png";
			}
			else{
				image =array[3];
			}
			return image;
	}
    //博客区域的拼接函数
    function contactitem(array,image,siteurl,authorpath){
        //拼接该篇博客HTML代码
        var blogitem = '<div class="col-xs-12 col-sm-6 col-md-4 "> ' +
            '<div class="list-group topic-item">'+
            '<div class="list-group-item image-item">'+
            '<a href="'+siteurl+array[4]+'" target="_blank" title="'+array[0]+'"> <img class="border-radius img-size-percent " src="'+siteurl+image+'"> </a>'+
            '<div class="hover"></div>'+
            '<div class="topic-title" style="overflow: hidden;text">'+array[0]+'</div>'+
            '</div>'+
            '<div class="list-group-item info-item">'+
            '<span><a href="'+siteurl+authorpath+'">'+array[2]+'</a></span>'+
            '<span class="pull-right"> <span class="glyphicon glyphicon-tag">&nbsp;<a href="'+siteurl+'/categories/'+array[1]+'">'+array[1]+'</a></span></span>'+
            '<div class="line-div"></div>'+
            '</div> <div class="list-group-item info-item container-fluid ">'+
            '<div class="row">'+
            '<span class="col-xs-4"><img src="/images/readcount.png">33</span>'+
            '<span class="col-xs-4 col-xs-offset-1"><img src="/images/message.png">33</span>'+
            '<span class="col-xs-2 col-xs-offset-1"><img src="/images/unknowlike.png"></span>'+
            '</div> </div> </div> </div>';
        return blogitem;
    }
	//获取博客
	function getBlogs(array){
		var content = "";
		//获取用户图片地址
		var image = getBlogImage(array);
		//获取用户分类路径
		var authorpath = getBlogerPath(authors,array);
		content += contactitem(array,image,siteurl,authorpath);
		content += "  ";
		return content;
	}
    //生成HTMl代码
    var blogBeginIndex = 0;
    var roundNum = 1;
    var numlimit = 9;
    function showBlogs(blogsToShow) {
        var  content = "";
        var blogersLength = blogsToShow.length;
        var appendNum = roundNum*numlimit;
        if (blogersLength > appendNum){
            for (;blogBeginIndex < appendNum;blogBeginIndex++){
                content +=  getBlogs(blogsToShow[blogBeginIndex])	;
            }
            roundNum++;
        }else{
            for (;blogBeginIndex < appendNum;blogBeginIndex++){
                if (blogBeginIndex>blogersLength-1){
                    getmoredisplay = 0;
                    blogBeginIndex = 0;
                    roundNum = 1;
                    break;
                }
                content +=  getBlogs(blogsToShow[blogBeginIndex])	;
            }
        }
        return content;
    }
    //显示用户选择的博客信息
    function getUserSelect(category,time){

        var content = "";
        //获取所有符合条件的博客,赋值给blogersToShow
        content = showBlogs(blogsToShow);       //生成部分代码
        $(".getmore").css("display","none");
        $(".topicShow").append(content);

    }

    //获取所有符合条件的博客
    var blogsToShow = new Array();         //所有符合条件的博文数组
    var blogersArrIndex = 0;				// 博文数组元素的下标
	function getBlogsToShow(data,category,time){
		var tempArrays = new Array();
		//选取指定类型博客，拼接至content中
		if(category == "ALL" ){
			if(time == 0)
			{
				$.each(data,function (i,array) {
					tempArrays[blogersArrIndex] = array;
					blogersArrIndex++;
				})
			}
			else
			{
				$.each(data,function (i,array) {
					if(time == array[5]) {
						tempArrays[blogersArrIndex] = array;
						blogersArrIndex++;
					}
				})
			}
		}
		else
		{
			if(time == 0)
			{
				$.each(data,function (i,array) {
					if(category.toLowerCase() == array[1].toLowerCase()) {
						tempArrays[blogersArrIndex] = array;
						blogersArrIndex++;
					}
				})
			}
			else
			{
				$.each(data,function (i,array) {
					if(category.toLowerCase() == array[1].toLowerCase() & time == array[5] ) {
						tempArrays[blogersArrIndex] = array;
						blogersArrIndex++;
					}
				})
			}
		}
		blogersArrIndex = 0;
        blogsToShow = tempArrays;
	}

	var usercategory = "";
	var usertime     = "";
	//根据分类 查询/
    $("#typeselect-s").change(function () {
        roundNum = 1;
        blogBeginIndex = 0;
        getmoredisplay = 1;
    	var usercategory = $(this).val();
     	var usertime     =  $("#timeselect-s").val();
        getBlogsToShow(postdetails,usercategory,usertime);  //该类别所有博客
        $(".topicShow").html("");
		getUserSelect(usercategory,usertime) ;                     //index页面的异步刷新  																																		 //获取类别
    })

    //根据时间 查询
    $("#timeselect-s").change(function () {
    	roundNum = 1;
        blogBeginIndex = 0;
        getmoredisplay = 1;
    	var usertime     = $(this).val();
     	var usercategory = $("#typeselect-s").val();
        getBlogsToShow(postdetails,usercategory,usertime);
        $(".topicShow").html("");
      	getUserSelect(usercategory,usertime) ;                     //index页面的异步刷新  																																		 //获取类别

    })
	//延时加载
  $(window).scroll(function () {
  	var  windowHeight = window.innerHeight;
  	var  htmlscrotop = $("html").scrollTop();
  	var documentHeight = $(document).height();
		if(documentHeight-windowHeight-htmlscrotop < (windowHeight/15) & getmoredisplay == 1){
			$(".getmore").css("display","inline");
            getUserSelect(usercategory,usertime) ;
		}
  })
    //加载完成显示前九张博客
    var initcategory = $("#typeselect-s").val();
    var inittime     = $("#timeselect-s").val();
    getBlogsToShow(postdetails,initcategory,inittime)
    getUserSelect(initcategory,inittime) ;
})
