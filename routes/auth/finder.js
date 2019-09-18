var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');        // email 보낼 때 사용
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

/* 비밀번호 찾기 */
/* input = email */
// 현재 비밀번호 조회 후 USER 테이블에 해쉬한 새로운 비밀번호를 UPDATE
router.get('/:email', async (req, res) => { // 
    const pwdSelectQuery = 'SELECT * FROM user WHERE email = ?'; 
    const pwdSelectResult = await db.queryParam_Arr(pwdSelectQuery, [req.params.email]);

    console.log(pwdSelectResult);
    if(!pwdSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB 에러
    }else {
        if(pwdSelectResult[0] == null){   // email이 존재하지 않는 경우, result에는 데이터가 들어가지 않는다.
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.NOT_CORRECT_INFO));   // 올바르지 않은 정보 입니다
            }else{    // email이 존재하는 경우, result에는 데이터가 존재한다.
                    /* 이메일로 비밀번호를 전송 
                    원래 있는 user의 비밀번호를 랜덤 값으로 update
                    새로운 password는 이메일로 전송 */

                    // 랜덤 비밀번호 + 솔트 값을 디비에 저장 후 디비에서 가져올 때 비밀번호 솔트 풀어주기
                const salt = pwdSelectResult[0].salt;
                console.log(salt);

                const random = await crypto.randomBytes(32); // 랜덤 값을 받음
                const newRandomPwd = await random.toString('base64');   // 새로운 랜덤 패스워드

                const hashedRandomPwd = await crypto.pbkdf2(newRandomPwd.toString(), salt, 1000, 32, 'SHA512');     // 해쉬된 랜덤 패스워드

                // email에 새로운 비밀번호로 UPDATE
                const pwdUpdateQuery = 'UPDATE user SET password = ? WHERE email = ?';
                const pwdUpdateResult = await db.queryParam_Arr(pwdUpdateQuery, [hashedRandomPwd.toString('base64'), req.params.email]);  // 해쉬된 패스워드를 디비에 저장

                if(!pwdUpdateResult){
                    res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
                    }else{
                        let transporter = nodemailer.createTransport({  // 이메일 전송 모듈
                        service: 'gmail',
                        auth: {
                            user: 'hhyyeon0214@gmail.com',
                            pass: ''  // git에 올리지 않도록 주의
                        }
                    });
                
                    let mailOption = {
                        from: 'hhyyeon0214@gmail.com',  // 보내는 사람 이메일
                        to: pwdSelectResult[0].email,   // 받는 사람의 이메일 = 유저의 이메일로 비밀번호 전송
                        subject: '[PICK+]'+pwdSelectResult[0].nickname+'님의 임시 비밀번호 입니다',
                        text: pwdSelectResult[0].nickname+'님의 임시 비밀번호는   '+ newRandomPwd + '     입니다. 로그인 후 새로운 비밀번호로 수정해주세요.'
                    };
                
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); 
                            console.error('Send Mail error : ', err);
                        } else {
                            console.log("성공")
                            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_SENT_EMAIL));  // 이메일 전송 성공
                            console.log('Message sent : ', info);
                        }
                        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_FIND_PASSWORD));  // 비밀번호 찾기 성공 
                    });
            }   
        }
    }
});

module.exports = router;

