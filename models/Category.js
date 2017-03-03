
var mongoose = require('mongoose');
var categoriesSchema = require('../schemas/categories');
//创建model的模型类
module.exports = mongoose.model('Category', categoriesSchema);