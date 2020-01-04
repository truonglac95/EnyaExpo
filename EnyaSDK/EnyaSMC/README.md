# EnyaSMC

EnyaSMC provides the computation API and SDK for your app enabling privately computation on sensitive data.

# Getting Started

npm module for Blockdoc.com JavaScript SDK

```bash
npm install enyasmc --save
```

# TypeScript

Install via NPM and import like below in your JS file:

```js
import * as EnyaSMC from "enyasmc";

const object = []

EnyaSMC.configure({
	AccessToken: "AccessToken",
  Algorithm: "Algorithm_name"
})
EnyaSMC.input.apply(this, object)
EnyaSMC.Linear().then(function(result){ console.log(result) })
```

# Test

Use the `test.js` file in the  `test` folder to test it.

# Process

## 1. Configure your own algorithm

1. You can directly open **linux_executable** file and follow the instructions.


2. Or use the following code:

  ```bash
  cd configure_algorithm
  python3 configure_algorithm.py -t[token] -n[your special name] -c[parameters]
  ```

  e.g.

  ```bash
  cd configure_algorithm
  python3 configure_algorithm.py -t s89ysydgsi6 -n test -c [1,2,3,4,5,6]
  ```

  If you are using zsh, please use the following code:

  ```zsh
  cd configure_algorithm
  python3 configure_algorithm.py -n s89ysydgsi6 test -c "[1,2,3,4,5,6]"
  ```

## 2. Add the code to your APP

Put the whole EnyaSMC folder into your app and follow the typescript.

```js
var enyasmc = require("[dir]/EnyaSMC")

const user_input = [1, 2, 3, 4, 5, 6]

enyasmc.input.apply(this, user_input)

enyasmc.configure({
    AccessToken: "s89ysydgsi6", // Secret token, given by us
    Algorithm: "your special name"
  	//Bitlength: [not required][Default as 8]
})

// Linear computation
enyasmc.Linear().then(function(result){ console.log(result) })

/*   
parameters = [1, 2, 3, 4, 5, 6]
user_input = [1, 2, 3, 4, 5, 6]
It will return the sum of the dot product of parameters and user_input.
*/
```

Later, you can use npm to download the module.

```bash
npm install enyasmc --save
```

## 3. Output

**enyasmc.linear()** returns an Object

```js
// Successful
{secure_result: dot_product_final, status_code: status_code}
// Failed
{status_code: status_code}
```

The successfull **status_code** is 200 and the failed **status_code** is 404. Calculations may fail because of settings errors (see error messages) or server issuses (please contact us).

# Limitations

* There is no limitation on the number of terms.

* There is a limitation on the size of parameters and weights. When any number is larger than 10^15 or error results occur, please pick a smaller bitlength to get a more precise answer. 

  ```js
  enyasmc.configure({
      AccessToken: "s89ysydgsi6", // Secret token, given by us
      Algorithm: "your special name",
    	Bitlength: 1 // Default is 8 but it can be any positive integer 
  })
  ```

* Be aware of decimals. It will drop decimals when the result is larger than 10^10.

#### Solutions for large parameters and small weights or small parameters and large weights

1. If you have a coefficient such as `b * 10^15`​ and a weight such as `a * 10^-5`, consider balancing them (i.e. `​b * 10^5​` and `a * 10^5` to faciliate calculations).
2. Or, adjust **Bitlength** in configure settings.

## Note

Our customers need to upload the name of their algorithm and parameters of their linear regression function to our server. We will give them a secret token to access our service. When they use our SMC module, they only need to provide user's data, the secret token, and the name of their algorithm and the EnyaSMC function will return the result. Please contact us for access to different regression functions.

## V1.0.0(DEC 25, 2019)

* v1.0.0 release