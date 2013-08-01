CallbackJ Programming Guide
==================

# CallbackJ Goals

Compatibility of different parts in project are always tedious work. Because adding one required argument into function requres add passing values in all
places where this function is invoked.
**Callback function** technique are widly used in JavaScript project and require supporing contract between called function and **callback function** passed thought arguments.
Making this contract flexible produce verbose code like this:

```js
function doSomething(callback) {
    //do something
    if (typeof(callback) == 'function') {
        callback("OK");
    } else if (callback.success) {
        callback.success("OK");
    }
}
```

**CallbackJ** solves this problems. You use that way of invoking **callback function** you want and **CallbackJ** will make all transformations depends on type of received **callback function** object.

So **CallbackJ** makes decopling codes. Adding new attributes for passing **callback function** isn't a problem. You don't need to add this attribute in all places, where this functin is called, to avoid exception.
**CallbackJ** also specify the rules for defining **callback function** and notifing about some events which could happened in called code. Like failed or successful execution.
The rules isn't comprehensive but covers the most frequent cases.

## Definitions

Before we starts let's define some useful things:

1. **callback function**. The function which passed to called function through it's arguments for 
later invocation in appropriate moment.

```js
setTimeout(function(){
    // here is a body of callback function. It will invoked after 500ms
}, 500)
```

1. **callback** - the moment when callee invokes passed through parameters **callback function**.

```js
function doSomething(func) {
    func(); // this is callback.
}
```

1. **callback object**. In Javascript you can find two ways of passing **callback functions**.
First is passing a normal function.

```js
doSomething(function(){/*my callback code*/});
```
Second is passing an object with **callback functions** was stored in its attributes with specified names.

```js
doSomething({
    success: function(){/*success code*/},
    error: function(){/*error code*/}
});
```
First is more compact but second is more suitable when you have more than one possible **callback**.
So let's call **callback object** a **callback function** or object with stored **callback functions**.

1. **caller**. The code or function which invokes other function.

1. **callee**. The code of function which was invoked by other code or function. In other words: **caller** invokes **callee**.


## Callback Broker 

**CallbackJ** provides a special wrapper which is called  **callback broker** or **broker**.
To obtain **callback broker** just wraps received **callback object** like this

```js
function doSomething(callback) {
    callback = callbackj(callback); // override received callback object with broker
}
```

**Broker** is a proxy which could be considered as object with **callback functions** stored in its attributes or could be considered as **callback function**.
It interprites any invokation as occured event. Firstly it recognizes event type, based on specified rules and secondly it 
identifies whether this event is interested to **callback object**
**Broker** is a proxy which could be notified about event via one of interface and
than it determins whether this event is interested by wrapped **callback object**.
If **callback object** isn't interested in event, **broker** will provide empty implementation to avoid exception.

```js
function doSomething(callback) {
    callback = callbackj(callback);
    callback.success();
}

doSomthing({}); // we would have had an exception if we hadn't used callbackJ
```

In above example we would have exception in last line, because ```success`` attribute isn't defined.
But **broker** has solved this.

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

In contradistinction to functions it is very easy explores object interest. If object has attribute with name of one of events then it is interested in this event.
This attribute must contains **callback function**. Here are example with handlers for all events.

```js
{
    success: function(result){ ... },
    error: function(error){ ... },
    each: function(item, index){ ... },
    begin: function(){ ... },
    end: function(){ ... }
}
```
Remember you don't need define all handlers in your **callback object** only that you need.

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
