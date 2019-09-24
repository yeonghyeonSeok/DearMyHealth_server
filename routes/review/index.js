var express = require('express');
var router = express.Router();

router.use("/enroll", require("./enroll")); // 리뷰 등록 - 코스 1, 장소 2
router.use("/list", require("./list")); // 리뷰 조회

module.exports = router;