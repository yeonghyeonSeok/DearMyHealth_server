const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


router.get('/', async(req, res, next) => {

    const keyword = req.query.keyword;

    const QUERY1 = 'SELECT * FROM course WHERE cName LIKE "%' + keyword + '%"';
    const QUERY2 = 'SELECT tagIdx FROM Tags WHERE tagName LIKE "%' + keyword + '%"';
    const QUERY3 = 'SELECT placeIdx FROM place WHERE pName LIKE "%' + keyword + '%"';  

    try {
        let result = new Array();
        let result1 = await db.queryParam_None(QUERY1);
        let result2 = await db.queryParam_None(QUERY2);
        let result3 = await db.queryParam_None(QUERY3);


        if(result1.length > 0) {
            console.log(result1);
            result.push({
                "코스 타이틀에 키워드 포함" : result1
            });
        }

        if(result2.length > 0) {
            console.log(result2);
            let tag = new Array();
            const searchTagQuery = 'SELECT courseIdx FROM course_Tag Where tagIdx = ?';

            for(i = 0; i < result2.length; i++) {
                const searchTagResult = await db.queryParam_Parse(searchTagQuery, result2[i]);
                console.log(searchTagResult);
                if(searchTagResult.length > 0) {
                    tag.push(searchTagResult);
                }
            }

            console.log(tag);

            if(tag.length > 0) {
                const courseTagQuery = 'SELECT * FROM course Where courseIdx = ?';

                for(i = 0; i < tag.length; i++) {
                    const courseTagResult = await db.queryParam_Parse(courseTagQuery, tag[i]);
                    console.log(courseTagResult);
                    if(courseTagResult.length > 0) {
                        result.push({
                            "코스 해시태그에 키워드 포함" : courseTagResult //이렇게 보내도 상관없는지 아니면 "코스 해시태그에 키워드 포함 {코스1, 코스2, ... }" 이렇게 보내야 하는지
                        });
                    }
                }
            }
        }

        if(result3.length > 0) {
            console.log(result3);
            let place = new Array();
            const searchPlaceQuery = 'SELECT courseIdx FROM course_Places Where placeIdx = ?';
            
            for(i = 0; i<result3.length; i++) {
                const searchPlaceResult = await db.queryParam_Parse(searchPlaceQuery, result3[i]);
                console.log(searchPlaceResult);
                if(searchPlaceResult.length > 0) {
                    place.push(searchPlaceResult);
                }
            }

            console.log(place);
            
            if(place.length > 0) {
                const coursePlaceQuery = 'SELECT * FROM course Where courseIdx = ?';

                for(i = 0; i < place.length; i++) {
                    const coursePlaceResult = await db.queryParam_Parse(coursePlaceQuery, place[i]);
                    console.log(corsePlaceResult);
                    if(coursePlaceResult.length > 0) {
                        result.push({
                            "코스 장소에 키워드 포함" : coursePlaceResult
                        });
                    }
                }
            }
        }
        console.log(result);
        return res.status(200).send(responseUtil.successTrue(returnCode.OK, "검색 성공", result));

    } catch (err) {
        return res.status(200).send(responseUtil.successFalse(returnCode.INTERNAL_SERVER_ERROR, "INTERNAL_SERVER_ERROR"));
    }
});

module.exports = router; 