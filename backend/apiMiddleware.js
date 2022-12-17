import AsyncStorage from '@react-native-async-storage/async-storage';

  const newRefreshTokens = async () => {

    console.log(`newRefreshTokens
    newRefreshTokens
    newRefreshTokens
    newRefreshTokens
    `)

    const refresh_token = await AsyncStorage.getItem("HW_REFRESH_TOKEN");
    if (refresh_token == []) return;
    const api = `https://hautewellness.auth.us-west-1.amazoncognito.com/oauth2/token?refresh_token=${refresh_token}&&client_id=7mshr0490dpqjr78vb4bkt4sa5&grant_type=refresh_token`;

    const userResponse = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      credentials: 'same-origin',
    });

    const output = await userResponse.json();
    const access_token = output.access_token;

    await AsyncStorage.setItem("HW_ACCESS_TOKEN", access_token);
    console.log(`^^^^^^^^^^^^^^^^^^^`)
    return access_token;
  }

const apiMiddleware = async (apiName, params, setValidLogin) => {

//  setValidLogin(false)

  const access_token = await AsyncStorage.getItem("HW_ACCESS_TOKEN");
  const refresh_token = await AsyncStorage.getItem("HW_REFRESH_TOKEN");

  const userResponse = await fetch(apiName, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
    credentials: 'same-origin',
    body: JSON.stringify(params)
  });

  if (userResponse.status == 401)
  {
    console.log('RETRY!!!!!!!!!')
    console.log(apiName)
    const new_access_token = await newRefreshTokens();
    //const access_token = await AsyncStorage.getItem("HW_ACCESS_TOKEN");

    console.log('OLD', access_token)
    console.log('NEW', new_access_token)

    const retryResponse = await fetch(apiName, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${new_access_token}` },
      credentials: 'same-origin',
      body: JSON.stringify(params)
    });
    console.log('retryResponse.status')

    console.log(retryResponse.status)
    if (retryResponse.status != "200" && retryResponse.status != "201" && retryResponse.status != "203" && retryResponse.status != "204" )
    {
      console.log('invalid refresh token')
//      console.log(setValidLogin)
      setValidLogin(false)
    }
    return retryResponse;r
  }
  return userResponse;
}

export default apiMiddleware;
