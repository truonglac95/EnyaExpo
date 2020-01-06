var enyasmc = require("../")

const user_input = [1,1,1,1,1,86792.0009]
const parameters = [1,2,3,4,5,6]

enyasmc.input.apply(this, user_input)

enyasmc.configure({
    AccessToken: "s89ysydgsi6",
    Algorithm: "test6",
    //Bitlength: 1 // Not required
})

// Linear computation
enyasmc.Linear().then(function(result){ console.log(result) })

enyasmc.ServerPing({uuid:'ServerConnectTest'}).then((server) => {
  if (__DEV__) console.log('Server connection info: ' + (server.status == 201 ? 'connected' : 'error'))
  if(server.status == 201) {
    //this.props.dispatch(internetStatus({servers_reachable: true}))
  } else {
    //this.props.dispatch(internetStatus({servers_reachable: false}))
  }
})

