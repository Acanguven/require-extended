
# Require Extended

Extended require with awesome features!

[![Build Status](https://travis-ci.com/Acanguven/require-extended.svg?token=P2s8WVyVNPJgtfCf4E5i&branch=master)](https://travis-ci.com/Acanguven/require-extended)
[![Coverage Status](https://coveralls.io/repos/github/Acanguven/require-extended/badge.svg?branch=master)](https://coveralls.io/github/Acanguven/require-extended?branch=master)
[![npm version](https://badge.fury.io/js/require-extended.svg)](https://badge.fury.io/js/require-extended)
___

This package lets you modify how `require` should work. It adds some cool features like requiring from projects root path or redirecting all `fs` requires to your custom `custom-fs.js` module.

## Installation

* npm
```js
npm install require-extended
```

* yarn
```js
yarn add require-extended
```

## Usage

Import require extended in your entry file.
```js
const requireExtended = require('require-extended')();
```

## Features

### Root Path

You can use `require('~/file-from-root.js')` at anywhere of your project.

If you want to disable this feature or change the prefix you can pass options at your entry file where you first required require-extended.

```js
const requireExtended = require('require-extended')({
    resolveRoot: {
        enabled:true,
        prefix: '?'
    }
});
```
By default root path is found using the package [app-root-path](https://www.npmjs.com/package/app-root-path).

If you want to set it to a custom path you can always use `setRoot`. You can pass the absolute path or relative path. Relative paths will be resolved from the caller file.

```js
const requireExtended = require('require-extended')();
requireExtended.setRoot(myCustomRootPath);
```

### Bindings

You can return custom variables for require statements using `.bind()` feature.  Bindings define what NodeJs should load for `require`.

```js
const requireExtended = require('require-extended')();
const fsBinding = requireExtended.bind('fs', {
    readFileSync: () => {
        //custom implementation
    }
});
```

In this example for any file requires `fs` module they will receive a custom object. You can use any type of variable as a binding.

#### You can remove the binding by using `.restore()`.

```js
fsBinding.restore();
```

Now, all require calls to `fs` will receive the real `fs` module.

#### Binding matchers can be string, regex or a function that returns boolean
```js
const requireExtended = require('require-extended')();
const jsonBinding = requireExtended.bind('./folder/language.json', {langugues: []});
```
All files that requires `./folder/language.json` will now receive the custom json data.

___

 - Bindings are resolved during `_load` state where NodeJs checks module caches.
 - Bindings are before mimics. If bindings are not matched then mimics will be working.



### Mimics

Mimics are different than bindings, they change how NodeJs finds the file that should be loaded. Mimics are helping NodeJs to navigate between right files.

```js
const requireExtended = require('require-extended')();
const fsMimic = requireExtended.mimic('fs', 'querystring');
```

Whenever a file requires `fs` module now will receive `querystring` module.

#### Mimics can be used custom files too.
```js
const requireExtended = require('require-extended')();
const fsMimic = requireExtended.mimic('fs', './custom-fs.js');
```
Now the files require `fs` module will receieve your custom module.

####  Mimic paths can be used with root path resolver.
```js
const requireExtended = require('require-extended')();
const fsMimic = requireExtended.mimic('fs', '~/custom-fs.js');
```
Now the files require `fs` module will receieve your custom module on your project root.

####  Mimic matchers can be string, regex or a function that returns boolean
```js
const requireExtended = require('require-extended')();
const fsMimic = requireExtended.mimic((path) => {
    return path === 'fs'
}, '~/custom-fs.js');
```
#### Mimics can be chained
```js
const requireExtended = require('require-extended')();
const fsMimic = requireExtended.mimic('fs', 'querystring');
const querystringMimic = requireExtended.mimic('querystring', 'http');
const http = require('fs');
```
Whenever a file `require('fs')` they will receive `http` module. Because fs -> querystring -> http.

#### You can remove mimics by using `.restore()`.

```js
fsMimic .restore();
```


## Testing with `require-extended`

You can `.bind` your third-party libraries to make them return your instances.

### Sinon

```js
const requireExtended = require('require-extended')();
const sinon = require('sinon');
const fsBinding = requireExtended.bind('registerLibrary', sinon.spy());
```

You can return custom objects for testing. So you can easily assure that your important `require` lines are not removed by a coworker.
