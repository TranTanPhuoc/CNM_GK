const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

const data = require("./store");
const multer = require("multer");

const AWS = require('aws-sdk')
const config = new AWS.Config({
  region:'ap-southeast-1',
  accessKeyId:'AKIA5LW7IUE475SYW764',
  secretAccessKey:'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',
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();

const tableSanPham = 'SanPham';

const convertToFormJson = multer();

app.use("/static", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const params = {
      TableName:tableSanPham,
    };
    docClient.scan(params,(err,data)=>{
      if(err){
        res.send(err)
      }
      else {
      res.render("index", { data: data.Items });
      }
    })
});

app.post("/", convertToFormJson.fields([]), (req, res) => {
    const {ma_sp,ten_sp,so_luong} = req.body;
    const params = {
      TableName:tableSanPham,
      Item:{
        ma_sp,
        ten_sp,
        so_luong,
      }
    };
    docClient.put(params,(err,data)=>{
      if(err){
        res.send(err)
      }
      else {
          res.redirect("/");
      }
    });
});

app.post("/delete",convertToFormJson.fields([]),(req,res)=>{
    const {ma_sp} = req.body;
    const params = {
      TableName: tableSanPham,
      Key:{
        ma_sp
      }
    }
    docClient.delete(params,(err,data)=>{
      if(err){
        res.send(err)
      }
      else {
        res.redirect("/");
      }
      });
});

app.post("/update",convertToFormJson.fields([]),(req,res)=>{
  console.log(req.body)
  // const {ma_sp} = req.body;
  // const params = {
  //   TableName: tableSanPham,
  //   Key:{
  //     ma_sp
  //   }
  // }
  // docClient.update(params,(err,data)=>{
  //   if(err){
  //     res.send(err)
  //   }
  //   else {
  //     res.redirect("/");
  //   }
  //   });

  res.redirect("/");
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
