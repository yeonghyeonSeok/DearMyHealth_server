var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 회원정보 수정 - 비밀번호
router.put('/password', authUtil.isLoggedin, async (req, res) => {
    const pwdSelectQuery = 'SELECT password FROM user WHERE userIdx = ?'
    const pwdSelectResult = await db.queryParam_Arr(pwdSelectQuery, [req.decoded.idx]);
    
    if(!pwdSelectResult){  
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    } else{  
        const salt = pwdSelectResult[0].salt;
        const hashedCurrentPw = await crypto.pbkdf2(req.body.user_pwd.toString(), salt, 1000, 32, 'SHA512');
        // 현재 비밀번호

        // pwdSelectResult[0] 해당 유저의 pw와 hashed Pw가 동일할 때 = 비밀번호 일치
        if(pwdSelectResult[0].user_pw == hashedCurrentPw.toString('base64')){   

            // 새 비밀번호로 수정
            const hashedNewPw = await crypto.pbkdf2(req.body.new_pwd.toString(), salt, 1000, 32, 'SHA512');
            const pwdUpdateQuery = 'UPDATE user SET password = ? WHERE userIdx = ?';
            const pwdUpdateResult = await db.queryParam_Arr(pwdUpdateQuery, 
                [req.body.password, hashedNewPw.toString('base64'), req.decoded.idx]);

                if(!pwdUpdateResult){
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB  에러
                } else {
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UPDATE_PASSWORD));    // 비밀번호 수정 성공
                }
        } else {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_CORRECT_PASSWORD));      // 현재 비밀번호가 일치하지 않습니다
        }
    }
});

// 회원정보 수정 - 닉네임
router.put('/nickname', authUtil.isLoggedin, async (req, res) => {
    // const nameSelectQuery = 'SELECT nickname FROM user WHERE userIdx = ?'
    // const nameSelectResult = await db.queryParam_Arr(nameSelectQuery, [req.decoded.idx]);
    
    // if(!nameSelectResult){  
    //     res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));  // DB 에러
    // } else {
    // 새로운 닉네임 수정
        const nameUpdateQuery = 'UPDATE user SET nickname WHERE userIdx = ?';
        const nameUpdateResult = await db.queryParam_Arr(nameUpdateQuery,[req.body.new_name, req.decoded.idx]);

    if(!nameUpdateResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB  에러
    } else {
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UPDATE_NICKNAME));    // 닉네임 수정 성공
    }
});

module.exports = router;
