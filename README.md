callbackj
=========

There are nothing more widely used in JavaScript world than callback function. 
Very popular frameworks are built on it. 
It is also used in non-blocking programming. 
Especially in CommonJs libraries. 
It is used in almost every function. 
There are a lot in your javascript project too.

CallbackJ provides ready to use solution and approaches for creating callback function in your project. 
It was designed for easy integration into your code. And in some cases you can write new code with CallbackJ 
without modifying existing (if existing code matches CallbackJ conventions).

# A Brief Look

Let's imagen that you need to implement count down timer. 
This is how it looks like with **CallbackJ**
```js
/**
 * Run count down timer.
 * delay - the initial time in seconds.
 * callback - CallbackJ {
 *                  error - when something goes wrong
 *                  each - on each timer tick. Invoked per each seconds
 *                  success - when timer is done}
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
```
It looks like clear execpt first line ```calback = callbackj(callback)```.
This line wraps received callback function in **CallbackJ warpper object**.
Why do I need this? You could ask.
This provides following abilities:

1. ```callback``` are optional. It could be ```undefined``` or ```null```. This doesn't broke ```countDown``` function
1. ```callback``` argument can be a function or an object.
1. If ```callback``` argument are object then ```success```, ```each``` and ```error``` attributes are optional. 
You can skip it if you are not interested in errors when you invokes ```countDown``` function.

Here are example of using ```countDown```.
You can pass an object with interested for you **callback functions**
```js
countDown(5, {
    each: function(item, index){console.log(item)}, 
    success: function(){console.log("DONE")}
});
```
or you can define annonymous function to receive only **success** notifications

```js
countDown(5, function(result){
    console.log("DONE");
});
```
or maybe  **success** and **error** 

```js
countDown(5, function(error, result){
    if (error) {
        console.log("ERROR: ", error);
    } else {
        console.log("DONE");    
    }
});
```
You see that **CallbackJ** provide different interfaces and take cares about 
compatibility between code which define **callback functions** and code which invokes them.
You need to define only that you are interested in.

#Get started


## Download

Download [callbackj.js](https://github.com/denis-vilyuzhanin/callbackj/js/callbackj.js) from [CallbackJ GitHub repository](https://github.com/denis-vilyuzhanin/callbackj)
or by any appropriate way described in section about specific platform.

## Browser

To use it in web browser you need add ```callback.js``` script into you web page

```html
    <script src="callbackj.js"></script>
```

## NodeJS

Import ```callbackj.js``` file into your project

```js
var callback = callbackj('./callbackj'); // path could be different in your case
```

## Usage

To use **CallbackJ** just wrap any **callback function** or object with **callback functions**

```js
callback = callbackj(callback);
```
After that you can use standard notification without any worries that **callback function** is ```undefined```.

```js
callback.success({
    message: 'Hello'
})
```
Or you can use **function** interface to notify about something.

```js
try {
    // do something
    callback(undefined, result);
} catch(e) {
    callback(e, undefined);
}
```

for more detailes about usage and features of **CallbackJ** see [Detailed look at CallbackJ](#detailed-look-at-callbackj)


