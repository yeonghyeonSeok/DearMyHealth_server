var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


// 회원정보 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    const infoSelectQuery = 'SELECT email, nickname FROM user WHERE userIdx = ?'; 
    const infoSelectResult = await db.queryParam_Arr(infoSelectQuery, [req.decoded.userIdx]);

    console.log(infoSelectResult);
    if(!infoSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_USER_LIST, infoSelectResult));      // 회원정보 조회 성공
    }
});

module.exports = router;
