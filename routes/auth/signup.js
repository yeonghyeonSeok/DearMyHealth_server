var express = require('express');
var router = express.Router();

const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
멘티 회원가입
METHOD       : POST
URL          : /auth/signup/mentee
BODY         : email = 회원가입 이메일
               password = 회원가입 패스워드
               name =  회원가입 닉네임
               univ = 학교
               studentNum = 학번
               major = 학과
               gender = 성별
*/

router.post('/mentee', async (req, res) => {
    const selectMenteeIdQuery = 'SELECT * FROM user WHERE email = ?'
    const selectMenteeIdResult = await db.queryParam_Parse(selectMenteeIdQuery, [req.body.email]);
    const signupMenteeQuery = 'INSERT INTO user (type, email, password, salt, name, univ, studentNum, major, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    if (selectMenteeIdResult[0] == null) {
        console.log("일치 없음");
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        console.log(req.body.password);
        const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');
        const signupMenteeResult = await db.queryParam_Arr(signupMenteeQuery, ['mentee', req.body.email, hashedPw.toString('base64'), salt, req.body.name.toString(), req.body.univ, req.body.studentNum, req.body.major, req.body.gender]);

        if (!signupMenteeResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_SIGNUP));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SIGNUP));
        }
    } else {
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_EXIST_EMAIL));
    }

});

/*
멘토 회원가입
METHOD       : POST
URL          : /auth/signup/mentor
BODY         : email = 회원가입 이메일
               password = 회원가입 패스워드
               name =  회원가입 닉네임
               univ = 학교
               studentNum = 학번
               major = 학과
               gender = 성별
*/

router.post('/mentor', async (req, res) => {
    console.log('req.body.email');
    console.log(req.body);


    const selectMentorIdQuery = 'SELECT * FROM user WHERE email = ?'
    const selectMentorIdResult = await db.queryParam_Parse(selectMentorIdQuery, [req.body.email]);
    const signupMentorQuery = 'INSERT INTO user (type, email, password, salt, name, univ, studentNum, major, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    if (selectMentorIdResult[0] == null) {
        console.log("일치 없음");
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        console.log(req.body.password);
        const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');
        const signupMentorResult = await db.queryParam_Arr(signupMentorQuery, ['mentor', req.body.email, hashedPw.toString('base64'), salt, req.body.name, req.body.univ, req.body.studentNum, req.body.major, req.body.gender]);

        if (!signupMentorResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_SIGNUP));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SIGNUP));
        }
    } else {
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_EXIST_EMAIL));
    }

});

/*
이메일 중복체크
METHOD       : GET
URL          : /auth/signup/check?email={email}
PARAMETER    : email = 이메일
*/

router.get('/check', async (req, res) => {
    const selectIdQuery = 'SELECT * FROM user WHERE email = ?'
    const selectIdResult = await db.queryParam_Parse(selectIdQuery, [req.query.email]);

    if (selectIdResult[0] == null) {
        console.log("해당 이메일 사용 가능");
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.USABLE_EMAIL));
    } else {
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_EXIST_EMAIL));
    }
});

module.exports = router;