var express = require('express');
var router = express.Router();
var dao = require("../public/js/dao.js");
var sd = require("silly-datetime");
var url = require("url");
var bodyParser = require("body-parser");
var ObjectID = require('mongodb').ObjectID;
global.pageNum = 0;
/*  渲染首页 */

var pagenumber = 5;//设置一页显示5条留言

var find = dao.find;
router.get('/', function (req, res, next) {
  var pathname = req.url;
  var query = url.parse(pathname, true).query;
  var p = query.p;
  console.log(p);
  if (p) {
    var page = p;//url 地址栏传过去的,得到当前用户点击的页码数
  } else {
    var page = 1;//第一页
  }
  var curpage = (page - 1) * pagenumber;  //得到偏移量
  var options = {
    skip: curpage,
    limit: pagenumber//5个留言
  }
 
  find("data", {}, function (err, docs) {
    global.pageNum = docs.length;//总留言数
  })
  //  生成当前页面留言
  find("data", {}, function (err, docs) {
    // console.log(docs);
    console.log(global.pageNum);
    var pageSize = Math.ceil(global.pageNum / pagenumber);//得到总页数 46 / 5 = 10页
    res.render('index', {
      "result": docs,
      "counts": global.pageNum,
      "pages":pageSize,
      "page":page
    })
  }, options)

});


// 提交一行留言
var insertOne = dao.insertOne;
// 自增id
// var getNextSequence = dao.getNextSequence;

router.post("/add", function (req, res) {
  console.log('ajax请求添加');
  // 获得数据
  var title = req.body.title;
  var username = req.body.username;
  var content = req.body.content;
  // 加时间戳
  var time = sd.format(new Date(), "YYYY-MM-DD HH:mm:ss");
  console.log(time.toString());
  // 插入一行数据
  insertOne("data", {
    // "_myId": getNextSequence("userid") ,
    "title": title,
    "username": username,
    "content": content,
    "time": time
  }, function () {
    console.log("插入成功");
    find("data", { "time": time }, function (err, docs) {
      res.send(docs);
    })
  })
});

// 删除一行留言
var deleteOne = dao.deleteOne;
router.get('/del', function (req, res) {
  console.log('ajax请求删除');
  var pathname = req.url;
  var query = url.parse(pathname, true).query;
  var id = query.oid;
  deleteOne("data", { _id: new ObjectID(id) }, function () {
    res.send("1");
  }
    // function () {
    // if (err) {
    //   console.log("数据删除失败");
    //   throw err;
    // }
    // console.log('数据删除成功');
    // res.send("1");
    // })
    // }
  );
})
module.exports = router;
