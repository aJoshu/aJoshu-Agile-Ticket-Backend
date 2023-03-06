const express = require("express");
const app = express();

const generateUUID = require('./utils/generateUUID.tsx');
let userID = "";

let map = new Map();
let key = new Object();

app.use(express.json());

app.post("/createSession/", async (req, res) => {
  userID = req.body.userID;
  if(userID){

      const sessionID = await generateUUID();
      map.set(userID, {'sessions':{
          'id':sessionID,
          'members':[],   
        }});
        
        console.log(map)
        
        res.send(sessionID);
    }else{
        res.send('404');
    }
});

app.get("/getUserID", (req, res) => {
    console.log(req.body.userID);
    let test = map.get(req.body.userID);
    console.log(test);
  res.send(test);
});

// Other routes can access the global variable
app.get("/otherRoute", (req, res) => {
  res.send(`User ID is: ${userID}`);
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
