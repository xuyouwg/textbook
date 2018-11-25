var express = require('express');
var router = express.Router();
var dao = require("../public/js/dao.js");


/* 用户界面*/
router.get('/', function (req, res, next) {
  res.render('up');
});


module.exports = router;
