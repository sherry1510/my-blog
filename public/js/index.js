/**
 * Created by Administrator on 2017/1/20.
 */
$(function () {
    var $loginBox = $('#loginBox');
    var $registerBox = $('#registerBox');
    var $logout = $('#logout');
    //切换到注册面板
    $loginBox.find('.colMint').on('click', function () {
        $registerBox.show();
        $loginBox.hide();
        $loginBox.find($('input[name="username"]')).val('');
        $loginBox.find($('input[name="password"]')).val('');
    });
    //切换到登陆面板
    $registerBox.find('.colMint').on('click', function () {
        $loginBox.show();
        $registerBox.hide();
        $registerBox.find($('input[name="username"]')).val('');
        $registerBox.find($('input[name="password"]')).val('');
        $registerBox.find($('input[name="repassword"]')).val('');
    });
    //注册
    $registerBox.find('button').on('click', function () {
        //通过ajax提交请求
        $.ajax({
            url: '/api/user/register',
            type: 'post',
            data: {
                username: $registerBox.find($('input[name="username"]')).val(),
                password: $registerBox.find($('input[name="password"]')).val(),
                repassword: $registerBox.find($('input[name="repassword"]')).val()
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                $registerBox.find('.textCenter').html(data.message);
                if (!data.code) {
                    //注册成功
                    window.location.reload();
                    /*setTimeout(function () {
                        $loginBox.show();
                        $registerBox.hide();
                        $registerBox.find($('input[name="username"]')).val('');
                        $registerBox.find($('input[name="password"]')).val('');
                        $registerBox.find($('input[name="repassword"]')).val('');
                    }, 1000)*/
                }
            }
        })
    });
    //登陆
    $loginBox.find('button').on('click', function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find($('input[name="username"]')).val(),
                password: $loginBox.find($('input[name="password"]')).val()
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                $loginBox.find('.textCenter').html(data.message);
                if (!data.code) {
                    //登陆成功
                    window.location.reload();
                }
            }
        })
    });
    //退出
    $logout.on('click', function () {
        $.ajax({
            url: 'api/user/layout',
            type: 'get',
            dataType: 'json',
            success: function (data) {
                if (!data.code) {
                    window.location.reload();
                }
            }
        })
    })
});