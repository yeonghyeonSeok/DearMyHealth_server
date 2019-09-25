var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
코스 등록
METHOD       : POST
URL          : /course/enroll
BODY         : courseName = 코스 이름
               description = 코스에 대한 간단한 설명
               course_thumbnail =  코스 썸네일
               placeArray[0] = 장소 인덱스
               distance[0] = 장소 간 거리
               tag[0] = 코스 해시태그
               date = 코스 등록 날짜
               district = 코스의 구역
               type = 코스 구분
               icon = 코스 아이콘
               totalHour = 총 소요시간
*/

router.post('/', upload.single('course_thumbnail'), async (req, res) => {
    const insertCourseQuery = 'INSERT INTO course (cName, cDescription, cThumbnail, cLikeCount, cType, courseIcon, totalHour, courseDate, cDistrict) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertCourseResult = await db.queryParam_Arr(insertCourseQuery, [req.body.courseName, req.body.description, req.file.location, 0, req.body.type, req.body.icon, req.body.totalHour, req.body.date, req.body.district]);
    const inputCourseIdx = insertCourseResult.insertId;

    const placeCount = req.body.place.length;
    
    if(placeCount > 0) {
        for(i = 0; i<placeCount; i++) {
            const insertCoursePlaceQuery = 'INSERT INTO course_place (courseIdx, placeIdx) VALUES(?, ?)'
            const insertCoursePlaceResult = await db.queryParam_Arr(insertCoursePlaceQuery, [inputCourseIdx, req.body.place[i]]);
        }
    }

    const distanceCount = req.body.distance.length;
    if(distanceCount > 0) {
        for(j = 0; j < distanceCount; j++) {
            const insertDistanceQuery = 'INSERT INTO distance (courseIdx, distance) VALUES (?, ?)'
            const insertDistanceResult = await db.queryParam_Arr(insertDistanceQuery, [inputCourseIdx, req.body.distance[j]]);
        }
    }
    
    const tagCount = req.body.tag.length;
    //console.log(tagCount);
    for(i = 0; i<tagCount; i++) {
        const selectTagQuery = 'SELECT tagIdx from tag WHERE tagName = ?';
        const selectTagResult = await db.queryParam_Parse(selectTagQuery, [req.body.tag[i]]);
        //console.log(selectTagResult[0]);

        if(selectTagResult[0] != null) {
            const inputTagIdx = selectTagResult[0].tagIdx;
            console.log(inputTagIdx);
            const insertCourseTagQuery = 'INSERT INTO course_tag (courseIdx, tagIdx) VALUES(?, ?)'
            const insertCourseTagResult = await db.queryParam_Arr(insertCourseTagQuery, [inputCourseIdx, inputTagIdx]);

            const updateTagQuery = 'UPDATE tag SET tagCount = tagCount + 1 WHERE tagIdx = ?';
            const updateTagResult = await db.queryParam_Parse(updateTagQuery, [inputTagIdx]);
        } else {
            const insertTagQuery = 'INSERT INTO tag (tagName, tagCount) VALUES (?, ?)';
            const insertTagResult = await db.queryParam_Arr(insertTagQuery, [req.body.tag[i], 1]);

            const inputTagIdx = insertTagResult.insertId;
            console.log(inputTagIdx);
            const insertCourseTagQuery = 'INSERT INTO course_tag (courseIdx, tagIdx) VALUES(?, ?)'
            const insertCourseTagResult = await db.queryParam_Arr(insertCourseTagQuery, [inputCourseIdx, inputTagIdx]);
        }
    }

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.COURSE_ENROLL_SUCCESS));

});

module.exports = router;