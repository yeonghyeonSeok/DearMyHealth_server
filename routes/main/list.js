const express = require('express');
const router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')
const db = require('../../module/pool');

// 코스 타입별 전체 조회
router.get('/:type', async (req, res) => {
    const type = Number(req.params.type);

    switch(type){
        case 0: // 오래 가게 코스
            const resLongData = [];
            const LongSelectQuery = 'SELECT * FROM course WHERE cType = ? ORDER BY cLikeCount DESC';
            const LongSelectResult = await db.queryParam_Arr(LongSelectQuery, [0])
    
            if(!LongSelectResult){
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
            } else {
                if(LongSelectResult[0] != null){
                    for(let i = 0; i < LongSelectResult.length; i++){
                        let item = {
                        info: []
                        }
                        item.info.push(LongSelectResult[i]);
                        resLongData.push(item);
                    }
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_LONG, resLongData));    // 오래가게 코스 조회 성공
                } else {
                    res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_COURSE));     // 존재하지 않는 코스입니다
                    }
                }
    break;
        case 1: // 한국 전통 코스
            const resKoreaData = [];
            const KoreaSelectQuery = 'SELECT * FROM course WHERE cType = ? ORDER BY cLikeCount DESC';
            const KoreaSelectResult = await db.queryParam_Arr(KoreaSelectQuery, [1])

            if(!KoreaSelectResult){
                res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
            } else {
                if(KoreaSelectResult[0] != null){
                    for(let i = 0; i < KoreaSelectResult.length; i++){
                        let item = {
                        info: []
                        }
                        item.info.push(KoreaSelectResult[i]);
                        resKoreaData.push(item);
                    }
                    res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_KOREA, resKoreaData));    // 한국전통 코스 조회 성공
                } else {
                    res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_COURSE));     // 존재하지 않는 코스입니다
                    }
                }
    break;
        case 2: // 사용자 코스
            const resUserData = [];
            const UserSelectQuery = 'SELECT * FROM course WHERE cType = ? ORDER BY cLikeCount DESC';
            const UserSelectResult = await db.queryParam_Arr(UserSelectQuery, [2])

    if(!UserSelectResult){
        res.status(200).send(defaultRes.successFalse(statusCode.DB_ERROR, resMessage.DB_ERROR));     // DB 오류
    } else {
        if(UserSelectResult[0] != null){
            for(let i = 0; i < UserSelectResult.length; i++){
                let item = {
                info: []
                }
                item.info.push(UserSelectResult[i]);
                resUserData.push(item);
            }
            res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_USER, resUserData));    // 사용자 코스 조회 성공
        } else {
            res.status(200).send(defaultRes.successFalse(statusCode.OK, resMessage.NOT_EXIST_COURSE));     // 존재하지 않는 코스입니다
            }
        }
            break;

    default:
        res.status(200).send(defaultRes.successTrue(statusCode.OK, "옳바르지 않은 값"));
        return;
    }
});

module.exports = router; 