// Adding a global and try catch

/* eslint-disable @typescript-eslint/explicit-function-return-type */
try {
  // Adding all the dependencies
  require('dotenv').config();
  const express = require('express');
  const app = express();
  const http = require('http');
  const cors = require('cors');
  const router = express.Router();
  const port = process.env.HTTP_PORT;
  const server = http.createServer(app);
  const path = require('path');
  const actualPath = __dirname.replace("/bin","");

  // fixing the default headers for the server
  router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  // fixing the default static file path -- in our case angular path from .env file
  app.use(express.static(actualPath + '/public/http-client/'));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${actualPath}/public/http-client/${process.env.ENV}.html`));
});
  

 // setting up the port for the server
  server.listen(port, () => {
    console.log(' HTTP Server running on:' + port);
  });


// global catch
} catch (err) {
  console.log('Unexpected ', err.toString());
  console.log('A detailed description of the error is given below:');
  console.log(err.stack);
}
