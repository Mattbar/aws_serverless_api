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
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "GET PLAYLIST"
    }),
  };
  
  res.send(response)
})

const addUser = user => {
  
  
//   let updateStatus = 
// return updateStatus;

  // const userCount = new Promise((resolve, reject) => {
  //   let count = checkForUser(id).then(data => {
  //     return data;
  //   });

  //   console.log("COUNT: ", count);
  //   resolve(count);
  // });

  // return userCount.then(count => {
  //   if (count == 0) {
  //     console.log("PUT IN DB");
  //     return new Promise((resolve, reject) => {
  //       db.updateItem(
  //         {
  //           TableName: USERS_TABLE,
  //           Item: {
  //             Id: {
  //               N: id
  //             },
  //             Name: {
  //               S: name
  //             },
  //             Email: {
  //               S: email
  //             }
  //           }
  //         },
  //         function(err, data) {
  //           if (err) {
  //             console.log("putDB ERROR: ", err);
  //             return err.statusCode;
  //           }
  //           //console.log("added to DB: ", data);
  //           return 200;
  //         }
  //       );
  //     });
  //   } else {
  //     console.log("ALREADY THERE");
  //     return 200;
  //   }
  // });
};
function checkForUser(id) {
  return new Promise((resolve, reject) => {
    db.query(
      {
        TableName: USERS_TABLE,
        KeyConditionExpression: "Id = :id",
        ExpressionAttributeValues: {
          ":id": {
            N: id
          }
        }
      },
      function(err, data) {
        if (err) {
          console.log("checkDB ERR: ", err);
        }
        console.log("DATA", data.Count);
        resolve(data.Count);
      }
    );
  });
}



module.exports.handler = serverless(app)