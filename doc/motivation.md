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
 
