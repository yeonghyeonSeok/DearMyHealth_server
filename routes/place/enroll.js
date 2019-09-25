var express = require('express');
var router = express.Router();

const upload = require('../../config/multer');
const crypto = require('crypto-promise');

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
장소 등록
METHOD       : POST
URL          : /place/enroll
BODY         : placeName = 장소 이름
               description = 장소에 대한 간단한 설명
               place_thumbnail =  장소 이미지
               latitude = 장소의 위도
               longitude = 장소의 경도
               address = 장소의 위치
               number = 장소의 번호
               fee = 장소 비용
               businessHour = 장소 영업시간
*/

router.post('/', upload.single('place_thumbnail'), async (req, res) => {
    const insertPlaceQuery = 'INSERT INTO place (pName, pDescription, place_thumbnail, place_like) VALUES (?, ?, ?, ?)';
    const selectPlaceNameQuery = 'SELECT placeIdx FROM place WHERE pName = ?';
    const selectPlaceNameResult = await db.queryParam_Parse(selectPlaceNameQuery, [req.body.placeName]);

    if(selectPlaceNameResult[0] == null) { //일치하는 장소 없음
        const insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [req.body.placeName, req.body.description, req.file.location, 0]);
        const selectPlaceIdxResult = await db.queryParam_Parse(selectPlaceNameQuery, [req.body.placeName]);
        const inputPlaceIdx = selectPlaceIdxResult[0].placeIdx;
        console.log(inputPlaceIdx);

        const insertLocationQuery = 'INSERT INTO location (placeIdx, latitude, longitude) VALUES (?, ?, ?)';
        const insertLocationResult = await db.queryParam_Arr(insertLocationQuery, [inputPlaceIdx, req.body.latitude, req.body.longitude]);

        const insertDetailQuery = 'INSERT INTO place_detail (placeIdx, pAddress) VALUES (?, ?)';
        const insertDetailResult = await db.queryParam_Arr(insertDetailQuery, [inputPlaceIdx, req.body.address]);

        if(req.body.number != null) {
            const updateNumberQuery = 'UPDATE place_detail SET pNumber = ? WHERE placeIdx = ?';
            const updateNumberResult = await db.queryParam_Arr(updateNumberQuery, [req.body.number, inputPlaceIdx]);
        }

        if(req.body.fee != null) {
            const updateFeeQuery = 'UPDATE place_detail SET pFee = ? WHERE placeIdx = ?';
            const updateFeeResult = await db.queryParam_Arr(updateFeeQuery, [req.body.fee, inputPlaceIdx]);
        }

        if(req.body.businessHour != null) {
            const updateHourQuery = 'UPDATE place_detail SET pHour = ? WHERE placeIdx = ?';
            const updateHourResult = await db.queryParam_Arr(updateHourQuery, [req.body.businessHour, inputPlaceIdx]);
        }
        
        /*
        const placeQuery = 'SELECT * FROM place WHERE placeIdx = ?';
        const locationQuery = 'SELECT * FROM location WHERE placeIdx = ?';
        const detailQuery = 'SELECT * FROM place_Detail WHERE placeIdx = ?';

        const placeResult = await db.queryParam_Parse(placeQuery, [inputPlaceIdx]);
        const locationResult = await db.queryParam_Parse(locationQuery, [inputPlaceIdx]);
        const detailResult = await db.queryParam_Parse(detailQuery, [inputPlaceIdx]);

        console.log(placeResult);
        console.log(locationResult);
        console.log(detailResult);
        */

        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.PLACE_ENROLL_SUCCESS));

    } else { //이미 등록된 장소
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_EXIST_PLACE));
    }
    

    /*
    if (selectIdResult[0] == null) {
        console.log("일치 없음");
        const buf = await crypto.randomBytes(64);
        const salt = buf.toString('base64');
        console.log(req.body.password);
        const hashedPw = await crypto.pbkdf2(req.body.password.toString(), salt, 1000, 32, 'SHA512');
        const signupResult = await db.queryParam_Arr(signupQuery, [req.body.email, req.body.nickname, hashedPw.toString('base64'), salt, 0, 0, 0]);

        if (!signupResult) {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.SIGNUP_FAIL));
        } else { //쿼리문이 성공했을 때
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SIGNUP_SUCCESS));
        }
    } else {// 이미존재
        console.log("이미 존재");
        res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.ALREADY_EXIST_USER));
    }*/

});

module.exports = router;