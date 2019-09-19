const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

/*
장소 정보 조회
METHOD       : GET
URL          : /place/:placeIdx
PARAMETER    : placeIdx = place의 인덱스
*/

router.get('/', async(req, res, next) => {
    //결과값에 보여줘야 하는 것 : 장소 정보(place테이블), 장소 세부사항(place_Detail), 장소 위치(location)

    const inputPlaceIdx = req.query.placeIdx;
    const selectPlaceQuery = 'SELECT * FROM place WHERE placeIdx = ?';
    const selectPlaceResult = await db.queryParam_Parse(selectPlaceQuery, inputPlaceIdx);
    
    if(!selectPlaceResult) { 
        return res.status(200).send(responseUtil.successFalse(returnCode.OK, PLACE_SELECT_FAIL));
    } else {
        let result = new Array();
        
        result.push({selectPlaceResult});

        const selectDetailQuery = 'SELECT pAddress, pNumber, pFee, pHour FROM place_Detail WHERE placeIdx = ?';
        const selectDetailResult = await db.queryParam_Parse(selectDetailQuery, inputPlaceIdx);

        result.push({
            "place_Detail" : selectDetailResult
        });

        const selectLocationQuery = 'SELECT latitude, longitude FROM location WHERE placeIdx = ?';
        const selectLocationResult = await db.queryParam_Parse(selectLocationQuery, inputPlaceIdx);

        result.push({
            "location" : selectLocationResult
        });

        return res.status(200).send(responseUtil.successTrue(returnCode.OK, PLACE_SELECT_SUCCESS, result));
    }
});

module.exports = router; 