const express = require('serverless-express/express')
const serverless = require('serverless-http');
const bodyParser = require("body-parser");
const cors = require("cors");
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const app = express();
const db = new AWS.DynamoDB.DocumentClient();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const USERS_TABLE = process.env.USERS_TABLE;

app.post("/save-user", function(req, res) {
  let user = req.body;
  
  console.log("user",user.name);

  const params = {
    TableName: USERS_TABLE,
    Key: {
      "Id": user.id,
      "Name": user.name
    },
    UpdateExpression: 'set Email = :e',
    ExpressionAttributeValues: {
      ':e' : user.email
    }
  }

  db.update(params,(err) =>{
    if (err) {
      console.log("UpdateDB ERROR: ", err);
      res.status(400).json({ error: 'Could not create user' });
    }
      res.status(200);
    });
  
});

app.get("/user/playlist", function(req, res){
  let user = req.body;
   const params = {
      TableName: USERS_TABLE,
      Key: {
        "Id": user.id,
        "Name": user.name
      }
    }
    
    db.get(params, function(err, data){
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        res.status(200).json(data)
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
      }
    });
});

app.post("/user/playlist", function(req, res){
  let user = req.body;
  
   const params = {
      TableName: USERS_TABLE,
      Key: {
        "Id": user.id,
        "Name": user.name
      },
      UpdateExpression: 'set PlayList = :p',
      ExpressionAttributeValues: {
        ':p' : user.songs
      }
  }
  
    db.update(params,(err) =>{
    if (err) {
      console.log("UpdateDB ERROR: ", err);
      res.status(400).json({ error: 'Could not create user' });
    }
      res.status(200);
    });
});


module.exports.handler = serverless(app)