# express-custom-error-manager

"express-custom-error-manager" is a minimalistic [express.js](https://github.com/expressjs/express) package for handling and managing custom error responses anywhere in Express application. Simplifying error handling by allowing you to create custom exceptions with specific messages, HTTP status codes, and optional error-response behaviors. With integrated configurable options, you can control how errors are handled, whether to gracefully send error responses or trigger specific actions by using callbacks.

## Installation

```
npm install express-custom-error-manager
```

Also make sure that you have express.js to use it.

## Usage

### Import and register the module.

make sure to import and call ErrManager.register() method on the top of the application,
before you regiter any routes.

```javascript
const app = express();

import ErrManager from 'express-custom-error-manager';
app.use(ErrManager.register());
```

### Register ErrManager middleware.

make sure that Errmanager.middleware() will be placed as last middleware of the app.

```javascript
const app = express();

//...other middleware and routes ...

import ErrManager from 'express-custom-error-manager';
app.use(ErrManager.middleware());
```

## API

# `ExHandler.createException(message, callback, options)`

create custom exception class.

- `message` (string): The error message for this exception which will be sent to user.
- `callback(arg)` (function(arg)): The callback function which executes when exception is thrown (optional).
- `options` ({ httpStatus: 400 ; killProcess: false;}): options object to fine tune exception behavior:

`httpStatus` sets the status code which will be sent in error message response (by default its 400).
`killProcess` controls if node process should be exited gracefully after error is thrown(by deafult its false).

#example `createException` usage:

```javascript
//exceptions/customEx.js/ts
import ErrManager from 'express-custom-error-manager';

const customErr = ErrManager.createException(
  //error message by default its ''
  'error message that will be sent to user',

  // optional callback which can be both sync/async which will be executed when exception will be thrown.
  // we can add parameter in case when we want to pass in data when we throw the exception.
  // example: return customErr('callback arg')  --> 'callback is called with data: callback arg'
  (data) => {
    console.log('callback is called with data: ', data);
  },
  // optional options object and their properties to fine tune custom exception
  {
    httpStatus: 200, // defaults to 400
    killProcess: false // defaults to false
  }
);
```

# Example

```javascript
import express from 'express';
import ErrManager from 'express-custom-error-manager';

const app = express();

app.use(ErrManager.register());

const userNotFounderr = ErrManager.createException(
  'user not found',
  (userId) => {
    console.log(`user with ${userId} not found`);
  },
  {
    httpStatus: 404
  }
);

app.get('/user/:id', (req, res, next) => {
  const userId = req.params.id;
  if (!isValidUserId(userId)) {
    return userNotFound(userId);
  }
  // ...rest of the route handler...
});

app.use(ExHandler.middleware());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## License

This project is licensed under the MIT License.
