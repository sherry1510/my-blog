/**
 * Created by Administrator on 2017/1/19.
 */
var mongoose = require('mongoose');
//内容管理的表结构
module.exports = new mongoose.Schema({
    //关联字段--内容分类的id
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //关联的model
        ref: 'Category'
    },
    //关联字段--用户id
    user: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //关联的model
        ref: 'User'
    },
    //创建时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //内容标题
    title: String,
    //内容简介
    description: {
        type: String,
        default: ''
    },
    //内容
    content: {
        type: String,
        default: ''
    },
    comments: {
        type: Array,
        default: []
    }


});