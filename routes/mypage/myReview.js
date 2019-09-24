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
    const courseSelectQuery = 'SELECT course.courseIdx, course.cThumbnail, course.cName, course.cLikeCount , course.cReviewCount, review.createdAt , review.comment, review.emotion'+
    ' FROM course JOIN review ON course.courseIdx = review.courseIdx WHERE review.userIdx = ? ORDER BY course.cLikeCount DESC';
    // const courseSelectQuery = 'SELECT *'+
    // ' FROM course JOIN review ON course.courseIdx = review.courseIdx WHERE review.userIdx = ? ORDER BY course.cLikeCount DESC';
    const courseSelectResult = await db.queryParam_Arr(courseSelectQuery, [req.decoded.userIdx]);

    // const placeSelectQuery = 'SELECT *'+
    // ' FROM place JOIN review ON place.placeIdx = review.placeIdx WHERE review.userIdx = ? ORDER BY place.place_like DESC';
    const placeSelectQuery = 'SELECT place.placeIdx, place.place_thumbnail, place.pName, place.place_like, place.pReviewCount, review.createdAt, review.comment, review.emotion'+
    ' FROM place JOIN review ON place.placeIdx = review.placeIdx WHERE review.userIdx = ? ORDER BY place.place_like DESC';
    const placeSelectResult = await db.queryParam_Arr(placeSelectQuery, [req.decoded.userIdx]);


    for (let i = 0; i < courseSelectResult.length; i++) {
        const item = {
            info: []
        }
        item.info.push(courseSelectResult[i]);
        resAllData.push(item);
    }

    for (let i = 0; i < placeSelectResult.length; i++) {
        const item = {
            info: []
        }
        item.info.push(placeSelectResult[i]);
        resAllData.push(item);
    }
    resAllData.sort(function(a, b) {return b-a});

    if(!courseSelectResult && !placeSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_MY_REVIEW, resAllData));      // 내가 남긴 리뷰 조회성공
    }
});

module.exports = router;