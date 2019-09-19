var express = require('express');
var router = express.Router();

/* GET home page. */

router.use("/auth", require("./auth/index"));

router.use("/main", require("./main/index"));

router.use("/course", require("./course/index"));

/*
router.use("/review", require("./review/index"));
router.use("/place", require("./place/index"));
*/
//router.use("/mypage", require("./mypage/index"));
router.use("/set", require("./set/index"));

module.exports = router;