var express = require('express');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage');
const db = require('../../module/pool');

router.get('/:type', async (req, res) => {
    const resAllData = []; // 배열 생성
    // const reviewListQuery = 'SELECT * FROM review WHERE reviewType = ?'; // 코스 1, 장소 2 리뷰 조회
    const reviewListQuery = 'SELECT * FROM review WHERE reviewType = ? ORDER BY createdAt DESC'; // 최신순으로 조회

    const reviewListResult = await db.queryParam_Arr(reviewListQuery, [req.params.type]);

    if(!reviewListResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR)); // DB_ERROR  
    } else{
        for(let i = 0 ; i < reviewListResult.length; i++){
            let item = {
                info: []
            }
            item.info.push(reviewListResult[i]);
            resAllData.push(item);
        }
            // resAllData.sort(function(a, b) {return b-a});   // 내림차순 정렬
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_REVIEW, [resAllData])); // 리뷰 조회 성공
    }
});

module.exports = router;