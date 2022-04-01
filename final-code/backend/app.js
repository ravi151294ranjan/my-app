var createError = require("http-errors");
var express = require("express");
var session = require("express-session");
var sharedsession = require("express-socket.io-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var cors = require("cors");
var logger = require("morgan");
var mongo = require("./config/dbConfig");
var tokenGen = require("./routes/tokenGenration");
const usersRouter = require("./routes/users");
const auth = require("./middlewares/auth");
const checkApiPermissions = require("./middlewares/checkApiPermissions.js");

var secretKey = require("./config/config");
// var unityApi = require("./routes/unityApi")
require("dotenv").config();
var app = express();
var server = require("http").Server(app);
var jwt = require("jsonwebtoken");

const rolesRouter = require("./routes/roles");
const adminSharedRouter = require("./routes/admin/shared");
const adminContentRouter = require("./routes/admin/contentManagement");
const adminContentStructureRouter = require("./routes/admin/contentStructure");


const sharedController = require("./controllers/admin/sharedCtrl")
const contentsCtrl = require('./controllers/admin/contentManagementCtrl')
const versionManagementCtrl = require('./controllers/admin/versionManagementCtrl')
const contentStructureCtrl = require('./controllers/admin/contentStructureCtrl')

/**
 * Appconfig module.
 * @module Appconfig
 *
 */

/**
 * database connection in app config
 * @function startMongoDB
 * @param  {string} process.env.DB Its represent database name
 * @param  {string} host  Its represent host name
 */

app.startMongoDB = function (host) {
  mongo.initialize(process.env.DB, host, function (err, res) {
    if (err) console.log(err);
  });
};

app.use(cors({ methods: "GET,PUT,POST,DELETE" }));
// app.use(cors());
// app.options('*', cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: false }));
app.use(express.static(__dirname + "/public/"));
app.use(express.static(__dirname + "/public/uploads/video-content"));
app.use(express.static(__dirname + "/public/uploads/html-package"));
app.use(express.static(__dirname + "/public/uploads/content-image"));
app.use(express.static(__dirname + "/uploadspdf/"));
// app.use(express.static(__dirname + '/uploads/'))
app.use(express.static(__dirname + "/uploads/pdf/"));
app.use(express.static(__dirname + "/public/https-client/"));
app.use(cookieParser());

app.use(
  session({
    secret: "Shh, its a secret!",
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: 31536000,
    },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:4200"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  // res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Accept, Origin, Authorization, X-Requested-With, x-auth-token"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

/**
 * On production to run Index.html based on Angular build
 */
app.get("*", (req, res, next) => {
  if (req.url.indexOf("/admin/") == -1)
    res.sendFile(path.join(__dirname + "/public/https-client/index.html"));
  else next();
});

/**
 * Routing for api connection.
 *  @typedef
 */
// app.use('/', require('./routes/index'));
app.use("/tokenGen", tokenGen);

app.use("/admin/shared/update-video-upload-progress", sharedController.updateVideoUploadProgress);

app.use("/admin/content/preview-html/:id", versionManagementCtrl.previewHtml);
app.use("/admin/content/preview-video/:id", contentsCtrl.previewVideo);
app.use("/admin/content/preview-imported-html/:id", contentsCtrl.previewImportedHtml);
// app.use("/admin/contentstructure", adminContentStructureRouter);

// app.use('/writeJson', writeJson);
// Admin Paths
app.use("/admin/users", auth, checkApiPermissions, usersRouter);
app.use("/admin/roles", auth, rolesRouter);
app.use("/admin/shared", auth, adminSharedRouter);
app.use("/admin/content", auth, checkApiPermissions, adminContentRouter);
app.use("/admin/contentstructure", auth, adminContentStructureRouter);
// app.use('/report', report)
// app.use('/register', register)
// app.use('/forgotPwd', forgotPwd)
app.use(auth, express.static(__dirname + "/uploads/assets"));
// app.use( express.static(__dirname + '/uploads/pdf/'))
// app.use(express.static(path.join(__dirname, "uploads/pdf")))
// app.use(auth,express.static(path.join(__dirname, "uploads/assets")))

/**
 * catch 404 and forward to error handler
 */
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * error handler
 */
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;
module.exports = { app: app, server: server };
