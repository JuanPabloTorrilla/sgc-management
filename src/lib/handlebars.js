const Handlebars = require('express-handlebars')
const { format } = require('timeago.js');

const helpers = {};

helpers.timeago = (timestamp) => {
    return format(timestamp);
}

helpers.math = function(lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator]
}

helpers.ifValue = function(arg1,arg2){
    if(arg1 == arg2){
        return true
    };
};

helpers.length = function(array){
    return array.length;
};


module.exports = helpers;