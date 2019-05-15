var express = require('express');
var router = express.Router();
var fs = require('fs');

const fileConfig = require('./config').fileConfig;

/* Return all the groups. */
router.get('/', function(req, res, next) {
    fs.readFile(fileConfig.groupUrl, function (err, data) {
        if (err) {
            return console.log("Cannot find the group file!"); 
        }
        let arr = data.toString().split(/[\n]/);
        let list = [];
        for(let str of arr){
            let tmp = {};
            let tmparr = str.split(":");
            if(tmparr.length < 4){
                continue;
            }
            tmp['name'] = tmparr[0];
            tmp['gid'] = tmparr[2];
            tmp['members'] = tmparr[3].replace(/[\r]/g,"").split(",");
            list.push(tmp);
            
        }
        res.send(list);
    });
});

/* Return a list of groups matching all of the specified query fields. The bracket notation indicates that any of the
following query parameters may be supplied:name, gid, member (repeated). */
router.get('/query', function(req, res, next) {
    console.log(req.query);
    fs.readFile(fileConfig.groupUrl, function (err, data) {
        if (err) {
            return console.log("Cannot find the group file!");
        }
        let arr = data.toString().split(/[\n]/);
        let list = [];
        for(let str of arr){
            let tmp = {};
            let tmparr = str.split(":");
            if(tmparr.length < 4){
                continue;
            }
            if((req.query.name != null && tmparr[0] != req.query.name) || (req.query.gid != null && tmparr[2] != req.query.gid) || (req.query.member != null && !memberMatch(req.query.member, tmparr[3].replace(/[\r]/g,"").split(",")))){
                console.log("test",req.query.member, tmparr[3].replace(/[\r]/g,"").split(","));
                continue;
            }else{
                tmp['name'] = tmparr[0];
                tmp['gid'] = tmparr[2];
                tmp['members'] = tmparr[3].replace(/[\r]/g,"").split(",");
                list.push(tmp);
            }
            
        }
        res.send(list);
    });
});

router.get('/:gid', function(req, res, next) {
    fs.readFile(fileConfig.groupUrl, function (err, data) {
        if (err) {
            return console.log("Cannot find the group file!");
        }
        let arr = data.toString().split(/[\n]/);
        let list = [];
        for(let str of arr){
            let tmp = {};
            let tmparr = str.split(":");
            if(tmparr.length < 4){
                continue;
            }
            if(tmparr[2] != req.params.gid){
                continue;
            }else{
                tmp['name'] = tmparr[0];
                tmp['gid'] = tmparr[2];
                tmp['members'] = tmparr[3].replace(/[\r]/g,"").split(",");
                list.push(tmp);
            }
            
        }
        res.send(list);
    });
});

function memberMatch(arr1, arr2){
    console.log(arr1,arr2);
    var set = {};
    for(let i = 0; i < arr2.length; i++){
        set[arr2[i]] = 1;
    }
    for(let i = 0; i < arr1.length; i++){
        if(set[arr1[i]] == null){
            return false;
        }
    }
    return true;
}

module.exports = router;