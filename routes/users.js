var express = require('express');
var router = express.Router();
var fs = require('fs');
const attr = ["name", "uid", "gid", "comment", "home", "shell"];

/* GET users listing. */
router.get('/', function(req, res, next) {
  fs.readFile('../test/passwd', function (err, data) {
    if (err) {
        return console.error(err);
    }
    let arr = data.toString().split(/[\n]/);
    let list = [];
    for(let str of arr){
      let tmp = {};
      let tmparr = str.split(":");
      tmparr.splice(1,1);
      for(let i = 0; i < tmparr.length; i++){
        tmp[attr[i]] = tmparr[i];
      }
      list.push(tmp);
    }
    res.send(list);
    
  });
});

/* GET users list with querys. */
router.get('/query', function(req, res, next) {
  console.log(req.query);
  console.log(req.query.name);
  fs.readFile('../test/passwd', function (err, data) {
    if (err) {
        return console.error(err);
    }
    let arr = data.toString().split(/[\n]/);
    let list = [];
    for(let str of arr){
      let tmp = {};
      let tmparr = str.split(":");
      tmparr.splice(1,1);
      for(let i = 0; i < tmparr.length; i++){
        tmp[attr[i]] = tmparr[i];
      }
      if(check(req.query, tmp)){
        list.push(tmp);
      }
        
    }
    res.send(list);
    
  });
});

/* GET users list with querys. */
router.get('/:uid', function(req, res, next) {
  fs.readFile('../test/passwd', function (err, data) {
    if (err) {
        return console.error(err);
    }
    let arr = data.toString().split(/[\n]/);
    for(let str of arr){
      let tmp = {};
      let tmparr = str.split(":");
      tmparr.splice(1,1);
      for(let i = 0; i < tmparr.length; i++){
        tmp[attr[i]] = tmparr[i].replace(/[\r]/g,"");
      }
      if(req.params.uid == tmp['uid']){
        res.send(tmp);
        return;
      }
        
    }
    res.status(404).send(null); 
  });
});

function check(query,obj){
  for(let key in query){
    if(query[key] != obj[key]){
      return false;
    }
  }
  return true;
}
module.exports = router;
