import { SECURE_PRS_CHANNEL_3 } from './settings';

const SMC_ServerPing = async input_json => {
  try { key =  await fetch(SECURE_PRS_CHANNEL_3 + 'uuid-whitelist', 
        {
          method:'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input_json)
        }
      )
    return { status:key.status }
  }
  catch ( error ) { 
    return error 
  }
}

/*
ServerTest({uuid:'ServerConnectTest'}).then((server) => {
          if (__DEV__) console.log('Server connection info: ' + (server.status == 201 ? 'connected' : 'error'))
          this.props.dispatch(internetStatus({
            internet_connected: true,
            servers_reachable: server.status == 201,
          }));
        })
      } else {
        this.props.dispatch(internetStatus({
          internet_connected: false,
          servers_reachable: false,
        }));
*/
