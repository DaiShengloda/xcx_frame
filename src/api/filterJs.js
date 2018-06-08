// 字符串截取
var subString = function(value, length) {
    if (!value) {
        return '';
    }
    value = value.trim();
    if (value.length > length) {
        var first = value.toString().substring(0, length);
        value = first + '...';
    }
    return value;
};
// 数字处理
var numberFormat = function(value) {
    value = parseInt(value);
    if (isNaN(value)) {
        return 0;
    }

    if (value >= 10000) {
        value = value + '';
        var len = value.length;
        value = value.slice(0, len - 3);
        return parseFloat(value / 10) + '万';
    } else {
        return value;
    }
};

// 日期字数控制
var timeNum = function(content, num) {
    var begins = 0;
    if (!content) return;
    if (num < content.length) return content;
    return content.slice(0, num);
};
var subStringTime = function(content, num, begin) {
    var begins = 0;
    if (!content) return;
    if (begin) {
        begins = begin;
    }
    return content.slice(begins, num);
};
var formatTime = function(date) {
    // var year = date.getFullYear()
    // var month = date.getMonth() + 1
    // var day = date.getDate()
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return (
        [year, month, day].map(formatNumber).join('/') +
        '' + [hour, minute, second].map(formatNumber).join(':')
    );
};
module.exports = {
    subString: subString,
    numberFormat: numberFormat,
    timeNum: timeNum,
    formatTime: formatTime,
    subStringTime: subStringTime
};