#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app").app;
const fs = require("fs");
// var cluster = require('cluster');
var debug = require("debug")("express-generator:server");
var http = require("http");
var numCPUs = require("os").cpus().length;

var mongoConn = require("../config/dbConfig");
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.HTTPS_PORT);
app.set("port", port);

/**
 * Create HTTP server.
 */

// var server = http.createServer(app);         // Socket added
var server = require("../app").server;

/**
 * Listen on provided port, on all network interfaces.
 */

// If env is has SSL, replacing server
if (process.env.ENV === "development") {
  const https = require("https");
  const ssl = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT),
  };
  server = https.createServer(ssl, app);
}

// server.listen(port,'127.0.0.1');
server.listen(port, "0.0.0.0");
server.on("error", onError);
server.on("listening", onListening);

// }
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log('HTTPS Server running on:' + port);

  app.startMongoDB();
}
