/**
 * Created by Administrator on 2017/1/19.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

router.use(function (req, res, next) {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才能进入。。。');
    }
    next();
});
router.get('/', function (req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});
router.get('/user', function (req, res, next) {
    /*
     * limit(number):限制查询的数据条数
     * skip(number):忽略数据的条数
     *
     *每页显示2条
     * 1:1-2 skip:0
     * 2:3-4 skip:2  （当前页数-1）*limit
     * */

    var page = Number(req.query.page || 1);
    var limit = 10;
    var skip = 0;

    User.count().then(function (count) {
        //console.log(count); //数据总条数

        //计算总页数
        var pages = Math.ceil(count / limit);
        //不能超过总页数
        page = Math.min(page, pages);
        //不能小于1
        page = Math.max(page, 1);
        skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            //console.log(users);
            res.render('admin/user_index', {
                users: users,
                count: count,
                limit: limit,
                pages: pages,
                page: page,
                url: '/admin/user'
            });
        });
    });


});
/* 分类管理首页*/
router.get('/category', function (req, res, next) {
    Category.count().then(function (count) {

        var page = Number(req.query.page || 1);
        var limit = 10;
        var skip = 0;
        //计算总页数
        var pages = Math.ceil(count / limit);
        //不能超过总页数
        page = Math.min(page, pages);
        //不能小于1
        page = Math.max(page, 1);
        skip = (page - 1) * limit;
        /*
         * sort():对列表进行排序，-1为降序，1为升序
         * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,
                count: count,
                page: page,
                pages: pages,
                url: '/admin/category'
            });
        });
    })
});
/*分类添加*/
router.get('/category/add', function (req, res, next) {
    res.render('admin/category_add', {
        userInfo: req.userInfo
    })
});
/*分类的保存*/
router.post('/category/add', function (req, res, next) {
    var name = req.body.name || '';
    if (!name) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            errMsg: '分类名不能为空'
        });
        return;
    }

    //数据库中是否已经存在分类名
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '该分类已存在'
            });
            return Promise.reject();
        } else {
            //保存分类
            return new Category({
                name: name
            }).save()
        }
    }).then(function (newCategory) {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        })
    });
});
/*分类的修改*/
router.get('/category/edit', function (req, res, next) {
    //获取要修改分类的信息，并用表单展现出来
    var id = req.query.id || '';
    //获取要修改的分类信息
    Category.findById(id).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '分类信息不存在'
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
});
/*分类的修改保存*/
router.post('/category/edit', function (req, res, next) {
    //获取要修改分类的信息，并用表单展现出来
    var id = req.query.id || '';
    //获取post提交过来的名称
    var name = req.body.name || '';
    Category.findById(id).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '分类信息不存在'
            });
            return Promise.reject();
        } else {
            //用户没有修改分类名称,提交
            if (name == category.name) {
                res.render('admin/success', {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            }
            //要修改的分类信息是否已经在数据库中
            return Category.findOne({
                _id: {$ne: id},
                name: name
            })
        }
    }).then(function (sameCategory) {
        if (sameCategory) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '数据库中已存在同名分类'
            });
            return Promise.reject();
        } else {
            return Category.update({
                _id: id  //第一个为条件
            }, {
                name: name  //第二个为要更新的值
            })
        }

    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        });
    })

});
/*分类的删除*/
router.get('/category/delete', function (req, res, next) {
    var id = req.query.id || '';
    Category.findById(id).then(function (category) {
        if (!category) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '分类信息不存在,不能删除'
            });
            return Promise.reject();
        } else {
            return Category.remove({
                _id: id
            })
        }
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        });
    })
});
/*内容管理首页*/
router.get('/content', function (req, res, next) {
    Content.count().then(function (count) {

        var page = Number(req.query.page || 1);
        var limit = 10;
        var skip = 0;
        //计算总页数
        var pages = Math.ceil(count / limit);
        //不能超过总页数
        page = Math.min(page, pages);
        //不能小于1
        page = Math.max(page, 1);
        skip = (page - 1) * limit;
        /*
         * sort():对列表进行排序，-1为降序，1为升序
         * */
        /*
         * populate():填充单个字段
         * populate('category'):填充关联字段category,也可写成下面的形式
         * populate({path:'category', select: 'name'}),path:指定要填充的关联字段,select:指定填充 document 中的哪些字段。
         * populate填充多个字段：populate('author comments', 'name age content -_id')：用空格隔开
         * */
        Content.find().limit(limit).skip(skip).populate(['category', 'user']).sort({addTime: -1}).then(function (contents) {
            //console.log(contents);
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,
                count: count,
                page: page,
                pages: pages,
                limit:limit,
                url: '/admin/content'
            });
        });
    })
});
/*内容添加*/
router.get('/content/add', function (req, res, next) {
    //查询分类名称
    Category.find().then(function (categories) {
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    })

});
/*内容的保存*/
router.post('/content/add', function (req, res, next) {
    if (!req.body.title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            errMsg: '内容标题不能为空！'
        });
        return;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userInfo._id
    }).save().then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    })

});
/*内容的修改*/
router.get('/content/edit', function (req, res, next) {
    var id = req.query.id || '';
    var categories = [];
    Category.find().sort({_id: -1}).then(function (rs) {
        categories = rs;
        return Content.findById(id).populate('category');
    }).then(function (content) {
        if (!content) {
            res.render('admin/error', {
                userInfo: req.userInfo,
                errMsg: '指定内容不存在'
            })
        } else {
            res.render('admin/content_edit', {
                userInfo: req.userInfo,
                content: content,
                categories: categories
            })
        }
    })
});
/*内容的修改保存*/
router.post('/content/edit', function (req, res, next) {
    var id = req.query.id || '';
    if (!req.body.title) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            errMsg: '标题不能为空'
        });
        return;
    }
    Content.update(
        {
            _id: id
        },
        {
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            content: req.body.content
        }
    ).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '修改成功！',
            url: '/admin/content/edit?id=' + id
        })
    });

});
/*内容的删除*/
router.get('/content/delete', function (req, res, next) {
    var id = req.query.id || '';
    Content.remove({
        _id: id
    }).then(function () {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    })
});
module.exports = router;