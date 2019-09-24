var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 내가 남긴 리뷰 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    let resAllData = [];
    // const edtSelectQuery = 'SELECT * FROM user JOIN course ON user.userIdx = course.userIdx WHERE userIdx = ? ORDER BY course.cLikeCount DESC'; 
    const edtSelectQuery = 'SELECT course.courseIdx , course.cName, course.cThumbnail, cLikeCount'+
    ' FROM user JOIN course ON user.userIdx = course.userIdx WHERE user.userIdx = ? ORDER BY course.cLikeCount DESC'; 
    const edtSelectResult = await db.queryParam_Arr(edtSelectQuery, [req.decoded.userIdx]);

    console.log(edtSelectResult);
    if(!edtSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        if(edtSelectResult[0] != null){ // 내가 만든 코스가 존재할 경우
            for (let i = 0; i < edtSelectResult.length; i++) {
                const item = {
                    info: []
                }
                item.info.push(edtSelectResult[i]);
                resAllData.push(item);
            }
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_EDIT_COURSE, resAllData));      // 내가 만든 코스 조회성공
        } else {    // 내가 만든 코스가 없는 경우
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EDIT_COURSE));  // 내가 만든 코스가 없습니다
        }
    }
});

module.exports = router;