Motivation
============

This page contains some story which was the reason for creation of CallbackJ.

#Error handling
Let’s imaging that we need function which open and parsing JSON file and parsing it. 
Function will be used in program was written for NodeJ. 
Here is the code:

```js
var fs = require("fs");
function readAndParse(file, callback) {
    fs.readFile(file, function (err, data) {
      callback(JSON.parse(data));
    });
};
```

Now we can use this function like shown in following listing:

```js
var file = process.argv[2];
readAndParse(file, function(object){
    console.log(object);
});
```

Looks simple. But we haven’t thought about exception cases. like file doesn’t exists. 
No problem. We have err argument in callback functions was passed into fs.readFile. 
But what we must to do with this error. We can just throw error again.
```js
var fs = require("fs");
function readAndParse(file, callback) {
    fs.readFile(file, function (err, data) {
    if(err) throw err;
      callback(JSON.parse(data));
    });
};
```

But in this case you can’t handle this error when you have to.
So we need to pass this error into callback function as argument. 
Moreover we can catch errors in data parsing and pass this error into callback function too.
So this is new version of readAndParse function.

```js
function readAndParse(file, callback) {
    fs.readFile(file, function (err, data) {
      if (err) return callback(err, undefined);
      try {
        callback(undefined, JSON.parse(data));
      } catch(e) {
        callback(e, undefined);
      }
    });
};
```

Now I need change all places where our readAndParse function is used.
Even those which isn’t interested in this error. 

```js
var file = process.argv[2];
readAndParse(file, function(err, object){
    if(err) throw err; // Or maybe it is better just return!!!
    console.log(object);
});
```

You see this require to support contract between caller and callee. 
Changing callback contract require changes in calle and all callers and doesn’t matter for which this changes are required.
The classical function invocation has more advantages in such cases. 
You can can surround called function with try/catch block if you want to handle errors but try catch is useless in asynchronous programming.

We can use object which contains optional callback functions. 
In next example, function receives callback object and it expects two attributes: one optional error and required success attributes.

```js
function readAndParse(file, callback) {
    fs.readFile(file, function (err, data) {
        if (err) {
            return callback.error ? callback.error(err) : undefined;
        }
        try {
            callback.success(JSON.parse(data));
        } catch(e) {
            return callback.error ? callback.error(err, undefined) : undefined;
        }
    });
};
```
Now introduce new version of caller which ignore any errors.

```js
var file = process.argv[2];
readAndParse(file, {
    success: function(data) {
        console.log(data);
    }
});
```


But if we want handle error we will add error attribute into callback.

```js
readAndParse(file, {
    success: function(data) {
        console.log(data);
    },
    error: function(err) {
        console.log("ERROR", err);
    }
});
```
Now it is now flexible and easier made changes.

#Afterword
From this thought CallbackJ was started. 
 

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
