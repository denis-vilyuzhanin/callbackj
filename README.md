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





