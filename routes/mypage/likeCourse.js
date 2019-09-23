var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 내가 찜한 코스 조회
router.get('/', authUtil.isLoggedin, async (req, res) => {
    let resAllData = [];
    const likeSelectQuery = 'SELECT * FROM course JOIN course_like ON course.courseIdx = course_like.courseIdx WHERE userIdx = ? ORDER BY course.cLikeCount DESC'; 
    // 좋아요 순으로 내가 찜한 코스 조회
    const likeSelectResult = await db.queryParam_Arr(likeSelectQuery, [req.decoded.userIdx]);

    // console.log(likeSelectResult);
    if(!likeSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    } else {
        if(likeSelectResult[0] != null){  // courseIdx가 존재할 경우
            for (let i = 0; i < likeSelectResult.length; i++) {
                const item = {
                    info: []
                }
                item.info.push(likeSelectResult[i]);
                resAllData.push(item);
            }
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIKE_COURSE, resAllData));      // 내가 찜한 코스 조회성공
         } else { // courseIdx가 존재하지 않을 경우
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_LIKE_COURSE));  // 내가 찜한 코스가 없습니다
        }
    }
});

module.exports = router;