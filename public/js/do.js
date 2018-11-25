// ajax请求删除
$(".del").click(function () {
    var oid = $(this).attr('oid');
    var $_this = $(this);
    $.get("http://localhost:3000/del", { oid: oid }, function (data) {
        if (data) {
            $_this.parent().parent().remove();
        }
    })
})
// // ajax请求添加
// $("#add").click(function () {
//     var $_this = $(this);
//     var datas = {};
//     datas.title = $('input').eq(0).val();
//     datas.username = $('input').eq(1).val();
//     datas.content = $('textarea').eq(0).val();
//     console.log(datas);
//     for (var key in datas) {
//         if (datas[key] == "") {
//             alert("内容不能为空!");
//             return;
//         } else {
//             $.post("http://localhost:3000/add", datas, function (data) {
//                 console.log(data);
//                 var str = '<div class="media"><div class="media-left"><img width="70px" class="media-object" src="../images/4.jpg" alt="..."></div><div class="media-body"><h4 class="media-heading">' + data[0].title + '</h4><p>' + data[0].content + '</p><p>' + data[0]._id + '楼&nbsp;&nbsp; ' + data[0].username + '&nbsp;&nbsp; ' + data[0].time + '发表</p><button class="btn btn-default del" oid="' + data[0]._id + '">删除</button><hr></div></div>';
//                 $(str).appendTo(".container");
//             })
//         }
//     }
// })
// 获取当前页page
var urlStr = window.location.search;
var pageArr = urlStr.split("=");
var page = pageArr[1];
console.log(page);

