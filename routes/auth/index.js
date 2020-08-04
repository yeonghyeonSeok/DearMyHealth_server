var express = require('express');
var router = express.Router();

//회원가입
router.use("/signup", require("./signup"));

//로그인
router.use("/signin", require("./signin"));

//회원정보 조회
router.use("/info", require("./info"));

// //router.use("/duplicated", require("./duplicated")); // 중복확인
// router.use("/finder", require("./finder")); // 비밀번호 찾기

module.exports = router;