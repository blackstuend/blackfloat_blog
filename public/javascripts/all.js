// sidebar off-canvas
$('document').ready(function () {
    $(".header-nav-sidebar").click(function (e) {
        e.preventDefault();
        $('.header-side').addClass("header-side-show");
        $('body').addClass("body-overflow-none");
    })
    // 取消off-canvas
    // 判斷是否點在off-canvas上 如果點在上面 那就不消失
    $(window).click(function () {
        $('body').removeClass("body-overflow-none");
        $(".header-side").removeClass("header-side-show");
    });

    $('.header-nav-sidebar').click(function (event) {
        event.stopPropagation();
    });
    $('.header-side').click(function (event) {
        event.stopPropagation();
    });


    //點擊向上箭頭 則直接將scroll歸0

    $('.up_arrow').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
    })


    // categories page 

    $(".categorie").click(function(){
        $(this).siblings().removeClass("active");
        $(this).addClass("active")
        let button_categories_name = $(this).attr("data-categories")
        $(".Categories_Topics").text(button_categories_name)
        $(".categories-posts").each(function (index){
            let posts_cate_name = $(this).attr("data-categories")
            if(button_categories_name == "All")
                $(this).addClass("d-block")
            else if(posts_cate_name !=  button_categories_name)
                $(this).removeClass("d-block")
            else
                $(this).addClass("d-block")
        });
    })
    // 判斷往下滑,往上滑
    var scrollPas = 0;

    $(window).scroll(function () {
        Now_scrollPas = $(window).scrollTop();


        // 新增向上的箭頭
        if (Now_scrollPas > 0)
            $(".up_arrow").addClass("up_arrow-show");

        else
            $(".up_arrow").removeClass("up_arrow-show");

        // 當往下時 更改navbar樣式
        if (Now_scrollPas >= scrollPas) //往下 
        {
            $('.header-nav').removeClass("header-nav-down");
        }
        else { //往上
            if(Now_scrollPas != 0)
            $('.header-nav').addClass("header-nav-down");
            else
            $('.header-nav').removeClass("header-nav-down");
        }
        scrollPas = Now_scrollPas;
    });
    // categories page
})