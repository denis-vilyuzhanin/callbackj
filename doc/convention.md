CallbackJ convention
=======

#Introduction

#Goals

#Reffering to this convention

```js
/**
 * callback - CallbackJ(each, error, success)
 */
 function doSomething(callback);
```

```js
/**
 * callback - CallbackJ(function: each, error, success)
 */
 function doSomething(callback);
```

```js
/**
 * callback - CallbackJ(object: each, error, success)
 */
 function doSomething(callback);
```

Future versions
```js
/**
 * callback - CallbackJ2(function: each, error, success)
 */
 function doSomething(callback);
```
#Definitions

1. **callback function** is used in meaning which described on [wikipedia.org](http://en.wikipedia.org/wiki/Callback_(computer_programming))
Here is extract. 
_In computer programming, a callback is a piece of executable code that is passed as an argument to other code, which is expected to call back (execute) the argument at some convenient time. The invocation may be immediate as in a synchronous callback or it might happen at later time, as in an asynchronous callback._
For JavaScript callback function could looks like following:

```js
doSomething(function(){
    //callback function defined as annonymous function
});
```
All code samples use annonymous function but this is just for simplicity. It doesn't mean that you
can't use normal functions like shown in next sample.

```js
function callback(){
    //callback function defined as named function
}
doSomething(callback);
```

1. **callback object** is an object which contains callback functions as attributes.

```js
doSomething({
    callback1: function(){/*body of first callback function*/},
    callback2: function(){/*body of second callback function*/};
});
```

1. **caller** is the piece of code or function which invoke other function and pass **callback function** or **callback obejct** 
as an argument

1. **callee** is the function which perfomrs some work.
It is invoked by caller with specified **callback function** or **callback object** which expected to be invoked
at some convenient time for delivering results of done work.

1. **callback broker** or **broker** is a framework which serves communication and interaction between **callee** and **caller**

1. **result object** or **result**
2. **item object** or **item**
3. **item index** or *index*
4. *error object* or **error**

1. **event**

1. **notification**

1. **event handler**


#CallbackJ Interaction Model

Explained model in this section is abstract and isn't required to be implemented
preciesly as described here. Also model define entities, relationship and processes 
but they are optional for implementation and used only for explanation 
interaction rules and behaviour.

**CallbackJ Interaction Model** defines interaction between **caller** and **callee**
when **callee** performs some work and the result of this work is delivered 
through callback mechanism passed by **caller** via input arguments of **callee**.

* **callback** is a moment when invoked piece of executable code invokes executable
code passed as an argument.

* **callback mechanism** is an extension of **callback function** 

* **caller** is the pieсe of code or function which initialize interaction via
invoking other function and 






## Events

CallbackJ define standard set of events. This event must be used only in
that cases which described in this conventions.

* ```success``` - this event tells caller that work was done successfully. 
Event contains the result. The type and content of result depends on 
callee implementation. If callee doesn't produce any result it pass ```undefined``` as result into event.

* ```error``` - if something goes wrong and callee can't complete work 

## Event Notification

## Event handling

#Event handler

Caller has two ways for creating callback handler: function and object. 
Object is most obvious. Object contains attributes with names which matches to event name.
Like success, error, each, begin, end.

##Callback Object Handler

* Success handler. Attribute with 'success' name which contains function receives one object as result.

```js
{
    success: function(result){ ... }
}
```
```result``` can be undefined.

* Error handler. Attribute with 'error' name which contains function receives one object as error. It can be any type.

```js
{
    error: function(error){ ... }
}
```
```error``` can't be undefined.


* Each handler. Attribute with 'each' name which contains function with two arguments. One holds next partial result or
next object. It can be any type. Second holds index. The sequencial number of received object. It must be Integer.

```js
{
   each: function(item, index){ ... } 
}
```
```item``` can be undefined but ```index``` must be Integer and greater or equal than zero.

* Begin handler. Attribute with 'begin' name which contains function without arguments.

```js
{
    begin: function(){ ... }
}
````

* End handler. Attribute with 'end' name which contains function without arguments.

```js
{
    end: function(){ ... }
}
````

## Callback Function Handler

* ```uninterested handler```: Function without arguments. Because it doesn't care about the result. 
It must be invoked for ```success``` and ```error``` events.

```js
function() { ... }
```

* ```success interested handler```: Function with one argument for passing result object or ```undefined``` if caller doesn't produce any result.
It cares of the success result only.

```js
function(result) { ... }
```

* ```canonical handler```: Function with two arguments. First for passing error object. 
If it is ```undefined``` then this callback can be interpreted as ```success``` event otherwise ```error``` event.
Second arguments is for passing result object. It can be ```undefined``` when callee doesn't produce any result.

```js
function(error, result) { ... }
```

* ```super handler```: Function with three arguments.
First argument is for passing error object. 
If it is ```undefined``` then this callback can be interpreted as ```success``` or ```each``` event otherwise it is ```error``` event.
Second argument is for receiving partial result or result object. It could be ```undefined```. The interpritation of value depends on third argument. 
Third argument is for receiving sequancial number of partial result or if it is ```undefined``` then 
the second parameter must be interpreted as result object.

```begin``` and ```end``` events can't be handled by function callback. If you need this you can use ```object callback```.
```js
function(error, data, index) { ... }
```

#Callee 

## Object notification

* ```success notification```: call function stored in ```success`` attribute and pass result object. 
If callee doesn't produce any result it passes ```undefined``` or calls without any arguments.
All following samples are value success notification. First sample shows how notifies about success and pass result object. 
Second and third samples shows how notifies about success without passing result object.

```js
callback.success(result);
```
```js
callback.success(undefined);
```
```js
callback.success();
```

* ```error notification```: call function stored in ```error`` attribute and pass error object.

```js
callback.error(error)
```

* ```each notification```: call function stored in ```each``` attribute and pass partial result and index. 
If callee doesn't produce any partial result it can pass it as ```undefined```.
The ```index``` can't be ```undefined```.
The second sample shows how notifies about ```each``` event without partial result.

```js
callback.each(item, index);
```
```js
callback.each(undefined, index);
```


* ```begin notification```: call function stored in ```begin``` attribute without any arguments.

```js
callback.begin();
```

* ```end notification```: call function stored in ```end``` attribute without any arguments.

```js
callback.end();
```

## Function notification

* ```success notification```: There are three options to make ```success notification``` throught callback function.
You can invoke callback function without any arguments.

```js
callback();
```

You can invoke callback function with one arguments and pass result object.
```js
callback(result);
```
Or you can invoke callback function with ```undefined``` in case if calee doesn't produce any result.
```js
callback(undefined);
```

You can invoke callback function with two parameters and pass ```undefined``` into first and result object into second
```js
callback(undefined, result);
```
Or if callee doesn't produce any result both arguments could be passed as ```undefined```
```js
callback(undefined, undefined);
```

* ```error notification```: invoke callback function and pass error object as first argument and ```undefined``` as second.* 
First arguments can't be ```undefined```

```js
callback(error, undefined);
```

* ```each notification```: invoke callback function and pass ```undefined``` as first argument, partial result as seccond argument and
index as third argument.

```js
callback(undefined, item, index);
```
Or if callee does't produce any result the second argument can be ```undefined```. Third argument can't be ```undefined```
```js
callback(undefined, undefined, index);
```