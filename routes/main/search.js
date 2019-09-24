const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
메인 검색
METHOD       : GET
URL          : /main/search?keyword={키워드}
PARAMETER    : keyword = 검색어
*/

router.get('', async(req, res, next) => {

    const keyword = req.query.keyword;

    const QUERY1 = 'SELECT courseIdx FROM course WHERE cName LIKE "%'+keyword+'%"';
    const QUERY2 = 'SELECT tagIdx FROM tag WHERE tagName LIKE "%'+keyword+'%"';
    const QUERY3 = 'SELECT placeIdx FROM place WHERE pName LIKE "%'+keyword+'%"';  

    
        let result = new Array();
        let result1 = await db.queryParam_None(QUERY1);
        let result2 = await db.queryParam_None(QUERY2);
        let result3 = await db.queryParam_None(QUERY3);
        console.log('result2');
        console.log(result2);

        if(result1[0] != null) {
        if(result1.length > 0) {
            for(z = 0; z < result1.length; z++) {
            //console.log(result1);
                result.push(result1[z].courseIdx);
            }
        }
    }

        if(result2.length > 0) {
            console.log(result2);
            //let tag = new Array();
            const searchTagQuery = 'SELECT courseIdx FROM course_tag Where tagIdx = ?';
            console.log(result2.length);
            console.log(result2[0].tagIdx);

            for(i = 0; i < result2.length; i++) {
                const searchTagResult = await db.queryParam_Parse(searchTagQuery, result2[i].tagIdx);
                console.log(searchTagResult);
                if(searchTagResult.length > 0) {
                    for(j = 0; j < searchTagResult.length; j++) {
                        result.push(searchTagResult[j].courseIdx);
                    }
                }
            }
        }

        if(result3.length > 0) {
            console.log(result3);
            //let tag = new Array();

            for(i = 0; i < result3.length; i++) {
                for(k = 1; k < 13; k++) {
                    const searchPlaceQuery = 'SELECT courseIdx FROM course_place Where place_'+k+' = ?';
                    const searchPlaceResult = await db.queryParam_Parse(searchPlaceQuery, result3[i].placeIdx);
                    if(searchPlaceResult.length > 0) {
                        for(a = 0; a < searchPlaceResult.length; a++) {
                            result.push(searchPlaceResult[a].courseIdx);
                        }
                    }
                }
            }
        }
    
        var uniqResult = result.reduce(function(a, b) {
            if(a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        for(b = 0; b < uniqResult.length; b++) {
            const selectCourseInfoQuery = 'SELECT cName,  FROM course'
        }

        console.log(uniqResult[0], result);
        return res.status(200).send(defaultRes.successTrue(statusCode.OK, "검색 성공", uniqResult));

    
});

module.exports = router; 