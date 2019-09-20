const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
장소 정보 조회
METHOD       : GET
URL          : /place/info/:placeIdx
PARAMETER    : placeIdx = place의 인덱스
*/

router.get('/:placeIdx', async(req, res, next) => {
    //결과값에 보여줘야 하는 것 : 장소 정보(place테이블), 장소 세부사항(place_Detail), 장소 위치(location)

    const inputPlaceIdx = req.params.placeIdx;
    const selectPlaceQuery = 'SELECT * FROM place WHERE placeIdx = ?';
    const selectPlaceResult = await db.queryParam_Parse(selectPlaceQuery, [inputPlaceIdx]);
    
    if(!selectPlaceResult) { 
        return res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.PLACE_SELECT_FAIL));
    } else {
        const resData  = {
            placeName : "",
            description : "",
            place_thumbnail : "", // INT
            place_like : "",   // INT
            address : "",   // INT
            number : "",
            fee : "",
            businessHour : "",
            location : ""
        };

        resData.placeName = selectPlaceResult[0].pName;
        resData.description = selectPlaceResult[0].pDescription;
        resData.place_thumbnail = selectPlaceResult[0].place_thumbnail;
        resData.place_like = selectPlaceResult[0].place_like;

        const selectDetailQuery = 'SELECT pAddress, pNumber, pFee, pHour FROM place_Detail WHERE placeIdx = ?';
        const selectDetailResult = await db.queryParam_Parse(selectDetailQuery, [inputPlaceIdx]);

        resData.address = selectDetailResult[0].pAddress;
        resData.number = selectDetailResult[0].pNumber;
        resData.fee = selectDetailResult[0].pFee;
        resData.businessHour = selectDetailResult[0].pHour;

        const selectLocationQuery = 'SELECT latitude, longitude FROM location WHERE placeIdx = ?';
        const selectLocationResult = await db.queryParam_Parse(selectLocationQuery, [inputPlaceIdx]);

        resData.location = selectLocationResult[0];

        return res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.PLACE_SELECT_SUCCESS, resData));
    }
});

module.exports = router; 