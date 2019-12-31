const hooks = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=67f8a4a5-4d92-4b14-962c-c6bfa9d5affd';
const request = require('request');
const url = hooks;
 
module.exports = function message(data){
  request({
      url: url,
      method: "POST",
      json: true,
      headers: {
          "content-type": "application/json",
      },
      body: {"msgtype":"text","text":{"content":data}}
  }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body) // 请求成功的处理逻辑
      }
  });
};