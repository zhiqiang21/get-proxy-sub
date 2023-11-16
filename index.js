#!/usr/bin/env node
const { default: axios } = require('axios');
const { Buffer } = require('node:buffer');
const process = require("child_process");
// 解析的链接
const SUB_HTTP_URL = '';
const REG_VEMSS = /(?<=vmess:\/\/).*/g;
// ip检测的key
const IP_TEST_KEY = '';
const IP_TEST_URL = 'http://apis.juhe.cn/ip/ipNewV3';

requestSubStr();

function requestSubStr(str) {
  axios.get(SUB_HTTP_URL).then(resp => {
    const decodeStr = decodeBase64(resp.data);
    const matList = decodeStr.match(REG_VEMSS).map(item => JSON.parse(decodeBase64(item)).add);
    const promiseList = [];

    matList.forEach(item => {
      promiseList.push(ipTest(item));
    });

    Promise.all(promiseList).then(resp => {

      
      const ipIndex = resp.findIndex(item => item.data.result.Country === '日本')
      const execStr = `sh ${__dirname}/upV2ray.sh ${matList[ipIndex]}`;
      process.exec(execStr, (error, stdout, stderr) => {
        if(!error) {
          console.log('执行成功');
        } else {
          throw new Error(error)
        }
      })
    })


  }).catch(error => {
    console.log(error)
  })
}

function decodeBase64(input) {
  const buff = Buffer.from(input, 'base64');
  return buff.toString('utf-8');
}


function ipTest (ip) {
  return  axios.get(IP_TEST_URL, {
    params: {
      ip,
      key: IP_TEST_KEY
    }
  });
}