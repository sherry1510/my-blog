/**
 * Created by Administrator on 2017/1/19.
 */
var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');

var data;
/*使用中间件的方式：处理通用的数据*/
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    };
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });

});

router.get('/', function (req, res, next) {

    data.category = req.query.category || '';
    data.page = Number(req.query.page || 1);
    data.limit = 5;//每页显示的条数
    data.count = 0; //总条数
    data.pages = 0; //总页数
    var where = {};
    if (data.category) {
        where.category = data.category;
    }
    Content.where(where).count().then(function (count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages); //不能超过总页数
        data.page = Math.max(data.page, 1); //不能小于1
        data.skip = (data.page - 1) * data.limit;

        Content.find().where(where).limit(data.limit).skip(data.skip).populate(['category', 'user']).sort({addTime: -1}).then(function (contents) {
            //console.log(contents);
            data.contents = contents;
            res.render('main/index', data);
        })

    });


});
router.get('/views', function (req, res, next) {
    var contentId = req.query.contentId || '';
    Content.findOne({_id: contentId}).then(function (content) {
        data.content = content;
        content.views++;
        content.save();
        //console.log(data);
        res.render('main/view', data);
    })

});
module.exports = router;