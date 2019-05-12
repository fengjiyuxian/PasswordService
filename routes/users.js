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

/** Return all the groups for a given user. */
router.get('/:uid/groups', function(req, res, next) {
  console.log("/:uid/groups");
  fs.readFile('../test/group',function (err, data) {
      if (err) {
          return console.error(err);
      }
      let arr = data.toString().split(/[\n]/);
      let list = [];
      console.log(req.params);
      let username = getUser(req.params.uid);
      if(username == null){
        res.send("User not found!");
        return;
      }
      
      for(let str of arr){
          let tmp = {};
          let tmparr = str.split(":");
          if(tmparr.length < 4){
            continue;
          }
          tmp['name'] = tmparr[0];
          tmp['gid'] = tmparr[2];
          tmp['members'] = tmparr[3].replace(/[\r]/g,"").split(",");
          if(existUser(username,tmp['members'])){
            list.push(tmp);
          }    
      }
      res.send(list);
  });
});

function getUser(uid){
  var username = null;
  let arr = fs.readFileSync('../test/passwd').toString().split(/[\n]/);
  for(let str of arr){
    let tmparr = str.split(":");
    if(tmparr[2] == uid){
      username = tmparr[0];
      return username;
    }
  } 
  return username; 
}

function existUser(username, arr){
  for(let v of arr){
    if(username == v){
      return true;
    }
  }
  return false;
}

function check(query,obj){
  for(let key in query){
    if(query[key] != obj[key]){
      return false;
    }
  }
  return true;
}
module.exports = router;
