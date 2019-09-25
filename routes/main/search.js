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

router.get('/', async(req, res, next) => {

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
            const searchPlaceQuery = 'SELECT courseIdx FROM course_place Where placeIdx = ?';
            for(i = 0; i < result3.length; i++) {
                const searchPlaceResult = await db.queryParam_Parse(searchPlaceQuery, result3[i].placeIdx);
                if(searchPlaceResult.length > 0) {
                    for(a = 0; a < searchPlaceResult.length; a++) {
                        result.push(searchPlaceResult[a].courseIdx);
                    }
                }
            }
        }
    
        var uniqResult = result.reduce(function(a, b) {
            if(a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);

        if(uniqResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, "검색내용없음"));
        } else {
            

        var searchResult = new Array();
        //console.log(uniqResult[0], result);
        for(b = 0; b < uniqResult.length; b++) {  
            const infoSelectQuery = 'SELECT * FROM course LEFT JOIN course_tag ON course.courseIdx = course_tag.courseIdx WHERE course.courseIdx = ?';
            const infoSelectResult = await db.queryParam_Parse(infoSelectQuery, [uniqResult[b]]);
            console.log('infoSelectResult');

            if(!infoSelectResult){
                res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.MAIN_SEARCH_FAIL));
            } else{
                if(infoSelectResult[0] == null){
                res.status(200).send(defaultRes.successFalse(statusCode.OK, "검색내용없음")); // 코스 정보 조회 실패
                } else {
                    var infoData = {
                        courseIdx: 0,
                        cName: "",
                        cThumbnail: "",
                        cLikeCount: 0,
                        cReviewCount: 0,
                        courseIcon : 0,
                        tag: [],
                    }
                
                infoData.courseIdx = infoSelectResult[0].courseIdx;
                infoData.cName = infoSelectResult[0].cName;
                infoData.cThumbnail = infoSelectResult[0].cThumbnail;
                infoData.cLikeCount = infoSelectResult[0].totalHour;
                infoData.cReviewCount = infoSelectResult[0].cReviewCount;
                infoData.courseIcon = infoSelectResult[0].courseIcon;

                var tagArray = new Array();
                
                for(let d = 0; d<infoSelectResult.length; d++){
                    tagArray.push(infoSelectResult[d].tagIdx)
                }

                const selectTagNameQuery = 'SELECT tagName FROM tag WHERE tagIdx = ?';
                for(e = 0; e < tagArray.length; e++) {
                    console.log(tagArray.length);
                    const selectTagNameResult = await db.queryParam_Parse(selectTagNameQuery, [tagArray[e]]);
                    infoData.tag.push(selectTagNameResult[0].tagName);
                }

                //infoData.tag.push(tagName);
                }
            }
            searchResult.push(infoData);
            console.log(searchResult);   
        }

    }
        

    return res.status(200).send(defaultRes.successTrue(statusCode.OK, "검색 성공", searchResult));
    
});

module.exports = router; 