var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");   // 토큰 있을 때 사용
var moment = require('moment');

const upload = require('../../config/multer');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
코스 생성
METHOD       : POST
URL          : /course/edit
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

router.post('/', upload.single('course_thumbnail'), authUtil.isLoggedin, async (req, res) => {
    const inputUserIdx = req.decoded.userIdx;

    const insertCourseQuery = 'INSERT INTO course (cName, cDescription, cThumbnail, cLikeCount, cType, courseIcon, courseDate, cDistrict, userIdx) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const insertCourseResult = await db.queryParam_Arr(insertCourseQuery, [req.body.courseName, req.body.description, req.file.location, 0, req.body.type, req.body.icon, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.district, inputUserIdx]);
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
    const updateEditCountQuery = 'UPDATE user SET editCourseCount = editCourseCount + 1 WHERE userIdx = ?';
    const updateEditCountResult = await db.queryParam_Parse(updateEditCountQuery, [inputUserIdx]);

    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.COURSE_EDIT_SUCCESS));

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 사용자 코스 삭제
router.delete('/:courseIdx', authUtil.isLoggedin, async (req, res) => {
    const userSelectQuery = "SELECT * FROM course WHERE courseIdx = ? AND userIdx = ?"
    const userSelectResult = await db.queryParam_Arr(userSelectQuery, [req.params.courseIdx, req.decoded.userIdx]);

    if (!userSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
    } else {
        if (userSelectResult[0] == null) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_EDIT));    // 사용자 코스가 존재하지 않습니다
        } else {
            const courseDeleteQuery = 'DELETE FROM course WHERE courseIdx = ? AND userIdx = ?';
            const courseDeleteResult = await db.queryParam_Arr(courseDeleteQuery, [userSelectResult[0].courseIdx, userSelectResult[0].userIdx]);    
            const userUpdateQuery = 'UPDATE user SET editCourseCount = editCourseCount - 1 WHERE userIdx =?';
            const userUpdateResult = await db.queryParam_Arr(userUpdateQuery, [userSelectResult[0].userIdx]);  

            if(!courseDeleteResult && !userUpdateResult){
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));
            } else {
                res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_DELETE_EDIT));    // 사용자 코스 삭제 성공  
            }
        }
    }   
});

module.exports = router;