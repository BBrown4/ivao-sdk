# IVAO-SDK
___
## Introduction
The IVAO-SDK is a wrapper for interacting with the IVAO API and pulling data from IVAO for use in any web app.

### Installation
To get started using IVAO-SDK in your project, simply run the following command in your terminal:
```
$ npm i ivao-sdk -D
```

### Usage
To use the IVAO-SDK, import it into your project and instantiate a new instance of the IVAO class:
```javascript
const ivaoSdk = require('ivao-sdk');

// instantiate new instance of IvaoClient
const ivaoClient = new ivaoSdk.IvaoClient(); // default data refresh rate of 15 seconds

// Listen for connected event to know when the client is ready to use.
ivaoClient.on('connected', () => {
  console.log('Connected to IVAO API');
});
```

When instantiating a new instance, you can optionally pass in an options object to specify the data refresh rate:
```javascript
const ivaoClient = new ivaoSdk.IvaoClient({
  refreshRate: 30 // refresh data every 30 seconds
});
```