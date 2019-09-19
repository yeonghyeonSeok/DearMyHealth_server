// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router({mergeParams: true})

const resUtil = require('../../module/responseUtil')
const resCode = require('../../model/returnCode')
const resMessage = require('../../../config/returnMessage')

const pool = require('../../module/pool');

/*
장소 좋아요
METHOD       : POST
URL          : /place/like
BODY         : placeIdx = place의 인덱스
               userIdx = user의 인덱스
*/
router.post('/', async(req, res) => {
    const inputUserIdx = req.body.userIdx;
    const inputPlaceIdx = req.body.placeIdx;
    // default.js -> 회원인지 아닌지 판별

    if(!inputUserIdx || !inputPlaceIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        const likePlaceCheckQuery = 'SELECT * FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
        const likePlaceCheckResult = await pool.queryParam_Arr(likePlaceCheckQuery, [inputUserIdx, inputPlaceIdx]);

        if(likePlaceCheckResult.length != 0 ) { //이미 좋아요 된 상태
            res.status(200).send(resUtil.successTrue(resCode.OK, resMessage.ALREADY_LIKE_PLACE));
        } else {
            const likePlaceInsertQuery = 'INSERT INTO likePlace(userIdx, placeIdx) VALUES (?,?)';
            const likePlaceInsertResult = await pool.queryParam_Arr(likePlaceInsertQuery, [inputUserIdx, inputPlaceIdx]);
    
            if(!likePlaceInsertResult) { //좋아요 실패
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_LIKE_PLACE));
            } else {
                res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.SUCCESS_LIKE_PLACE));
            }
        };
    }
})

/*
장소 좋아요 취소
METHOD       : DELETE
URL          : /place/:placeIdx/like/user/:userIdx
PARAMETER    : placeIdx = place의 인덱스
               userIdx = user의 인덱스
*/

router.delete('/', async(req, res) => {
    const inputUserIdx = req.params.userIdx;
    const inputPlaceIdx = req.params.placeIdx;
    // default.js -> 회원인지 아닌지 판별

    // 장소가 유효한 장소인지 판별 굳이?mysql이라서 안해도 될듯
    if(!inputUserIdx || !inputPlaceIdx) {
        res.status(200).send(resUtil.successFalse(resCode.BAE_REQUEST, resMessage.OUT_OF_VALUE));
    } else {
        const likePlaceCheckQuery = 'SELECT * FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
        const likePlaceCheckResult = await pool.queryParam_Arr(likePlaceCheckQuery, [inputUserIdx, inputPlaceIdx]);
    
        if(likePlaceCheckResult.length == 0) { //이미 좋아요 취소 된 상태
            res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.ALREADY_UNLIKE_PLACE));
        } else {
            const likePlaceDeleteQuery = 'DELETE FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
            const likePlaceDeleteResult = await pool.queryParam_Arr(likePlaceDeleteQuery, [inputUserIdx, inputPlaceIdx]);
    
            if(!likePlaceDeleteResult) { 
                res.status(200).send(resUtil.successFalse(resCode.BAD_REQUEST, resMessage.FAIL_UNLIKE_PLACE));
            } else { 
                res.status(200).send(resUtil.successTrue(resCode.NO_CONTENT, resMessage.SUCCESS_UNLIKE_PLACE));
            }
        };
    }
})

module.exports = router;