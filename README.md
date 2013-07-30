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
1. If ```callback``` argument are object then all attributes are optional. 
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

Download ```callbackj.js``` from (GitHub)[https://github.com/denis-vilyuzhanin/callbackj]
or by any appropriate way described in section about specific platform
* Node JS
* Browser

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
## Node JS

Import ```callbackj``` module

```js
var callbackj = require('callbackj');
```

Or if you doen't install it as module you can import it by path

```js
var callbackj = require('./lib/callbackj'); // where ./lib/callbackj is path to callbackj.js file.
```

## Browser

Just add script into your web page.

```html
    <script src="callbackj.js"></script>
```

And use global ```callbackj``` global object.

# Detailed look at CallbackJ

Before we starts let's define some useful things:
1. **callback function**. The function which passed to called function through it's arguments for 
later invocation in appropriate moment.

1. **callback call** - the moment when callee invokes passed through parameters **callback function**.

1. **callback object**. In Javascript you can find two ways of passing **callback functions**.
First is passing a normal function.

```js
doSomething(function(){/*my callback code*/});
```
Second is passing an object with **callback functions** was stored in its attributes with specified names.

```js
doSomethign({
    success: function(){/*success code*/},
    error: function(){/*error code*/}
});
```
First is more compact but second is more sutable when you have more than one possible **callback call**.
So let's call **callback object** of any type: function or object with stored functions.

## Description 

**CallbackJ** provides a special wrapper which is called  **callback broker** or **broker**.
**Broker** is a proxy which could be notified about event via one of interface and
than it determins whether this event is interested by wrapped **callback function**.
So one of the main goal of **CallbackJ** is proving flexibility. If **caller** don't want
define **callback object**  **broker** will take care about it and provide empty implementation.
So **called** never failed because **callback object** doesn't contain something.

##Events

**Callback object** is used for notifing **caller** about something that happened withing **callee** execution.
So this call could be considered as event.

**CallbackJ** recognise fix set of events. Event doesn't present in framework as object.
This entities are used for describing behaviour of **broker**. 

1. **success event**: This event notifies about successfuly completed work. May have **result object**. **Result object** could be any type or ```undefined``` or ```null```.
1. **error event**: This event notifies that something goes wrong. Event must contains **error object**. It must explain what was wrong. **Error object** could be any type except `undefined``` or ```null```.
1. **each event**: This event notifies about partial result or completed steps. The meaning depends on implementation. 
It could be received part of data or one produced object. Event must have **index** value and may have **item object**. **index** is positive sequalsial number starts from 0. 
**item object** may be any type or ```undefined``` or ```null```.
1. **begin event**: This event notifies that work begins. No extra information are provided.
1. **end event**: This event notifies that work done.

## Notification
Here is a possible options to notify CallbackJ about some event. 
**Broker** has two types of notification: use methods or call it as function.
It is developer chose what type to use. Methods are more obvious but function calling 
was provides for using in legacy code when it is compatible with **broker** interface
which is described below.

* **success event**.
```result``` is any value which contains result.

```js
    // methods
    callback.success(); // when you don't have result
    callback.success(undefined); // when you don't have result
    callback.success(result); // when you have result
    
    //call as function
    callback(); // when you don't have result
    callback(undefined); // when you don't have result
    callback(result); // when you have result
    callback(undefiend, result); // when you have result
```
* **error event**.
```error``` is any value exept ```undefined``` and ```null``` which explains error.

```js
    //methods
    callback.error(error); //when something goes wrong
    
    //call as function
    callback(error, undefined); //when something goes wrong
```

* **each event**.
```item``` any value which contains partial result.
```index``` index of item or partial result.

```js
    //methods
    callback.each(undefined, index); //when you don't have item object
    callback.each(item, index); //when you have item object
    
    //call as function
    callback(undefined, undefined, index); //when you don't have item object
    callback(undefined, item, index); //when you have item object
```
* **begin event**.

```js
    //methods
    callback.begin(); //when work have been started
```
* **end event**.

```js
    //methods
    callback.end(); // when work bave been completed
```

##Event handling

When **CallbackJ** identify the event it must identify whether this event is interested for wrapped **callback object**.
**callback object** could be a function or an object. So **CallbackJ** has two groups of rules. One for function and one for object.
The process of determining what events function or object could handle is called **function/object interest exploring**

###Function Interest Exploring

Function interest depends on defined number of arguments. 

1. No Arguments. Handle success and error events. There is no way to identify the event. 
But this handler must be used only when you doesn't care about concrete type and result. 
Use it when  you just need to know that work was completed for some reasons.

```js
function(){...}
```

1. One argument. Handle success event. **Result object** is passed throught argument but it could be ```null``` or ```undefined```.

```js
function(result){...}
```

1. Two arguments. Handle success and error events. **error object** is passed throught first parameter and 
**result object** is passed throught second.
If **error object** (first parameter) is ```undefined``` then handler must considering call as success event handling.
But **result object** also could be **undefined**.

```js
 function(error, result){...}
 ```
 
 1. Three arguments. Handle each, success and error events. **error object** 
 
  
 ```js
 /**
  * Handle each, success and error events. If error isn't undefined then handle must considering call as error event handling
  * otherwise it must check index. If index is undefined than this call must be considering as success event handling otherwise 
  * it is each event handling.
  */
 function(error, item, index) {...}
```

###Object Interest Exploring

##Rules about event occuring.
Here it is convention specifies in which order events can occure.

1. **begin event**: if event can be raised it could be raised only before all other events and only once. 
1. **each event**: if event can be raised it could be raised any times but only before **success event** or **error event**. Each time **index** must be incremented.
1. **error event**: if event could be raised it could be raised when something goes wrong but only before **end event**.
1. **success event**: if event could be raised it could be raised when all work completes successfuly but only before **end event**
1. **error event** and **success event** are mutually exclusive.
1. **end event**: if events can be raised it raises after all other events and only once.
1. if event wasn't aised at appropriate time it could not be raised within current work. It means that **each event** was raised
**begin event** can't be raised anymore.


```
[step 1] raise begin
[step 2] receive data into buffer
[step 3] raise each event. Pass received data as item object
[step 4] continue? goto [step 2]
[step]
```


#Sample 1
You have ```selectAll``` function which uses CallbackJ and you are going to use it.
Let's imagine that ```selectAll``` function retrieve some objects by input parameter.
And you found following description in documentation about ```selectAll``` function.

```js
/**
 * selector - regex which specify strings must be selected
 * callbackJ - CallbackJ(each,success,error)
 */
function selectAll(selector, callbackJ)

```
What does ```CallbackJ(each,success,error)``` message mean?
It means that function match CallbackJ convention and you could receive each select object one by one, 
and you could receive success notification after all object is selected and you
could receive error if something goes wrong.
So this givies you following options to invoke ```selectAll``` function.

* If you don't care of result and error and you just want to know that it was done.

```js

selectAll(/foo/, function(){
    // this code will be invoked if all objects are selected or error is raised.
});
```
* If you are interested in result but I don't care about errors

```js

selectAll(/foo/, function(result){
    // result will contains the result of execution. 
    //In our case it is an array of selected objects
});
```
* If you are interested in result and error

```js

selectAll(/foo/, function(error, result){
    // result will contains the result of execution  
    // error contains value if something goes wrong
    // So I need handle such case like following
    if (error) {/*handle error here*/}
});
```

* Or You want to have different functions for error and success handling

```js

selectAll(/foo/, {
    success: function(result){/* handle success*/},
    error: function(error){/*handle error*/}
});
```
To understand all options of creating callbacks please look at CallbackJ convention.

You could think that ```selectAll``` must be complicated to handle such amount of
possible callback functions implementaion. But you are wrong.
Please look at following code.
```js
function selectAll(selector, callback) {
    callback = callbackj(callback);
    try {
        for(var i = 0; i < STRINGS.length; i++) {
            if (STRINGS[i].match(selector)) 
                callback.each(STRINGS[i], i); // but it could be callback(undefined, STRINGS[i], i);
        }    
        callback.success(); // but it could be callback();
    } catch(e) {
        callback.error(e); // but it could be callback(e, undefined);
    }
}
```
You see that implentation is clear. You just need wrap received callback.
The caller could use any option to implement callback function. It only must match 
CallbackJ convention. In comments in above code you can see the options of how
callback could be invoked. 
So CallbackJ provide flexibility for both caller and callee and they haven't to 
agreed a contract. They use that format they want. 


#How does it work?

**CallbackJ** is a wrapper for callback functions. Why do you need wrap callback function?
Because **CallbackJ** support a lot of option to define callback function and 
a lot of options to 


##Callback function definition



