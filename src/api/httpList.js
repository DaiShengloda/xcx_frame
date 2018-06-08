// 接口
import { wxRequest } from './wxHttp';
import tool from './motheds';

const apiUrl = ['http://short.lzyunying.com','https://mini.gp58.com','http://yg.vipgz1.idcfengye.com'];
const apiMall = apiUrl[tool.params.env];

/**
 * 获取发现好商品接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */


//获取老师接口
const indexTeacher = params =>
    wxRequest(params, apiMall + '/front/source/author');
//今日解盘
const todaying = params => 
    wxRequest(params, apiMall + '/front/source/today/');
// banner
const bannerAjax = params =>
wxRequest(params, apiMall + '/front/source/banner');
module.exports = {
    indexTeacher,
    todaying,
    bannerAjax
};