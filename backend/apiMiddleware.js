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
    return access_token;
  }

const apiMiddleware = async (apiName, params, setValidLogin) => {

  const access_token = await AsyncStorage.getItem("HW_ACCESS_TOKEN");
  const refresh_token = await AsyncStorage.getItem("HW_REFRESH_TOKEN");

  if (!access_token && !refresh_token && apiName != "https://go4d787t6h.execute-api.us-west-1.amazonaws.com/dev/hw_signIn") return;
  const userResponse = await fetch(apiName, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `${access_token}` },
    credentials: 'same-origin',
    body: JSON.stringify(params)
  });

  if (userResponse.status == 401)
  {
    const new_access_token = await newRefreshTokens();
    console.log('NEW', new_access_token)

    const retryResponse = await fetch(apiName, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${new_access_token}` },
      credentials: 'same-origin',
      body: JSON.stringify(params)
    });

    console.log('retryResponse.status', retryResponse.status)
    if (retryResponse.status != "200" && retryResponse.status != "201" && retryResponse.status != "203" && retryResponse.status != "204" )
    {
      console.log('invalid refresh token')
      setValidLogin(false)
    }
    return retryResponse;
  }
  return userResponse;
}

export default apiMiddleware;
