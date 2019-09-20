var express = require('express');
var router = express.Router();


router.use("/info", require("./info"));
router.use("/like", require("./like"));

module.exports = router;