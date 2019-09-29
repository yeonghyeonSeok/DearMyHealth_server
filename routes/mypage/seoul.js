var express = require('express');
var request = require('request');
var router = express.Router();

const defaultRes = require('../../module/utils/utils');
const statusCode = require('../../module/utils/statusCode');
const resMessage = require('../../module/utils/responseMessage')

// 서울시 소식 조회
router.get('/', (req, res) => {
    const startNum = Math.floor(Math.random() * 300) + 1;   // random
    const endNum = startNum + 6;
    //var infoData;
    //var noticeArray;


    const url = 'http://openapi.seoul.go.kr:8088/765071496c7769683836505279484e/json/culturalEventInfo/'+startNum+'/'+endNum+'';
    console.log(url);

    var noticeArray = new Array();
    var data = request.getParameter("TITLE");
    console.log(data);
        request(url, function(err, res, body){
        var obj = JSON.parse(body);

        for(i = 0; i<6; i++) {
        infoData = {
                title : "",
                link : "",
                image : ""
            }
            console.log(i);
            infoData.title = obj.culturalEventInfo.row[i].TITLE;
            infoData.link = obj.culturalEventInfo.row[i].ORG_LINK;
            infoData.image = obj.culturalEventInfo.row[i].MAIN_IMG;
            noticeArray.push(infoData);
            //console.log(infoData);
        }
        console.log(noticeArray);
        //console.log(infoData);
        res.status(200).send(defaultRes.successTrue(statusCode.OK, resMessage.SUCCESS_LIST_NOTICE, noticeArray));  // 서울시 문화행사 조회 성공

        console.log(infoData);

    // console.log(noticeArray);

});
});

module.exports = router;