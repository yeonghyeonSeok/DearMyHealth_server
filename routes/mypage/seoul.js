var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');  // 파일 업로드
var moment = require('moment'); // creatAt

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 서울시 소식 조회
router.get('/', async (req, res) => {
    const resAllData = []; // 데이터를 담을 배열 생성
    const noticeSelectQuery = 'SELECT * FROM seoul_notice';
    const noticeSelectResult = await db.queryParam_None(noticeSelectQuery);

    for(let i = 0; i < noticeSelectResult.length; i++){
        let item = {
            info: []
        }
        item.info.push(noticeSelectResult[i]);
        resAllData.push(item);
    }
    resAllData.sort(function(a, b) {return b-a});
    // sort : 배열 안의 원소를 정렬하는 함수
    // b-a : 내림차순

    if(!noticeSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_NOTICE, [resAllData]));    // 서울시 소식 조회 성공
    }
});

// 서울시 소식 등록
router.post('/', upload.single('thumbnail'), async (req, res) => {
    const noticeInsertQuery = 'INSERT INTO seoul_notice (thumbnail, url, createdAt) VALUES (?, ?, ?)';
    const noticeInsertResult = await db.queryParam_Arr(noticeInsertQuery, 
        [req.file.location, req.body.url, moment().format('YYYY-MM-DD HH:mm:ss')]);

    if(!noticeInsertResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    }else{
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INSERT_NOTICE));  // 서울시 소식 등록 성공
    }
});

module.exports = router;