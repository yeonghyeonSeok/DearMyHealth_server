var express = require('express');
var router = express.Router({mergeParams: true});


router.use("/info", require("./info"));
router.use("/like", require("./like"));
router.use("/enroll", require("./enroll"));
router.use("/search", require("./search"));

module.exports = router;