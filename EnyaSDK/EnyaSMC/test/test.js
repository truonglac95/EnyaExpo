var enyasmc = require("../module")

const user_input = [1,1,1,1,1,86792.0009]
const parameters = [1,2,3,4,5,6]

enyasmc.input.apply(this, user_input)

enyasmc.configure({
    AccessToken: "s89ysydgsi6",
    Algorithm: "test6",
    //Bitlength: 1 // Not required
})

// Run linear module
enyasmc.Linear().then(function(result){ console.log(result) })
