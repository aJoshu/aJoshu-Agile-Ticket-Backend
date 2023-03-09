const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const generateUUID = require("./utils/generateUUID.tsx");

let map = {};

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 8080;
const cors = require("cors");



app.use(cors());
app.use(express.json());

app.post("/createSession", async (req, res) => {
  const userID = req.body.userID;
  const userName = req.body.userName;

  const user = {
    userID,
    userName,
    hasVoted: Boolean,
    vote: Number,
  };

  // Check if user exists
  if (user) {
    const sessionID = await generateUUID();
    // Create a new session in the map with the user as the first member
    map[sessionID] = {
      sessions: {
        id: sessionID,
        members: [user],
        showVote:false,
      },
    };

    res.send(sessionID);
  } else {
    res.send("404");
  }
});

// Route for joining a session
app.post("/joinSession", async (req, res) => {
  const userID = req.body.userID;
  const userName = req.body.userName;
  const sessionID = req.body.sessionID;

  const user = {
    userID,
    userName,
  };

  // Check if userID and sessionID exist
  if (user.userID && sessionID) {
    const session = map[sessionID];
    if (session) {
      const members = session.sessions.members;

      // Check if member already exists in session
      if (!members.some((member) => member.userID === user.userID)) {
        // Add new member to session and update the map
        members.push(user);
        map[sessionID] = session;

        // Emit an event to all connected sockets to fetch the updated session data
        io.emit(`fetchData-${sessionID}`, map[sessionID]);
      } else {
        console.log("User already exists");
      }
    }
  }

  res.send();
});

app.post("/showVotes", (req, res) => {
  const sessionID = req.body.sessionID;

  const session = map[sessionID];
  if (session) {
    session.sessions.showVote = true;
    map[sessionID] = session;

    // Emit an event to all connected sockets to fetch the updated session data
    io.emit(`fetchData-${sessionID}`, map[sessionID]);

    res.send(`Show vote is set to true for session ${sessionID}`);
  } else {
    res.status(404).send("Session not found");
  }
});

app.post("/clearVotes", (req, res) => {
  const sessionID = req.body.sessionID;

  const session = map[sessionID];
  if (session) {
    const members = session.sessions.members;

    // Clear all the votes and hasVoted status for each member in the session
    members.forEach((member) => {
      member.vote = null;
      member.hasVoted = false;
    });
    session.sessions.showVote = false;

    map[sessionID] = session;

    // Emit an event to all connected sockets to fetch the updated session data
    io.emit(`fetchData-${sessionID}`, map[sessionID]);

    res.send("Votes cleared for session " + sessionID);
  } else {
    res.status(404).send("Session not found");
  }
});

// Route for getting user data
app.get("/getUserID", (req, res) => {
  let test = map[req.body.userID];
  res.send(test);
});

app.get("/", (req, res) => {
  res.send(map);
});

// Socket event for when a user votes
io.on("connection", (socket) => {
  socket.on("vote", (arg) => {
    const sessionID = arg.sessionID;
    const userID = arg.user.userID;
    const vote = arg.vote;

    const session = map[sessionID];
    if (session) {
      const members = session.sessions.members;
      const memberIndex = members.findIndex(
        (member) => member.userID === userID
      );

      if (memberIndex !== -1) {
        // Update the member's vote and hasVoted status
        members[memberIndex].vote = vote;
        members[memberIndex].hasVoted = true;
        map[sessionID] = session;

        // Emit an event to all connected sockets to fetch the updated session data
        io.emit(`fetchData-${sessionID}`, map[sessionID]);
      } else {
        console.log("Member not found in session");
      }
    } else {
      console.log("Session not found");
    }
  });
});

server.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});


