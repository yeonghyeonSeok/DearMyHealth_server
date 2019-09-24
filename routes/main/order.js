const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 인기순 코스 조회 - 검색 추천용
router.get('/', async (req, res) => {
    const resAllData = []; // 데이터를 담을 배열 생성
    const listSelectQuery = 'SELECT * FROM course ORDER BY cLikeCount DESC LIMIT 3';    // 좋아요 내림차순 3개 조회
    const listSelectResult = await db.queryParam_None(listSelectQuery);

    console.log(listSelectResult);
    for(let i = 0; i < listSelectResult.length; i++){
        let item = {
            info: []
        }
        item.info.push(listSelectResult[i]);
        resAllData.push(item);
    }
    // resAllData.sort(function(a, b) {return b-a});
    // sort : 배열 안의 원소를 정렬하는 함수
    // b-a : 내림차순

    if(!listSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_ORDER_LIKE, resAllData));    // 코스 인기순 조회 성공
    }
});


module.exports = router; 