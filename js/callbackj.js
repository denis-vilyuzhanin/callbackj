/**
 * The MIT License (MIT)
 *  
 * Copyright (c) 2013 Denys Viliuzhanin <dvilyuzhanin@gmail.com>
 * https://github.com/denis-vilyuzhanin/callbackj
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function empty(){}

function bindHandler(handler) {
    return handler ? handler : empty();
}

function isFunctionA(object) {
    return object && Object.prototype.toString.call(object) == '[object Function]';
}



module.exports = function(handler) {
    function callbackFunctionToHandlerObject(arg0, arg1, arg2) {
        if (arguments.length == 0) {
            handler.success(undefined);
        } else if (arguments.length == 1) {
            if (arg0 instanceof Error) {
                handler.error(arg0);
            } else {
                handler.success(arg0);
            }
        } else if (arguments.length == 2) {
            if (arg0 === undefined) {
                handler.success(arg1);
            } else {
                handler.error(arg0);    
            }
        } else if (arguments.length == 3) {
            handler.each(arg1, arg2);
        }
    };
    function callbackFunctionToHandlerFunction(arg0, arg1, arg2) {
        if (arguments.length == 0) {
            handler();
        } else if (arguments.length == 1) {
            handler(arg0);
        } else if (arguments.length == 2) {
            handler(arg0, arg1);
        } else if (arguments.length == 3) {
            handler(arg0, arg1, arg2);
        }
    }
    
    var callbackObject = isFunctionA(handler) ? callbackFunctionToHandlerFunction : callbackFunctionToHandlerObject;
    callbackObject.success = bindHandler(handler.success);
    callbackObject.error = bindHandler(handler.error);
    callbackObject.begin = bindHandler(handler.begin);
    callbackObject.end = bindHandler(handler.end);
    callbackObject.each = bindHandler(handler.each);
    
    if (isFunctionA(handler)) {
        callbackObject.success = function(result) {
            if (handler.length == 0) {
                handler();
            } else if (handler.length == 1) {
                handler(result);
            } else if (handler.length == 2){
                handler(undefined, result);
            }
        };
        callbackObject.error = function(error) {
            if (handler.length == 0) {
                handler();
            } else if (handler.length == 2) {
                handler(error, undefined);
            } else if (handler.length == 3) {
                handler(error, undefined, undefined);
            }
        };
        callbackObject.each = function(index, item) {
            if (handler.length == 3) {
                handler(undefined, item, index);
            } 
        };
    }
    return callbackObject;
}