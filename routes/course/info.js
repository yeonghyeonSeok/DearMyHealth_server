const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 코스 정보 조회
router.get('/:courseIdx', async (req, res) => {
    const infoSelectQuery = 'SELECT * FROM course LEFT JOIN course_place ON course.courseIdx = course_place.courseIdx'+
    ' LEFT JOIN course_tag ON course.courseIdx = course_tag.courseIdx WHERE course.courseIdx = ?';

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
            place_1: 0,
            place_2: 0,
            place_3: 0,
            place_4: 0,
            place_5: 0,
            place_6: 0,
            place_7: 0,
            place_8: 0,
            place_9: 0,
            place_10: 0,
            place_11: 0,
            place_12: 0,
            tagIdx: [],
        }
    
        infoData.courseIdx = infoSelectResult[0].courseIdx;
        infoData.cName = infoSelectResult[0].cName;
        infoData.cDistrict = infoSelectResult[0].cDistrict;
        infoData.cType = infoSelectResult[0].cType;
        infoData.cDescription = infoSelectResult[0].cDescription;
        infoData.cThumbnail = infoSelectResult[0].cThumbnail;
        infoData.cLikeCount = infoSelectResult[0].totalHour;
        infoData.cReviewCount = infoSelectResult[0].cReviewCount;
        infoData.place_1 = infoSelectResult[0].place_1;
        infoData.place_2 = infoSelectResult[0].place_2;
        infoData.place_3 = infoSelectResult[0].place_3;
        infoData.place_4 = infoSelectResult[0].place_4;
        infoData.place_5 = infoSelectResult[0].place_5;
        infoData.place_6 = infoSelectResult[0].place_6;
        infoData.place_7 = infoSelectResult[0].place_7;
        infoData.place_8 = infoSelectResult[0].place_8;
        infoData.place_9 = infoSelectResult[0].place_9;
        infoData.place_10 = infoSelectResult[0].place_10;
        infoData.place_11 = infoSelectResult[0].place_11;
        infoData.place_12 = infoSelectResult[0].place_12;

        for(let i = 0; i<infoSelectResult.length; i++){
            infoData.tagIdx.push(infoSelectResult[i].tagIdx);
        }
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_INFO_COURSE, infoData));  // 코스 정보 조회 성공
        }
    }   
});

module.exports = router; 