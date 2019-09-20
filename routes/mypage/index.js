var express = require('express');
var router = express.Router();

router.use("/seoul", require("./seoul")); // 서울시 소식 - 조회, 등록
/*
router.use("/editCourse", require("./editCourse")); // 내가 만든 코스 조회
router.use("/likeCourse", require("./contact")); // 내가 찜한 코스 조회
*/
module.exports = router;
