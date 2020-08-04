var randtoken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretOrPrivateKey = "DearMyHealthKey";
const options = {
    algorithm: "HS256",
    expiresIn: "14d",
    issuer: "hyeon"
};
// 이건 랜덤 하게 나오는 옵션 
const refreshOptions = {
    algorithm: "HS256",
    expiresIn: "28d",
    issuer: "hyeon"
};
// 랜덤하게 나오는게 아니라 jwt signin으로 만들때
module.exports = {
    sign: (user) => {
        const payload = {
            userIdx: user.userIdx,
            email: user.email,
            nickname: user.nickname,
        };

        const result = {
            token: jwt.sign(payload, secretOrPrivateKey, options),
            refreshToken: randtoken.uid(256)
        };
        //refreshToken을 만들 때에도 다른 키를 쓰는게 좋다.

        return result;
    },
    verify: (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretOrPrivateKey);
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return -3;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                return -2;
            } else {
                console.log("invalid token");
                return -2;
            }
        }
        console.log("decoded: ", decoded);
        return decoded;
    },
    refresh: (user) => {
        const payload = {
            userIdx: user.userIdx,
            email: user.email,
            nickname: user.nickname,
        };

        return jwt.sign(payload, secretOrPrivateKey, options);
    }
};