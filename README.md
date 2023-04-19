# IVAO-SDK
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/BBrown4/ivao-sdk/test-build.yaml?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/BBrown4/ivao-sdk/docs-deploy.yaml?label=docs%20deployment&style=flat-square)
___
## Introduction
The IVAO-SDK is a wrapper for interacting with the IVAO API and pulling data from IVAO for use in any web app.

### Installation
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
  
  // The SDK also emits an event for when data is refreshed if you wish to perform logic on data refresh
    ivaoClient.on('dataRefreshed', () => {
        console.log('Data refreshed');
    });
});
```

When instantiating a new instance, you can optionally pass in an options object to specify the data refresh rate:
```javascript
const ivaoClient = new ivaoSdk.IvaoClient({
  refreshRate: 30 // refresh data every 30 seconds
});
```

### Quickstart Example
```javascript
const ivaoSdk = require('ivao-sdk');
const ivaoClient = new ivaoSdk.IvaoClient();

ivaoClient.on('connected', () => {
  console.log('Connected to IVAO API');

  const pilots = ivaoClient.getIvaoPilotsFiltered({
    flightPlan: {
      aircraft: {
        icaoCode: 'B738',
      },
    },
  });

  console.log(pilots);
  console.log('Result count:', pilots.length);
});
```

### Documentation
See the [IVAO SDK documentation](https://bbrown4.github.io/ivao-sdk/classes/clients_IvaoClient.IvaoClient.html) for more information and usage examples of
the client methods.