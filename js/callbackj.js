
function Callback(handler) {
    if (!isFunctionA(this)) {
        
        Callback.call( _this, handler);
        return _this;
    }
    this.success = bindHandler(handler.success);
    this.error = bindHandler(handler.error);
    this.begin = bindHandler(handler.begin);
    this.end = bindHandler(handler.end);
    this.each = bindHandler(handler.each);
    
    if (isFunctionA(handler)) {
        this._success = function(result) {
            if (handler.length == 0) {
                handler();
            } else if (handler.length == 1) {
                handler(result);
            } else if (handler.length == 2){
                handler(undefined, result);
            }
        };
        this._error = function(error) {
            if (handler.length == 0) {
                handler();
            } else if (handler.length == 2) {
                handler(error, undefined);
            } else if (handler.length == 3) {
                handler(error, undefined, undefined);
            }
        };
        this._each = function(index, item) {
            if (handler.length == 3) {
                handler(undefined, item, index);
            } 
        };
    }
    
}
    


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