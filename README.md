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

You have ```selectAll``` function which uses CallbackJ and you are going to use it.
You that ```selectAll``` function retrieve some objects by input parameter.
You found folloing description in documentation about function

```js
/**
 * selector - regex which specify strings must be selected
 * callbackJ - CallbackJ compatible function for receiving each retrived string, all retrived strings after success and error if something goes wrong.
 */
function selectAll(selector, callbackJ)

```
What does ```callbackJ CallbackJ compatible function for ...``` message mean?
It means that you have following options to receive callback messages.

* I don't care of result and error. I just want to know that it was done.

```js

selectAll(/foo/, function(){
    // this code will be invoked if all objects are selected or error is raised.
});
```
* I am interested in result but I don't care about errors

```js

selectAll(/foo/, function(result){
    // result will contains the result of execution. 
    //In our case it is an array of selected objects
});
```
* I am interested in result and error

```js

selectAll(/foo/, function(error, result){
    // result will contains the result of execution  
    // error contains value if something goes wrong
    // So I need handle such case like following
    if (error) {/*handle error here*/}
});
```

* Or I want have different functions for error and success handling

```js

selectAll(/foo/, {
    success: function(result){/* handle success*/},
    error: function(error){/*handle error*/}
});
```
We have on ```selectAll``` funtion which provide such flexibility.
Is it hard to implement? No, it isn't.

```js
function selectAll(selector, callback) {
    callback = callbackj(callback);
    try {
        for(var i = 0; i < STRINGS.length; i++) {
            if (STRINGS[i].match(selector)) callback.each(STRINGS[i], i);
        }    
        callback.success(e);
    } catch(e) {
        callback.error(e);
    }
}
```
So see that implentation is clear. You just need wrap received callback.
Client code use any option to implement callback function. It only must match 
CallbackJ convention.





