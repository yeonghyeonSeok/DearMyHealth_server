var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

const jwtUtils = require('../../module/jwt');

/*
로그인
METHOD       : POST
URL          : /auth/signin
BODY         : email = 사용자 이메일
               password = 사용자 패스워드
*/

router.post('/', async (req, res) => {
    const selectUserQuery = 'SELECT * FROM user WHERE email = ?'
    const selectUserResult = await db.queryParam_Parse(selectUserQuery, req.body.email);
    console.log(selectUserResult[0])//유저 정보

    if (selectUserResult[0] == null) {//id가 존재하지 않으면
        console.log("id가 존재하지 않음");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
    } else {
        const salt = selectUserResult[0].salt;
        const hashedEnterPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');

        if (selectUserResult[0].password == hashedEnterPw.toString('base64')) {
            const tokens = jwtUtils.sign(selectUserResult[0]);
            const refreshToken = tokens.refreshToken;
            const refreshTokenUpdateQuery = "UPDATE user SET refreshToken = ? WHERE email= ?";
            const refreshTokenUpdateResult = await db.queryParam_Parse(refreshTokenUpdateQuery, [refreshToken, req.body.email]);
            if (!refreshTokenUpdateResult) {
                res.status(200).send(defaultRes.successTrue(statusCode.DB_ERROR, "refreshtoken DB등록 오류 "));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNIN_SUCCESS, tokens));
            }

        } else {
            console.log("비밀번호가 일치하지 않음");
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_USERINFO));
        }
    }

});

module.exports = router;