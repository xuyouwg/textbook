var config = require("./config.js");
var dburl = config.dburl;
var dbname = config.dbname;
var MongoClient = require('mongodb').MongoClient;
//   cb  连上数据库的后续操作（回调函数）
function __connect(cb) {
    MongoClient.connect(dburl + dbname, (err, client) => {
        // client对象重新选择数据库
        var db = client.db(dbname);
        if (err) {
            console.log("数据库连接失败");
            return;
        }
        cb(err, client);
    })

}
//   cn  插入的集合的名称
//   json  插入的数据
//   cb    插入数据成功的回调函数
var obj = {
    insertOne: function (cn, json, cb) {
        __connect(function (err, client) {
            var db = client.db(dbname);
            db.collection(cn).insertOne(json, function (err, result) {
                if (cb) {
                    cb();
                }
                client.close();
            })
        });
    },
    insertMany: function (cn, arr, cb) {
        __connect(function (err, client) {
            var db = client.db(dbname);
            db.collection(cn).insertMany(arr, function (err, result) {
                if (cb) {
                    cb();
                }
                client.close();
            })
        });
    },
    deleteOne: function (cn, json, cb) {
        __connect(function (err, client) {
            var db = client.db(dbname);
            db.collection(cn).deleteOne(json, function (err, result) {
                if (cb) {
                    cb();
                }
                client.close();
            })
        });
    },
    find: function (cn, json, cb, options) {
        if (arguments.length == 3) {
            var limit = 0;
            var skip = 0;
        } else if (arguments.length == 4) {
            // 设置查找条件（用户没有输入的值为0）              
            var limit = options.limit || 0;
            var skip = options.skip || 0;
        }

        __connect(function (err, client) {
            var db = client.db(dbname);
            db.collection(cn).find(json).skip(skip).limit(limit).toArray((err, docs) => {

                if (err) {
                    cb(err, null);
                    client.close();
                    return;
                }
                cb(null, docs);
                client.close();
            })
        });
    },
    // 获取自增id
    getNextSequence: function (name) {
        __connect(function (err, client) {
            var db = client.db(dbname);
            db.createCollection("counters"); 
            db.counters.insertOne(
                {
                    _id: "userid",
                    seq: 0
                }
            )
            var ret = db.counters.findAndModify(
                {
                    query: {
                        _id: name
                    },
                    update: { $inc: { seq: 1 } },
                    new: true
                    // upsert: true
                }
            );
            return ret.seq;
        })
    }
}

module.exports = obj;