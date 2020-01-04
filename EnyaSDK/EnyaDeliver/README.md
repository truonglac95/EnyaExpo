# EnyaDeliver

EnyaDeliver provides the API and SDK for your app enabling secure report delivery.

# Getting Started

npm module for Blockdoc.com JavaScript SDK

```bash
npm install enyadeliver --save
```

# TypeScript

Install via NPM. `GetResult()` takes a data payload from the blockdoc API and downloads and stores the result on the phone. The data remain encrypted until needed:

```js
import * as EnyaDeliver from 'enyadeliver';

EnyaDeliver.GetResult(result)
EnyaDeliver.DecryptResult()
```

Generally, DecryptResult() will be used like this 
```js
EnyaDeliver.DecryptResult().then(decrypted64 => {
  //do something with the cleartext base64 string, such as display it...
  this.setState({
    base64String: 'data:application/pdf;base64,' + decrypted64,
    cryptoState: 'display',
  });
})
```

## V1.0.0(DEC 25, 2019)

* v1.0.0 release