

function Callback(handler) {
    this._success = find(handler, 'success');
    this._error = find(handler, 'error');
    this._begin = find(handler, 'begin');
    this._end = find(handler, 'end');
    this._each = find(handler, 'each');
    
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
            } else if (handler.length == 1) {
                handler(error);
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
    

Callback.prototype.success = function(result) {
    this._success.call(undefined, result);
}
Callback.prototype.error = function(error) {
    this._error.call(undefined, error);    
}
Callback.prototype.begin = function() {
    this._begin.call(undefined);
}
Callback.prototype.end = function() {
    this._end.call(undefined);
}
Callback.prototype.each = function(value, index) {
    this._each.call(undefined, value, index);
}

function empty(){}

function find(object, key) {
    var value = (object === undefined) ? undefined : object[key];
    if (value && isFunctionA(value)) {
        return value;
    }
    return empty;
}

function isFunctionA(object) {
    return object && Object.prototype.toString.call(object) == '[object Function]';
}



module.exports = function(obj) {
    return new Callback(obj);
}