var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const jwt = require('../../module/jwt');
const db = require('../../module/pool');

/*
토큰 재발급
METHOD       : GET
URL          : /auth/refresh
BODY         : email = 회원가입 이메일
*/

router.get('/', (req, res) => {
    const refreshToken = req.headers.refreshtoken;

    const selectUserQuery = 'SELECT * FROM user WHERE refreshToken = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, [refreshToken]);

    const selectUser = {
        userIdx: selectUserResult.userIdx,
        email: selectUserResult.email,
        name: selectUserResult.name
    };

    const newAccessToken = jwt.refresh(selectUser);

    res.status(statusCode.OK).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_REFRESH_TOKEN, newAccessToken));
});