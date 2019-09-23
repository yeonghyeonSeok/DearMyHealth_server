var express = require('express');
var router = express.Router();

router.use("/search", require("./search")); // 메인 뷰 검색
router.use("/order", require("./order"));   // 인기순 코스 조회
router.use("/list", require("./list")); // 코스 타입별 전체조회 - 0 오래가게 1 한국전통 2 사용자

module.exports = router;