// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

/*
코스 좋아요
METHOD       : POST
URL          : /course/like
BODY         : courseIdx = course의 인덱스
               userIdx = user의 인덱스
*/
router.post('/', async(req, res) => {
    const inputUserIdx = req.body.userIdx;
    const inputCourseIdx = req.body.courseIdx;
    // default.js -> 회원인지 아닌지 판별

    if(!inputUserIdx || !inputCourseIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        const likeCourseCheckQuery = 'SELECT * FROM likeCourse WHERE userIdx = ? AND courseIdx = ?';
        const likeCourseCheckResult = await pool.queryParam_Arr(likeCourseCheckQuery, [inputUserIdx, inputCourseIdx]);

        if(likeCourseCheckResult.length != 0 ) { //이미 좋아요 된 상태
            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.ALREADY_LIKE_COURSE));
        } else {
            const likeCourseInsertQuery = 'INSERT INTO likeCourse(userIdx, courseIdx) VALUES (?,?)';
            const likeCourseInsertResult = await pool.queryParam_Arr(likeCourseInsertQuery, [inputUserIdx, inputCourseIdx]);
    
            if(!likeCourseInsertResult) { //좋아요 실패
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_COURSE));
            } else {
                res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.SUCCESS_LIKE_COURSE));
            }
        };
    }
})

/*
코스 좋아요 취소
METHOD       : DELETE
URL          : /course/:courseIdx/like/user/:userIdx
PARAMETER    : courseIdx = course의 인덱스
               userIdx = user의 인덱스
*/

router.delete('/', async(req, res) => {
    const inputUserIdx = req.params.userIdx;
    const inputCourseIdx = req.params.courseIdx;
    // default.js -> 회원인지 아닌지 판별

    // 장소가 유효한 장소인지 판별 굳이?mysql이라서 안해도 될듯
    if(!inputUserIdx || !inputCourseIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        const likeCourseCheckQuery = 'SELECT * FROM likeCourse WHERE userIdx = ? AND courseIdx = ?';
        const likeCourseCheckResult = await pool.queryParam_Arr(likeCourseCheckQuery, [inputUserIdx, inputCourseIdx]);
    
        if(likeCourseCheckResult.length == 0) { //이미 좋아요 취소 된 상태
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_UNLIKE_COURSE));
        } else {
            const likeCourseDeleteQuery = 'DELETE FROM likeCourse WHERE userIdx = ? AND courseIdx = ?';
            const likeCourseDeleteResult = await pool.queryParam_Arr(likeCourseDeleteQuery, [inputUserIdx, inputCourseIdx]);
    
            if(!likeCourseDeleteResult) { 
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_UNLIKE_COURSE));
            } else { 
                res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.SUCCESS_UNLIKE_COURSE));
            }
        };
    }
})

module.exports = router;