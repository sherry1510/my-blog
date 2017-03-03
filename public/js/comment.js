/**
 * Created by Administrator on 2017/3/1.
 */

var perpage = 2;//每页显示的条数
var page = 1; //当前页数
var pages = 0; //总页数
var $lis = $('.pager li');
var comments = [];

$('#messageBtn').on('click', function () {
    $.ajax({
        url: '/api/comment/post',
        type: 'post',
        data: {
            contentId: $('#contentId').val(),
            comment: $('#messageContent').val()
        },
        success: function (data) {
            //console.log(data);
            $('#messageContent').val('');
            comments = data.comments.reverse();
            CommentsList();
        }
    })
});
//获取评论
$.ajax({
    url: '/api/comment',
    data: {
        contentId: $('#contentId').val()
    },
    success: function (data) {
        //console.log(data);
        comments = data.comments.reverse();
        CommentsList();
        console.log(comments);
    }
});
//点击上一页、下一页按钮
$('.pager').delegate('a', 'click', function () {
    if ($(this).parent().hasClass('previous')) {
        page--;
    }
    if ($(this).parent().hasClass('next')) {
        page++;
    }
    CommentsList();
});
function CommentsList() {
    var strHtml = '';
    var start = 0;
    var end = 0;

    $('#messageCount').html(comments.length);
    if (!comments.length) {
        $('.messageList').html('<p>还没有评论</p>');
        return;
    }
    pages = Math.ceil(comments.length / perpage);
    start = Math.max(0, (page - 1) * perpage);
    end = Math.min(start + perpage, comments.length);

    $lis.eq(1).html(page + '/' + pages);

    if (page <= 1) {
        page = 1;
        $lis.eq(0).html('<span>没有上一页了</span>');
    } else {
        $lis.eq(0).html('<a href="javascript:;">上一页</a>');
    }
    if (page >= pages) {
        page = pages;
        $lis.eq(2).html('<span>没有下一页了</span>');
    } else {
        $lis.eq(2).html('<a href="javascript:;">下一页</a>');
    }

    for (var i = start; i < end; i++) {
        strHtml += '<div class="messageBox"><p class="name clear"><span class="fl">' + comments[i].username + '</span><span class="fr">' + formatFn(comments[i].postTime) + '</span></p><p>' + comments[i].comment + '</p></div>';
    }
    $('.messageList').html(strHtml);
}
//转换日期格式
function formatFn(d) {
    var date1 = new Date(d); //转换为日期对象
    return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日 ' + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}