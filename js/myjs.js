$(document).ready(function () {
    //博文图片蒙版的出现与消失
    $(".topic-item").mouseenter(function(){
        $(this).find(".hover").css("display","none");
    });
    $(".topic-item").mouseleave(function(){
        $(this).find(".hover").css("display","inherit");
    });
    var siteurl = $("#siteurl").val();
    var authorpath = "/authors.json";
    var authors = "";
    $.ajaxSettings.async = false; //设置getJson同步
    $.getJSON(authorpath,function (data) {
        authors = data;
    })
      $.ajaxSettings.async = true;//设置getJson异步
    
    
    
    
    
    	//人气博主
  	var blogerpath = siteurl+"/blogerdetails.json";
  							var blogercontent = "";
  	 						
	  						$.getJSON(blogerpath,function(data) { 
	  						
	  							var blogers = data;
	  							for(var i = 0;i<blogers.length;i++){
										for(var j = i;j<blogers.length-1;j++){
												if(blogers[j].articles < blogers[j+1].articles){
													var bloger = blogers[j];
													blogers[j] = blogers[j+1];
													blogers[j+1] = bloger;
												}
										}
									}
									
	  							for(var k = 0 ;k < 5;k++){
										var blogeritem = '<li class="list-group-item margin-top-3 margin-top-5px ">'+
	                 '<a href="'+siteurl+data[k].path+'"><img class="blogers-img vertical-align-bottom" src="'+siteurl+data[k].image+'"></a>'+
	                	'<div class="inline-block blogers-info"><a class="a-black-noline" href="'+siteurl+data[k].path+'"><span >'+data[k].name+'</span></a>'+
	                	'<br><span class="line-height-25">上传:&nbsp;<a href="#">'+data[k].articles+'</a>&nbsp;&nbsp;人气:&nbsp;999</span></div>'+
	                	'</li>  ';
	                	blogercontent += blogeritem;
									}
	  						
	  							$("#blogers-tags").html(blogercontent);
	  							
	  							
	  							
	  						})
  		
    
    
    
    function contactitem(array,image,siteurl,authorpath){
    	//拼接该篇博客HTML代码							
			var blogitem = '<div class="col-xs-12 col-sm-6 col-md-4 "> ' +
			    '<div class="list-group topic-item">'+
			    '<div class="list-group-item image-item">'+
			    '<a  href="'+array[4]+'" target="_blank" title="'+array[0]+'">'+
					'<img class="border-radius img-size-percent " src="'+image+'">'+
					'</a>'+
					'<div class="hover"></div>'+
			    '<div class="topic-title ">'+array[0]+'</div>'+
					'</div>'+
					'<div class="list-group-item info-item">'+
					'<span><a href="'+siteurl+authorpath+'">'+array[2]+'</a></span>'+
					'<span class="pull-right"> <span class="glyphicon glyphicon-tag">&nbsp;<a href="'+siteurl+'"/categories/'+array[1]+'">'+array[1]+'</a></span></span>'+
					'<div class="line-div"></div>'+
			    '</div> <div class="list-group-item info-item container-fluid ">'+
			    '<div class="row">'+
			    '<span class="col-xs-4"><img src="/images/readcount.png">33</span>'+
			    '<span class="col-xs-4 col-xs-offset-1"><img src="/images/message.png">33</span>'+
			    '<span class="col-xs-2 col-xs-offset-1"><img src="/images/unknowlike.png"></span>'+
			    '</div> </div> </div> </div>';

					return blogitem;
    	}

		var siteurl = $("#siteurl").val();
    //类型分类的选取
    //index页面的异步刷新
    $("#typeselect-s").change(function () {
        //获取类别
        
        var  category = $(this).val();
        var datapath = "/postdetails.json";
        //该类别所有博客
        var content = "";
        //获取所有博客信息，获得该类别博客
        $.getJSON(datapath,function (data) {    
					if( "ALL" != category){
							
							//选取指定类型博客，拼接至content中
							$.each(data,function (i,array) {
							  //选取该类别博客
								if(category.toLowerCase() == array[1].toLowerCase()) {
									//获取用户图片地址
									var image = "";
									if(array[3] == ""){
										image = "/images/blogways.png";
									}
									else{
										image =array[3];
									}

									//获取用户分类路径
									var authorpath = "";
									//遍历所有用户信息，选取该用户博客路径
									$.each(authors,function (i, item) {
										if (array[2] == item.name){
							   			authorpath = item.path;
							  			return false;
										}
									})

									content += contactitem(array,image,siteurl,authorpath);
									content += "  ";

								}
							})

					}
					else{
						$.each(data,function (i,array) {

							//获取用户图片地址
							var image = "";
							if(array[3] == ""){
							  image = "/images/blogways.png";
							}else{
							  image =array[3];
							}

							//获取用户分类路径
							var authorpath = "";
							//遍历所有用户信息，选取该用户博客路径
							$.each(authors,function (i, item) {
								 if (array[2] == item.name){
								     authorpath = item.path;
								    return false;
								 }
							})

							content += contactitem(array,image,siteurl,authorpath);
							content += "  ";
						})
					}
           
          $(".topicShow").html(content);
        });
    })
    
    //搜索
  $(".search-text").change(function(){
  	$("#searchtest").html("dsafa");
  	})
  	
  

})