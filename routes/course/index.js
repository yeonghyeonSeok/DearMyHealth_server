var express = require('express');
var router = express.Router();

router.use("/edit", require("./edit"));
router.use("/enroll", require("./enroll"));
router.use("/tagSearch", require("./tagSearch"));
router.use("/like", require("./like"));
router.use("/info", require("./info"));

module.exports = router;