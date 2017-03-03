/**
 * Created by Administrator on 2017/1/20.
 */
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');
//创建model的模型类
module.exports = mongoose.model('User', usersSchema);