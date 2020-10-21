const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"

const axios = require('axios'); //  We have to require Axios to use it

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;
let timeout = 5000;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);

  //---------------------- Checking free bikes
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => checkBikes(socket), timeout);
  //----------------------

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

//----------------------
const checkBikes = async socket => {
  try { // Trying to get the info from the api
    const res = await axios.get(citybikeurl);
    socket.emit('ApiData', res.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
}
//----------------------

server.listen(port, () => console.log(`Listening on port ${port}`));
