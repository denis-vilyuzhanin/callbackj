
var callbacks = require('../js/callbackj');

exports.callbackObject = {
    callbackFunction : {
        indifferentHandler: function(test) {
            test.expect(2);
            var callback = callbacks(function(){
                test.ok(1);
            });
            callback.success(null);
            callback.error(null);
            test.done();
        },
        handleSuccessResult: function(test) {
            test.expect(1);
            var expected = {};
            var callback = callbacks(function(result){
                test.strictEqual(result, expected);
            });
            
            callback.success(expected);
            test.done();
        },
        ignoreErrorWhenOnlyResultIsInterested: function(test) {
            test.expect(0);
            var callback = callbacks(function(result){
                 test.ok(1);
            });
            
            callback.error({});
            test.done();
        },
        handleError: function(test) {
            test.expect(2);
            var expected = {};
            var callback = callbacks(function(error, result){
                test.strictEqual(error, expected);
                test.strictEqual(result, undefined);
            });
            
            callback.error(expected);
            test.done();
        },
        handleResultAndError: function(test) {
            test.expect(2);
            var expectedResult = {};
            var expectedError = {};
            var callback = callbacks(function(error, result){
                if (error === undefined) {
                    test.strictEqual(result, expectedResult);
                }
                if (result === undefined) {
                    test.strictEqual(error, expectedError);
                }
            });
            
            callback.success(expectedResult);
            callback.error(expectedError);
            
            test.done();
        },
        
        handleEachItemAndError: function(test) {
            test.expect(3);
            var expectedIndex = 100;
            var expectedItem = {};
            var expectedError = {};
            var callback = callbacks(function(error, item, index){
                if (error === undefined) {
                    test.strictEqual(item, expectedItem);
                    test.strictEqual(index, expectedIndex);
                } 
                if (item === undefined && index === undefined) {
                    test.strictEqual(error, expectedError);
                }
            });
            callback.each(expectedIndex, expectedItem);
            callback.error(expectedError);
            test.done();
        }
    },
    
    callbackObject: {
        successHandler: function(test){
            test.expect(1);
            var expectedResult = {};
            var callback = callbacks({
                success: function(result) {
                    test.strictEqual(result, expectedResult);
                }
            });
            callback.success(expectedResult)            
            test.done();
        },
        errorHandler: function(test){
            test.expect(1);
            var expectedError = {};
            var callback = callbacks({
                error: function(error) {
                    test.strictEqual(error, expectedError);
                }
            });
            callback.error(expectedError)            
            test.done();
        },
        eachHandler: function(test){
            test.expect(2);
            var expectedItem = {};
            var expectedIndex = 100;
            var callback = callbacks({
                each: function(item, index) {
                    test.strictEqual(item, expectedItem);
                    test.strictEqual(index,expectedIndex);
                }
            });
            callback.each(expectedItem, expectedIndex);
            test.done();
        },
        beginHandler: function(test){
            test.expect(1);
            var callback = callbacks({
                begin: function() {
                    test.ok(1);                    
                }
            });
            callback.begin();
            test.done();
        },
        endHandler: function(test){
            test.expect(1);
            var callback = callbacks({
                end: function() {
                    test.ok(1);                    
                }
            });
            callback.end();
            test.done();
        }
    }
};


exports.callbackFunction = {
    
    callbackObject: {
        indifferentCompleteHandler: function(test) {
            test.expect(1);
            var callback = callbackObjectStub(test, {
                success: function(result) {
                    test.ok(1);
                }
            });
            
            callback();
            test.done();
        },
        successHandler: function(test) {
            test.expect(1);
            var expectedResult = {};
            var callback = callbackObjectStub(test, {
                success: function(result) {
                    test.strictEqual(result, expectedResult);
                }
            });
            
            callback(expectedResult);
            test.done();
        },
        errorHandler: function(test) {
            test.expect(1);
            var expectedError = new Error("expected error");
            var callback = callbackObjectStub(test, {
                error: function(error) {
                    test.strictEqual(error, expectedError);
                }
            });
            
            callback(expectedError);
            test.done();
        },
        successAndErrorHandler: function(test) {
            test.expect(2);
            var expectedResult = {};
            var expectedError = {};
            var callback = callbackObjectStub(test, {
                success: function(result) {
                    test.strictEqual(result, expectedResult);
                },
                error: function(error) {
                    test.strictEqual(error, expectedError);
                }
            });
            callback(undefined, expectedResult);
            callback(expectedError, undefined);
            test.done();
        },
        eachHandler: function(test) {
            test.expect(2);
            var expectedItem = {};
            var expectedIndex = 100;
            var callback = callbackObjectStub(test, {
                each: function(item, index) {
                    test.strictEqual(item, expectedItem);
                    test.strictEqual(index, expectedIndex);
                }
            });
            callback(undefined, expectedItem, expectedIndex);
            test.done();
        },
    }
};


function callbackObjectStub(test, callback) {
    function fail() {
        test.fail();
    }
    function find(handler) {
        return handler ? handler : fail
    }
    return callbacks({
        success: find(callback.success),    
        error: find(callback.error),
        each: find(callback.each),
        begin: find(callback.begin),
        end: find(callback.end)
    });
}