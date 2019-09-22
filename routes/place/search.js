const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
장소 검색
METHOD       : GET
URL          : /place/search?placeName=
PARAMETER    : placeName = 장소 이름
*/

router.get('/', async(req, res, next) => {

    const keyword = req.query.placeName;
    console.log(keyword);

    const searchPlaceQuery = 'SELECT * FROM place WHERE pName LIKE "%'+keyword+'%"';
    const searchPlaceResult = await db.queryParam_None(searchPlaceQuery);

    console.log(searchPlaceResult);
    console.log(searchPlaceResult.length);

    if(searchPlaceResult[0] == null) {
        return res.status(200).send(defaultRes.successFalse(statusCode.OK, "일치하는 장소 없음")); 
    } else {
        const resData = new Array();
        for(i = 0; i < searchPlaceResult.length; i++) {
            const inputPlaceIdx = searchPlaceResult[i].placeIdx;
            resData[i]  = {
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
    
            resData[i].placeName = searchPlaceResult[i].pName;
            resData[i].description = searchPlaceResult[i].pDescription;
            resData[i].place_thumbnail = searchPlaceResult[i].place_thumbnail;
            resData[i].place_like = searchPlaceResult[i].place_like;
    
            const selectDetailQuery = 'SELECT pAddress, pNumber, pFee, pHour FROM place_detail WHERE placeIdx = ?';
            const selectDetailResult = await db.queryParam_Parse(selectDetailQuery, [inputPlaceIdx]);
            
            resData[i].address = selectDetailResult[0].pAddress;
            resData[i].number = selectDetailResult[0].pNumber;
            resData[i].fee = selectDetailResult[0].pFee;
            resData[i].businessHour = selectDetailResult[0].pHour;
    
            const selectLocationQuery = 'SELECT latitude, longitude FROM location WHERE placeIdx = ?';
            const selectLocationResult = await db.queryParam_Parse(selectLocationQuery, [inputPlaceIdx]);
    
            resData[i].location = selectLocationResult[0];
        }

        return res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.PLACE_SEARCH_SUCCESS, resData));
    }
});

module.exports = router; 