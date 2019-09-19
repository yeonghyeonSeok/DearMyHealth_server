var express = require('express');
var router = express.Router();


router.use("/signin", require("./signin"));
router.use("/signup", require("./signup"));

//router.use("/duplicated", require("./duplicated")); // 중복확인
//router.use("/finder", require("./finder")); // 비밀번호 찾기

module.exports = router;