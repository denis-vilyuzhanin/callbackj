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
 
var callbackj = require('../js/callbackj');

exports.callbackObject = {
    handlerFunction : {
        indifferentHandler: function(test) {
            test.expect(2);
            var callback = callbackj(function(){
                test.ok(1);
            });
            callback.success(null);
            callback.error(null);
            test.done();
        },
        handleSuccessResult: function(test) {
            test.expect(1);
            var expected = {};
            var callback = callbackj(function(result){
                test.strictEqual(result, expected);
            });
            
            callback.success(expected);
            test.done();
        },
        ignoreErrorWhenOnlyResultIsInterested: function(test) {
            test.expect(0);
            var callback = callbackj(function(result){
                 test.ok(1);
            });
            
            callback.error({});
            test.done();
        },
        handleError: function(test) {
            test.expect(2);
            var expected = {};
            var callback = callbackj(function(error, result){
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
            var callback = callbackj(function(error, result){
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
            var callback = callbackj(function(error, item, index){
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
    
    handlerObject: {
        successHandler: function(test){
            test.expect(1);
            var expectedResult = {};
            var callback = callbackj({
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
            var callback = callbackj({
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
            var callback = callbackj({
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
            var callback = callbackj({
                begin: function() {
                    test.ok(1);                    
                }
            });
            callback.begin();
            test.done();
        },
        endHandler: function(test){
            test.expect(1);
            var callback = callbackj({
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
    
    handlerObject: {
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
        successHandlerWhenResultIsUndefined: function(test) {
            test.expect(1);
            var callback = callbackObjectStub(test, {
                success: function(result) {
                    test.strictEqual(result, undefined);
                }
            });
            
            callback(undefined);
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
    },
    handlerFunction: {
        functionIsInvokedAsIs: function(test) {
            test.expect(4);
            var argsCount;
            var callback = callbackj(function(){
                test.equal(arguments.length, argsCount);
            });
            argsCount = 0;
            callback();
            
            argsCount = 1;
            callback({});
            
            argsCount = 2;
            callback({}, {});
            
            argsCount = 3;
            callback({}, {}, {});
            
            test.done();
        }    
    }
};


function callbackObjectStub(test, callback) {
    function fail() {
        test.fail();
    }
    function find(handler) {
        return handler ? handler : fail
    }
    return callbackj({
        success: find(callback.success),    
        error: find(callback.error),
        each: find(callback.each),
        begin: find(callback.begin),
        end: find(callback.end)
    });
}