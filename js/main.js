// $(".nav li").on("click",function () {
//    $(this).addClass("selected").siblings().removeClass("selected");
// });

//判断是否为手机端
function isMobile(){
  if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    return true
  }
  return false
}
var app = {
    init:function () {
        this.pageShow();
        this.bigImg();
        this.swiperBtn();
        //轮播banner
        $('.carousel').carousel();
    },
    //创建元素函数
    element: function (tag,attrs,html) {
        var element = document.createElement(tag);
        // 判断第二个参数是属性还是内容
        if(typeof(attrs) === "string"){
            html = attrs;
            attrs = null;
        }
        // 判断是否有属性
        if(attrs !== undefined){
            for(var attr in attrs){
                element.setAttribute(attr,attrs[attr]);
            }
        }
        // 判断是否有内容
        if(html !== undefined){
            element.innerHTML = html;
        }
        return element;
    },
    swiperBtn:function () {
        $(".swiper-container").on("mouseenter",function () {
            $(".swiper-button-prev,.swiper-button-next").removeClass("hide");
        });
        $(".swiper-container").on("mouseleave",function () {
            $(".swiper-button-prev,.swiper-button-next").addClass("hide");
        });
    },
    //图片展示
    swiper2: function () {
        var mySwiper2 = new Swiper('.swiper-container2', {
            direction: 'horizontal',
            slidesPerView : 3,
            loop: true,
            autoplay: 1500, //自动播放
            speed: 500,    //播放速度
            autoplayDisableOnInteraction: false,
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
        });
    },
    // 详情轮播
    swiper3: function () {
        var mySwiper3 = new Swiper('.swiper-container3', {
            direction: 'horizontal',
            speed: 2000,    //播放速度
            autoplayDisableOnInteraction: false,
            // 分页器
            pagination: '.swiper-pagination',
            paginationClickable: true,
            //前进后退
            prevButton:'.swiper-button-prev',
            nextButton:'.swiper-button-next',
        });
    },
    pageShow: function () {
        $.ajax({
            url: "data/main.php",
            type: "get",
            success:function (data) {
                this.bannerFun(data);
                // this.newsFun(data);
                this.newsAutoFun();
                this.imgShowFun(data);
                this.specialtyFun(data);
            }.bind(this)
        });
    },
    // banner
    bannerFun: function (data) {
        var bannerList = data.bannerList;
        var fragmentBanner = document.createDocumentFragment();

        for(var i = 0;i < bannerList.length;i++){
            var divBanner = this.element(
                "div",
                {
                    "class":"swiper-slide",
                    "id":bannerList[i].name,
                },
                "<a href=\"javascript:void(0);\">\n" +
                "  <img src=\"images/"+bannerList[i].src+"\"/>\n" +
                "  <p class=\"banner-text\">"+bannerList[i].title+"</p>\n" +
                "</a>"
            );

            $(divBanner).appendTo($(fragmentBanner));
        }

        $(fragmentBanner).appendTo($(".swiper-container1 .swiper-wrapper"));

        // this.swiper1();
    },
    // 新闻公告
    newsFun: function (data) {
        var newsList = data.newsList;
        var fragmentNews = document.createDocumentFragment();

        for(var i = 0;i< newsList.length ;i++){
            var divNews = this.element(
                "div",
                {"class":"news-bulletin-item"},
                "<a href="+newsList[i].href+" class=\"clearfix\" target=\"_blank\">\n" +
                "  <p class=\"item-title fl\">\n"+newsList[i].title+"</p>\n" +
                "  <p class=\"item-time fr\">\n"+newsList[i].ntime+ "</p>\n" +
                "</a>"
            );

            $(divNews).appendTo($(fragmentNews));
        }
        $('<a class="btn-check-more" href="news.html">新闻头条 &gt;</a>').appendTo($(fragmentNews))
        $(fragmentNews).appendTo($(".news-bulletin-content"));
    },
    newsAutoFun:function () {
      $.ajax({
        type:'GET',
        url:'data/get-news-auto.php',
        success:function(data){
          var type  = JSON.parse(data).type;
          var container = "";
          var arr = [];
          if(isMobile()){
            container = JSON.parse(data).data.match(/<ul class="news_list news_list_c" style="padding-top:10px;">([\s\S]*?)<\/ul>/)[1];
            arr = container.match(/<li>([\s\S]*?)<\/li>/g);
          }else{
            container = JSON.parse(data).data.match(/<div class="lbyzc">([\s\S]*?)<div class="col-auto/)[1];
            arr = container.match(/<ul>([\s\S]*)<\/ul>/)[1].match(/<li>([\s\S]*?)<\/li>/g);
          }

          var fragmentNews = document.createDocumentFragment();
          for(let i = 0;i<5;i++){
            let item = {};
            item.ntime = arr[i].match(/<span>([\s\S]*)<\/span>/)[1];
            item.title = arr[i].match(/<a([\s\S]*)<\/a>/)[1].split(">")[1];
            item.href = arr[i].match(/<a href="([\s\S]*?)"/)[1];

            var divNews = this.element(
              "div",
              {"class":"news-bulletin-item"},
              "<a href="+item.href+" class=\"clearfix\" target=\"_blank\">\n" +
              "  <p class=\"item-title fl\">\n"+item.title+"</p>\n" +
              "  <p class=\"item-time fr\">\n"+item.ntime+ "</p>\n" +
              "</a>"
            );

            $(divNews).appendTo($(fragmentNews));
          }

          $('<a class="btn-check-more" href="news.html">新闻头条 &gt;</a>').appendTo($(fragmentNews))
          $(fragmentNews).appendTo($(".news-bulletin-content"));
        }.bind(this),
        error:function (data) {
          console.log(data)
        }
      })
    },
    // imgshow
    imgShowFun: function (data) {
        var imgList = data.bannerList;
        var fragmentImgShow = document.createDocumentFragment();
        var len = imgList.length;
        for(var i = 0;i < len;i++){
            for(var j = 0;j < parseInt(imgList[i].imgcount);j++){
                var div = this.element(
                    "div",
                    {"class":"swiper-slide"},
                    "<a href=\"javascript:void(0);\">\n" +
                    "  <img class='small-img' src=\"images/scenery/"+imgList[i].name+"/"+imgList[i].name+"-0"+(j+1)+".jpg\"/>\n" +
                    "</a>"
                );
                $(div).appendTo($(fragmentImgShow));
            }
        }

        $(fragmentImgShow).appendTo($(".swiper-container2 .swiper-wrapper"));

        this.swiper2();
    },
    // 特产
    specialtyFun: function (data) {
        var specialtyList = data.specialtyList;
        var idList = [];
        var fragmentSpecialty = document.createDocumentFragment();
        var fragmentScenery = document.createDocumentFragment();
        var imgFile = "specialty";
        for(var i =0;i < specialtyList.length;i++){
            // 获取id列表
            idList.push(specialtyList[i].name);

            if(specialtyList[i].type === "0"){
                imgFile = "specialty";
                var divSpecialty = this.element(
                    "div",
                    {
                        "class":"col-sm-6 col-md-4 specialty-item",
                        "id":specialtyList[i].name
                    },
                    "<div class=\"thumbnail\">\n" +
                        "<img src=\"images/"+imgFile+"/"+specialtyList[i].name+"/"+specialtyList[i].name+"-01.jpg\" alt=\"\">\n" +
                        "<div class=\"caption\">\n" +
                           "<p class=\"text-title\">"+specialtyList[i].title+"</p>\n" +
                           "<p class=\"caption-text\">"+specialtyList[i].des.split("|")[0] +"</p>\n" +
                        "</div>"+
                    "</div>\n"
                );

                $(fragmentSpecialty).html($(divSpecialty));

            }else if(specialtyList[i].type === "1"){
                imgFile = "scenery";
                var divScenery = this.element(
                    "div",
                    {
                        "class":"col-sm-6 col-md-4 specialty-item",
                        "id":specialtyList[i].name
                    },
                    "<div class=\"thumbnail\">\n" +
                    "<img src=\"images/"+imgFile+"/"+specialtyList[i].name+"/"+specialtyList[i].name+"-01.jpg\" alt=\"\">\n" +
                    "<div class=\"caption\">\n" +
                    "<p class=\"text-title\">"+specialtyList[i].title+"</p>\n" +
                    "<p class=\"caption-text\">"+specialtyList[i].des.split("|")[0] +"</p>\n" +
                    "</div>"+
                    "</div>\n"
                );
                $(fragmentScenery).html($(divScenery));
            }
        }
        $(".specialty-content").html($(fragmentSpecialty));
        $(".scenery-content").html($(fragmentScenery));

        $(".specialty-content,.scenery-content").on("click",'.thumbnail',function (e) {
            var did = $(e.target).parents(".specialty-item").attr("id");
            sessionStorage.setItem("detailId",did);
            sessionStorage.setItem("idList",idList);
            location.href = "detail.html";
        }.bind(this));
    },
    // 详情页
    detailFun : function () {
        var idList = sessionStorage.getItem("idList").split(",");
        var index = "";
        var _did = sessionStorage.getItem("detailId");

        for (var n = 0;n<idList.length;n++){
            if(idList[n]===_did){
                index = n;
            }
        }
        console.log(idList[index]);
        this.detailShow(idList[index]);

        $("#detailContaienr .btn-prev").on("click",function (e) {
            var e = e.target;
            index--;
            if(index <= 0){
                this.detailShow(idList[0]);
                $(e).html("这已经是第一条");
                index = 0;
              sessionStorage.setItem("detailId",idList[index]);
            }else{
                this.detailShow(idList[index]);
                $(e).html("上一条");
                $(".btn-next a").html("下一条");
              sessionStorage.setItem("detailId",idList[index]);
            }

            document.body.scrollTop = 0;
            document.documentElement.scrollTop =0;
        }.bind(this));
        $("#detailContaienr .btn-next").on("click",function (e) {
            var e = e.target;
            index++;
            if(index >= idList.length-1){
                this.detailShow(idList[idList.length-1]);
                $(e).html("这已经是最后一条");
                index = idList.length-1;
              sessionStorage.setItem("detailId",idList[index]);
            }else{
                this.detailShow(idList[index]);
                $(e).html("下一条");
                $(".btn-prev a").html("上一条");
              sessionStorage.setItem("detailId",idList[index]);
            }
            document.body.scrollTop = 0;
            document.documentElement.scrollTop =0;
        }.bind(this));
    },
    detailShow: function (_id) {
        $.ajax({
            url:"data/detail.php?name="+_id,
            type:"get",
            success:function (data) {
                var imgFile = "specialty";
                if(data[0].type==="0"){
                    imgFile = "specialty";
                    $($(".navbar-nav li")[1]).addClass("selected")
                        .siblings("li").removeClass("selected");
                }else if(data[0].type==="1"){
                    imgFile = "scenery";
                    $($(".navbar-nav li")[2]).addClass("selected")
                        .siblings("li").removeClass("selected");
                }
                // title
                $(".detail-content .detail-title").html(data[0].title);
                document.getElementsByTagName('title')[0].innerHTML= data[0].title;
                // banner
                var fragmentBanner = document.createDocumentFragment();
                for(var i = 0;i<data[0].imgCount;i++){
                    var divBanner = this.element(
                        "div",
                        {"class":"swiper-slide"},
                        "<a href=\"javascript:void(0);\">\n" +
                        "  <img class=\"small-img\" src=\"images/"+imgFile+"/"+data[0].name+"/"+data[0].name+"-0"+(i+1)+".jpg\" alt=\"\">\n" +
                        "</a>"
                    );

                    $(divBanner).appendTo($(fragmentBanner));
                }
                $(".detail-banner .swiper-wrapper").html($(fragmentBanner));

                // 描述
                var fragmentDes = document.createDocumentFragment();
                var des = data[0].des.split("|");
                for(var j = 0;j<des.length;j++){
                    var pDes = this.element("p",{"class":"describe-section"},des[j]);

                    $(pDes).appendTo($(fragmentDes));
                }
                $(".detail-describe").html($(fragmentDes));

                this.swiper3();
            }.bind(this)
        });
    },
    // 大图
    bigImg: function () {
        //显示大图
        $(".swiper-wrapper").on("click",".swiper-slide img.small-img",function (e) {
            var e = e.target;
            var _index = $(e).parents(".swiper-slide").index();
            var arr = $(e).parents(".swiper-wrapper").find(".swiper-slide");
            $(".picture-large-show").show().children("img")
                .attr("src",$(e).attr("src"));
            //上一张按钮
            $(".picture-large-show .btn-prev").on("click",function () {
                if(_index === 0){
                    _index = arr.length;
                }
                var _src = $(arr[_index - 1]).find("img").attr("src");
                $(".picture-large-show").show().children("img").attr("src",_src);
                _index--;
            });
            //下一张按钮
            $(".picture-large-show .btn-next").on("click",function () {
                if(_index === arr.length){
                    _index = 0;
                }
                var _src = $(arr[_index + 1]).find("img").attr("src");
                $(".picture-large-show").show().children("img").attr("src",_src);
                _index++;
            });
        });
        //隐藏大图
        $(".picture-mask,.icon-mask-close").on("click",function () {
            $(".picture-large-show").hide();
        });
    },
};
app.init();