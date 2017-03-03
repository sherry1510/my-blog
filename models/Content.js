
var mongoose = require('mongoose');
var contentsSchema = require('../schemas/contents');
//创建model的模型类
module.exports = mongoose.model('Content', contentsSchema);