// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
코스 좋아요
METHOD       : POST
URL          : /course/like
BODY         : courseIdx = course의 인덱스
*/
router.post('/', authUtil.isLoggedin, async(req, res) => {
    const inputUserIdx = req.decoded.userIdx;
    const inputCourseIdx = req.body.courseIdx;

    if(!inputUserIdx || !inputCourseIdx) {
        res.status(200).send(resUtil.successFalse(resCode.OK, resMessage.OUT_OF_VALUE));
    } else {
        const likeCourseCheckQuery = 'SELECT * FROM course_like WHERE userIdx = ? AND courseIdx = ?';
        const likeCourseCheckResult = await db.queryParam_Arr(likeCourseCheckQuery, [inputUserIdx, inputCourseIdx]);

        if(likeCourseCheckResult.length != 0 ) { //이미 좋아요 된 상태
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_LIKE_COURSE));
        } else {
            const likeCourseInsertQuery = 'INSERT INTO course_like(userIdx, courseIdx) VALUES (?,?)';
            const likeCourseInsertResult = await db.queryParam_Arr(likeCourseInsertQuery, [inputUserIdx, inputCourseIdx]);
    
            if(!likeCourseInsertResult) { //좋아요 실패
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.COURSE_LIKE_FAIL));
            } else {        
                const updateCourseLikeQuery = 'UPDATE course SET cLikeCount = cLikeCount + 1 WHERE courseIdx = ?';
                const updateCourseLikeResult = await db.queryParam_Parse(updateCourseLikeQuery, [inputCourseIdx]);
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.COURSE_LIKE_SUCCESS));
            }
        };
    }    
})

/*
코스 좋아요 취소
METHOD       : DELETE
URL          : /course/like/:courseIdx
PARAMETER    : courseIdx = course의 인덱스
*/

router.delete('/:courseIdx', authUtil.isLoggedin, async(req, res) => {
    const inputUserIdx = req.decoded.userIdx;
    const inputCourseIdx = req.params.courseIdx;

    if(!inputUserIdx || !inputCourseIdx) {
        res.status(200).send(resUtil.successFalse(resCode.OK, resMessage.OUT_OF_VALUE));
    } else {
        const likeCourseCheckQuery = 'SELECT * FROM course_like WHERE userIdx = ? AND courseIdx = ?';
        const likeCourseCheckResult = await db.queryParam_Arr(likeCourseCheckQuery, [inputUserIdx, inputCourseIdx]);
    
        if(likeCourseCheckResult.length == 0) { //이미 좋아요 취소 된 상태
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_UNLIKE_COURSE));
        } else {
            const likeCourseDeleteQuery = 'DELETE FROM course_like WHERE userIdx = ? AND courseIdx = ?';
            const likeCourseDeleteResult = await db.queryParam_Arr(likeCourseDeleteQuery, [inputUserIdx, inputCourseIdx]);
    
            if(!likeCourseDeleteResult) { 
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.COURSE_UNLIKE_FAIL));
            } else {
                const selectCourseLikeQuery = 'SELECT cLikeCount FROM course WHERE courseIdx = ?';
                const selectCourseLikeResult = await db.queryParam_Parse(selectCourseLikeQuery, [inputCourseIdx]);
                
                const likeCount = selectCourseLikeResult[0].cLikeCount - 1;
                console.log(likeCount);

                const updateCourseLikeQuery = 'UPDATE course SET cLikeCount = ? WHERE courseIdx = ?';
                const updateCourseLikeResult = await db.queryParam_Arr(updateCourseLikeQuery, [likeCount, inputCourseIdx]);
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.COURSE_UNLIKE_SUCCESS));
            }
        };
    }
})

module.exports = router;