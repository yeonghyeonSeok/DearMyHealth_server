const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 코스 정보 조회
router.get('/:courseIdx', async (req, res) => {
    const infoSelectQuery = 'SELECT * FROM course WHERE courseIdx = ?';

    const infoSelectResult = await db.queryParam_Arr(infoSelectQuery, [req.params.courseIdx]);

    if(!infoSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    }else{
        if(infoSelectResult[0] == null){
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.FAIL_INFO_COURSE)); // 코스 정보 조회 실패
        } else {
            var infoData = {
                courseIdx: 0,
                cName: "",
                cDistrict: 0,
                cType: 0,
                cDescription: "",
                cThumbnail: "",
                cLikeCount: 0,
                totalHour: "",
                cReviewCount: 0,
                placeIdx: [],
                tag : [],
                distance : [],
            }
        
            infoData.courseIdx = infoSelectResult[0].courseIdx;
            infoData.cName = infoSelectResult[0].cName;
            infoData.cDistrict = infoSelectResult[0].cDistrict;
            infoData.cType = infoSelectResult[0].cType;
            infoData.cDescription = infoSelectResult[0].cDescription;
            infoData.cThumbnail = infoSelectResult[0].cThumbnail;
            infoData.cLikeCount = infoSelectResult[0].totalHour;
            infoData.cReviewCount = infoSelectResult[0].cReviewCount;

            const infoTagQuery = 'SELECT tagIdx FROM course_tag WHERE courseIdx = ?';
            const infoTagResult = await db.queryParam_Parse(infoTagQuery, [req.params.courseIdx]);
            
            var tagArray = new Array();
            //tagArray.push(infoTagResult[0].tagIdx);

                    
            for(d = 0; d<infoTagResult.length; d++){
                tagArray.push(infoTagResult[d].tagIdx)
            }
            console.log('tagArray');
            console.log(tagArray);

            const selectTagQuery = 'SELECT tagName FROM tag WHERE tagIdx = ?';
            for(e = 0; e < tagArray.length; e++) {
                console.log(tagArray.length);
                const selectTagResult = await db.queryParam_Parse(selectTagQuery, [tagArray[e]]);
                infoData.tag.push(selectTagResult[0].tagName);
            }

            const infoPlaceQuery = 'SELECT placeIdx FROM course_place WHERE courseIdx = ?';
            const infoPlaceResult = await db.queryParam_Parse(infoPlaceQuery, [req.params.courseIdx]);

            for(i = 0; i<infoPlaceResult.length; i++) {
                console.log('info');
                console.log(infoPlaceResult[i].placeIdx);
                infoData.placeIdx.push(infoPlaceResult[i].placeIdx);
            }


            const selectDistanceQuery = 'SELECT distance FROM distance WHERE courseIdx = ?';
            const selectDistanceResult = await db.queryParam_Parse(selectDistanceQuery, [req.params.courseIdx]);

            for(i = 0; i<selectDistanceResult.length; i++) {
                infoData.distance.push(selectDistanceResult[i].distance);
            }
            //infoData.distance.push(selectDistanceResult);

        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INFO_COURSE, infoData));  // 코스 정보 조회 성공
        }
    }   
});

module.exports = router; 