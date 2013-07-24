
var callbacks = require('../js/callbackj');

exports.callbackFunction = {
    omnivorouSuccessHandler: function(test) {
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
};