const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
추천곡 조회
METHOD       : GET
URL          : /course/tagSearch/:inputTag
PARAMETER    : inputTag = 입력되는 태그값
*/

router.get('/', async(req, res, next) => {

    const inputTag = req.query.tag;
    const QUERY1 = 'SELECT * FROM Tags WHERE tName LIKE "%' + inputTag + '%"';

    try {
        let result1 = await db.queryParam_None(QUERY1);

        if(result1.length > 0) {
            console.log(result1);
            return res.status(200).send(responseUtil.successTrue(returnCode.OK, "검색 성공", result1));
        }
        else {
            return res.status(200).send(responseUtil.successTrue(returnCode.OK, "검색 결과 없음"));
        }
    } catch(err) {
        return res.status(200).send(responseUtil.successFalse(returnCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
    }
});

module.exports = router; 