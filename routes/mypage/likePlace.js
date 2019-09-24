var express = require('express');
var router = express.Router();

const authUtil = require("../../module/utils/authUtils");

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');


router.get('/', authUtil.isLoggedin, async (req, res) => {
    let resAllData = [];
    const likeSelectQuery = "SELECT * FROM place JOIN place_like ON place.placeIdx = place_like.placeIdx WHERE userIdx = ? ORDER BY place.place_like DESC"
    // 좋아요 순으로 픽플레이스 조회
    const likeSelectResult = await db.queryParam_Arr(likeSelectQuery, [req.decoded.userIdx]);   // 토큰 값으로 유저가 좋아요 한 픽플레이스 조회

    if (!likeSelectResult) {
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));    // DB ERROR
    } else { 
        for (let i = 0; i < likeSelectResult.length; i++) {
            const item = {
                info: []
            }
            item.info.push(likeSelectResult[i]);
            resAllData.push(item);
        }
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.LIST_PICK_PLACE, resAllData));  // 픽플레이스 조회 성공
    }
});

module.exports = router;