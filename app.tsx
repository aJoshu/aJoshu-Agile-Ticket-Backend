const express = require("express");
const app = express();

const generateUUID = require("./utils/generateUUID.tsx");
let userID = "";

let map = new Map();
let key = new Object();

app.use(express.json());

app.post("/createSession", async (req, res) => {
  userID = req.body.userID;
  if (userID) {
    const sessionID = await generateUUID();
    map.set(sessionID, {
      sessions: {
        id: sessionID,
        members: [userID],
      },
    });

    console.log(map);

    res.send(sessionID);
  } else {
    res.send("404");
  }
});

app.post("/joinSession", async (req, res) => {
  const userID = req.body.userID;
  const sessionID = req.body.sessionID;

  if (userID && sessionID) {
    console.log(`User ${userID} wants to join ${sessionID}`);

    const session = map.get(sessionID);
    if (session) {
      const members = session.sessions.members;
      if (!members.includes(userID)) {
        members.push(userID);
        map.set(sessionID, session);
        console.log(`Added user ${userID} to session ${sessionID}`);
        console.log(`This session's users: ${members}`);
      } else {
        console.log(`User ${userID} already in session ${sessionID}`);
      }
      console.log(map.get(sessionID));
    } else {
      console.log(`Session ${sessionID} not found`);
    }
  } else {
    console.log(`Invalid userID or sessionID`);
  }

  res.send();
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
