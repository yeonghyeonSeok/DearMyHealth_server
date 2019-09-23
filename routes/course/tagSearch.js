const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
태그 검색
METHOD       : GET
URL          : /course/tagSearch?tagName=
PARAMETER    : tagName = 태그 이름 
*/

router.get('/', async(req, res, next) => {

    const keyword = req.query.tagName;
    console.log(keyword);

    const searchTagQuery = 'SELECT * FROM tag WHERE tagName LIKE "%'+keyword+'%"';
    const searchTagResult = await db.queryParam_None(searchTagQuery);

    console.log(searchTagResult);

    if(searchTagResult[0] == null) {
        return res.status(200).send(defaultRes.successFalse(statusCode.OK, "일치하는 태그 없음")); 
    } else {
        return res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.TAG_SEARCH_SUCCESS, searchTagResult));

    }
});

module.exports = router; 