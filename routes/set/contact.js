var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
const nodemailer = require('nodemailer');        // e-mail 보낼 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

router.post('/', authUtil.isLoggedin, async (req, res) => {

    const contactSelectQuery = 'SELECT * FROM user WHERE userIdx =?';  // 토큰값을 받아서 확인
    const contactSelectResult = await db.queryParam_Parse(contactSelectQuery, req.decoded.userIdx);

    var transporter = nodemailer.createTransport({  
        service: 'gmail',
        auth: {
            user: 'hhyyeon0214@gmail.com',
            pass: ''  // git 올리지 않도록 주의
        }
    });

    var mailOption = {
        from: contactSelectResult[0].email,  // 보내는 사람 이메일
        to: 'hhyyeon0214@gmail.com',    // 받는 사람 이메일
        subject: '[PICK+] '+contactSelectResult[0].nickname+'님 문의사항 입니다.',
        text: req.body.comment
    };

    transporter.sendMail(mailOption, function (err, info) {
        if (err) {
            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));   // DB 오류
            console.error('Send Mail error : ', err);
        }
        else {
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SENT_EMAIL));  // 이메일 전송 성공
            console.log('Message sent : ', info);
        }
    });
});


module.exports = router;
