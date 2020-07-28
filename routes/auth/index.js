var express = require('express');
var router = express.Router();

//로그인(자동로그인)
router.use("/signin", require("./signin"));
//회원가입
router.use("/signup", require("./signup"));
//회원정보조회
router.use("/info", require("./info"));
//회원탈퇴
router.use("/withdrawal", require("./withdrawal"));
//로그아웃
router.use("/logout", require("./logout"));
//토큰 재발급
router.use("/refresh", require("./refresh"));
module.exports = router;