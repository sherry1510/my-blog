/**
 * Created by Administrator on 2017/1/19.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

//统一返回格式
var resData;
router.use(function (req, res, next) {
    resData = {
        code: 0,
        message: ''
    };
    next();//将控制权交给下一个中间件
});

/*
 * 用户注册
 *   注册逻辑
 *
 *   1.用户名不能为空
 *   2.密码不能为空
 *   3.两次输入密码必须一致
 *
 *   1.用户是否已经被注册了
 *       数据库查询
 *
 * */
router.post('/user/register', function (req, res, next) {
    //console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if (username == '') {
        resData.code = 1;
        resData.message = '用户名不能为空';
        res.json(resData);
        return;
    }
    if (password == '') {
        resData.code = 2;
        resData.message = '密码不能为空';
        res.json(resData);
        return;
    }
    if (password != repassword) {
        resData.code = 3;
        resData.message = '两次输入的密码不一致';
        res.json(resData);
        return;
    }
    //用户名是否已经被注册
    User.findOne({
        username: username
    }).then(function (userInfo) {
        //console.log(userInfo);
        if (userInfo) {
            //数据库中已经存在该条记录
            resData.code = 4;
            resData.message = '用户名已经被注册';
            res.json(resData);
            return;
        }
        var user = new User({
            username: username,
            password: password
        });
        //保存用户注册的信息到数据库中
        return user.save();
    }).then(function (newUserInfo) {
        //console.log(newUserInfo);
        resData.message = '注册成功';
        //注册成功后，直接跳到个人中心面板
        req.cookies.set('userInfo', JSON.stringify({
            _id: newUserInfo._id,
            username: newUserInfo.username
        }));
        res.json(resData);
    });

});
/**
 * 登陆
 */
router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if (username == '' || password == '') {
        resData.code = 1;
        resData.message = '用户名和密码不能为空';
        res.json(resData);
        return;
    }
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        //console.log(userInfo);
        if (!userInfo) {
            resData.code = 2;
            resData.message = '用户名或密码错误';
            res.json(resData);
            return;
        }
        resData.message = '登录成功';
        resData.userInfo = {
            _id: userInfo._id,
            username: userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
        }));
        res.json(resData);
    })
});
/**
 * 退出
 */
router.get('/user/layout', function (req, res, next) {
    req.cookies.set('userInfo', null);
    res.json(resData);
});
/*评论提交*/
router.post('/comment/post', function (req, res, next) {
    var contentId = req.body.contentId || '';
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        comment: req.body.comment
    };
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        content.comments.push(postData);
        return content.save();
    }).then(function (newContent) {
        //console.log(newContent);
        resData.message = '评论提交成功';
        resData.comments = newContent.comments;
        res.json(resData);
    })
});
/*获取评论*/
router.get('/comment', function (req, res, next) {
    var contentId = req.query.contentId || '';
    //console.log(contentId);
    Content.findOne({
        _id: contentId
    }).then(function (content) {
       // console.log(content);
        resData.message = '评论提交成功';
        resData.comments = content.comments;
        res.json(resData);
    })
});
module.exports = router;