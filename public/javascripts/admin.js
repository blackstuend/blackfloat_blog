$('document').ready(function () {
    // 刪除視窗與刪除連結~
    $(".admin-delete").click(function(){
        $('#DeleteModal').modal('show')
        let link = $(this).attr("data-link");
        $(".modal-delete-sure").attr("href","/admin/post/delete/" + link)
    })

    // Sure password == new password
    $("#change_password").submit(function(e){
        let new_password = $("#new_password").val();
        let Re_New_Password = $("#Re_New_Password").val();
        if(new_password != Re_New_Password)
        {
            e.preventDefault();
        }
    })
})