// 각종 라우팅을 연결하는 코드
const express = require('express');
const router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
장소 좋아요
METHOD       : POST
URL          : /place/like
BODY         : placeIdx = place의 인덱스
*/
router.post('/', authUtil.isLoggedin, async(req, res) => {
    const inputUserIdx = req.decoded.userIdx;
    const inputPlaceIdx = req.body.placeIdx;

    if(!inputUserIdx || !inputPlaceIdx) {
        res.status(200).send(resUtil.successFalse(resCode.OK, resMessage.OUT_OF_VALUE));
    } else {
        const likePlaceCheckQuery = 'SELECT * FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
        const likePlaceCheckResult = await db.queryParam_Arr(likePlaceCheckQuery, [inputUserIdx, inputPlaceIdx]);

        if(likePlaceCheckResult.length != 0 ) { //이미 좋아요 된 상태
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_LIKE_PLACE));
        } else {
            const likePlaceInsertQuery = 'INSERT INTO likePlace(userIdx, placeIdx) VALUES (?,?)';
            const likePlaceInsertResult = await db.queryParam_Arr(likePlaceInsertQuery, [inputUserIdx, inputPlaceIdx]);
    
            if(!likePlaceInsertResult) { //좋아요 실패
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_LIKE_PLACE));
            } else {        
                const updatePlaceLikeQuery = 'UPDATE place SET place_like = place_like + 1 WHERE placeIdx = ?';
                const updatePlaceLikeResult = await db.queryParam_Parse(updatePlaceLikeQuery, [inputPlaceIdx]);
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIKE_PLACE));
            }
        };
    }    
})

/*
장소 좋아요 취소
METHOD       : DELETE
URL          : /place/like/:placeIdx
PARAMETER    : placeIdx = place의 인덱스
*/

router.delete('/:placeIdx', authUtil.isLoggedin, async(req, res) => {
    const inputUserIdx = req.decoded.userIdx;
    const inputPlaceIdx = req.params.placeIdx;

    if(!inputUserIdx || !inputPlaceIdx) {
        res.status(200).send(resUtil.successFalse(resCode.OK, resMessage.OUT_OF_VALUE));
    } else {
        const likePlaceCheckQuery = 'SELECT * FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
        const likePlaceCheckResult = await db.queryParam_Arr(likePlaceCheckQuery, [inputUserIdx, inputPlaceIdx]);
    
        if(likePlaceCheckResult.length == 0) { //이미 좋아요 취소 된 상태
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_UNLIKE_PLACE));
        } else {
            const likePlaceDeleteQuery = 'DELETE FROM likePlace WHERE userIdx = ? AND placeIdx = ?';
            const likePlaceDeleteResult = await db.queryParam_Arr(likePlaceDeleteQuery, [inputUserIdx, inputPlaceIdx]);
    
            if(!likePlaceDeleteResult) { 
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_UNLIKE_PLACE));
            } else {
                const selectPlaceLikeQuery = 'SELECT place_like FROM place WHERE placeIdx = ?';
                const selectPlaceLikeResult = await db.queryParam_Parse(selectPlaceLikeQuery, [inputPlaceIdx]);
                
                const likeCount = selectPlaceLikeResult[0].place_like - 1;
                console.log(likeCount);

                const updatePlaceLikeQuery = 'UPDATE place SET place_like = ? WHERE placeIdx = ?';
                const updatePlaceLikeResult = await db.queryParam_Arr(updatePlaceLikeQuery, [likeCount, inputPlaceIdx]);
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_UNLIKE_PLACE));
            }
        };
    }
})

module.exports = router;