var mongoose = require('mongoose')
var WebsiteSchema = require('../schemas/website')
var Website = mongoose.model('Website',WebsiteSchema)
module.exports = Website