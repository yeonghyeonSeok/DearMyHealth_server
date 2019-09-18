var express = require('express');
var router = express.Router();

router.use("/info", require("./info")); // 회원정보 조회
router.use("/modify", require("./modify")); // 회원정보 수정 - 이메일, 닉네임
router.use("/contact", require("./contact")); // 이메일 문의하기

module.exports = router;
