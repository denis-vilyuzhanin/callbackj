var callbackj = require('../js/callbackj.js');

/**
 * Run count down timer.
 * delay - the initial time in seconds.
 * callback - CallbackJ(
 *                  error - when something goes wrong
 *                  each - on each timer tick. Invoked per each seconds
 *                  success - when timer is done)
 */
function countDown(delay, callback) {
    callback = callbackj(callback);
    var index = 0;
    try {
        var timer = setInterval(function() {
            callback.each(delay - index, index++);
            if(delay - index <= 0) {
                clearInterval(timer);
                callback.success();
            }
        }, 1000);
    } catch(e) {
        callback.error(e);
    }
}


countDown(5, {
    success: function() {
        console.log("done");
    },
    each: function(remaining, index) {
        console.log("Tick ", index, ": ", remaining);
    },
    error: function(error) {
        console.log("[ERROR]", error);
    }
});