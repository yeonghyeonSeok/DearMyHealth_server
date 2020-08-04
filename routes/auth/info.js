var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');        // email 보낼 때 사용
const crypto = require('crypto-promise');

const mailInfo = require('../../config/gmail.json');
const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

/*
이메일 찾기
METHOD       : GET
URL          : /auth/info/email?name={name}&univ={univ}&studentNum={studentNum}
PARAMETER    : name = 이름
               univ = 대학교 이름
               studentNum = 학번
*/
router.get('/email', async (req, res) => {
    const selectEmailQuery = 'SELECT * FROM user WHERE name = ? and univ = ? and studentNum = ?';
    const selectEmailResult = await db.queryParam_Arr(selectEmailQuery, [req.query.name, req.query.univ, req.query.studentNum]);

    if(!selectEmailResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
    } else {
        if(selectEmailResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_FIND_ID));
        } else {
            const email = selectEmailResult[0].email;
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_FIND_ID, email));
        }
    }

});


/*
비밀번호 찾기
METHOD       : GET
URL          : /auth/info/password?name={name}&univ={univ}&email={email}
PARAMETER    : name = 이름
               univ = 대학교 이름
               email = 이메일
*/
// 현재 비밀번호 조회 후 USER 테이블에 해쉬한 새로운 비밀번호를 UPDATE
router.get('/password', async (req, res) => { // 
    const selectPwQuery = 'SELECT * FROM user WHERE  name = ? and univ = ? and email = ?'; 
    const selectPwResult = await db.queryParam_Arr(selectPwQuery, [req.query.name, req.query.univ, req.query.email]);

    console.log(selectPwResult);
    if(!selectPwResult){
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));    // DB 에러
    }else {
        if(selectPwResult[0] == null){
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_FIND_USER));   // 올바르지 않은 정보 입니다
            }else{
                    /* 이메일로 비밀번호를 전송 
                    원래 있는 user의 비밀번호를 랜덤 값으로 update
                    새로운 password는 이메일로 전송 */

                    // 랜덤 비밀번호 + 솔트 값을 디비에 저장 후 디비에서 가져올 때 비밀번호 솔트 풀어주기
                const salt = selectPwResult[0].salt;
                console.log(salt);

                const random = await crypto.randomBytes(32); // 랜덤 값을 받음
                const newRandomPw = await random.toString('base64');   // 새로운 랜덤 패스워드

                const hashedRandomPw = await crypto.pbkdf2(newRandomPw.toString(), salt, 1000, 32, 'SHA512');     // 해쉬된 랜덤 패스워드

                // email에 새로운 비밀번호로 UPDATE
                const updatePwQuery = 'UPDATE user SET password = ? WHERE email = ?';
                const updatePwResult = await db.queryParam_Arr(updatePwQuery, [hashedRandomPw.toString('base64'), req.query.email]);  // 해쉬된 패스워드를 디비에 저장

                if(!updatePwResult){
                    res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR));
                    }else{
                        let transporter = nodemailer.createTransport({  // 이메일 전송 모듈
                        service: 'gmail',
                        auth: {
                            user: mailInfo.email,
                            pass: mailInfo.password  // git에 올리지 않도록 주의
                        }
                    });
                
                    let mailOption = {
                        from: 'syh4834@gmail.com',  // 보내는 사람 이메일 -> 테스트용으로 사용
                        to: selectPwResult[0].email,   // 받는 사람의 이메일 = 유저의 이메일로 비밀번호 전송
                        subject: '[DearMyHealth] '+selectPwResult[0].name+'님의 임시 비밀번호 입니다.',
                        text: selectPwResult[0].name+'님의 임시 비밀번호는 '+newRandomPw+ '입니다. 로그인 후 새로운 비밀번호로 수정해주세요.'
                    };
                
                    transporter.sendMail(mailOption, function (err, info) {
                        if (err) {
                            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.DB_ERROR)); 
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

