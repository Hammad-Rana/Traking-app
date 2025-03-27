import React, { useEffect, useState } from 'react'
import { CognitoUserPool, CookieStorage } from 'amazon-cognito-identity-js'
import { setToken, removeToken, getToken } from "./utils/token";
///
import { Box } from "@mui/material";
import Controls from "./components/Controls";
import BlueprintCanvas from "./components/BlueprintCanvas";
///
const userPool = new CognitoUserPool({
  UserPoolId: "us-east-1_pFH9EAqyb",
  ClientId: "13c45mooksb7g74o8kmk1rgb3n",
  Storage: new CookieStorage({ domain: "localhost" })
})

const App = () => {
  const [authState, setAuthState] = useState({ status: 'loading', user: null })

  const handleAuthFlow = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      
      if (code) {
        await handleAuthorizationCode(code)
        window.history.replaceState({}, '', window.location.pathname)
      } else {
        await checkExistingSession()
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setAuthState({ status: 'unauthenticated', user: null })
    }
  }

  const handleAuthorizationCode = async (code) => {
    try {
      const tokenEndpoint = 'https://us-east-1pfh9eaqyb.auth.us-east-1.amazoncognito.com/oauth2/token';
      const redirectUri = window.location.origin;
      
      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', '13c45mooksb7g74o8kmk1rgb3n');
      body.append('code', code);
      body.append('redirect_uri', redirectUri);
  
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      });
  
      if (!response.ok) {
        throw new Error('Failed to exchange authorization code for tokens');
      }
  
      const tokens = await response.json();
      setToken(tokens.access_token)
      // Just log the tokens instead of storing them
      console.log('Received tokens:', tokens.access_token);
  
      // Extract user information from the ID token
      const idTokenPayload = JSON.parse(atob(tokens.id_token.split('.')[1]));
      console.log('User information:', {
        username: idTokenPayload['cognito:username'],
        email: idTokenPayload.email
      });
  
      // Update auth state
      setAuthState({
        status: 'authenticated',
        user: {
          username: idTokenPayload['cognito:username'],
          email: idTokenPayload.email
        }
      });
  
      return true;
    } catch (error) {
      console.error('Error exchanging authorization code:', error);
      setAuthState({ status: 'unauthenticated', user: null });
      return false;
    }
  }

  const checkExistingSession = () => {
    return new Promise((resolve) => {
      const cognitoUser = userPool.getCurrentUser()
      
      if (!cognitoUser) {
        setAuthState({ status: 'unauthenticated', user: null })
        resolve(false)
        return
      }

      cognitoUser.getSession((err, session) => {
        if (err || !session?.isValid?.()) {
          setAuthState({ status: 'unauthenticated', user: null })
          resolve(false)
          return
        }

        const token = session.getIdToken().getJwtToken()
        console.log('cognitoToken', token)
        
        setAuthState({
          status: 'authenticated',
          user: {
            username: session.getIdToken().payload['cognito:username'],
            email: session.getIdToken().payload.email
          }
        })
        resolve(true)
      })
    })
  }

  useEffect(() => {
    handleAuthFlow()
  }, [])

  const handleLogin = () => {
    const loginUrl = new URL('https://us-east-1pfh9eaqyb.auth.us-east-1.amazoncognito.com/login')
    loginUrl.searchParams.append('client_id', '13c45mooksb7g74o8kmk1rgb3n')
    loginUrl.searchParams.append('redirect_uri', window.location.origin)
    loginUrl.searchParams.append('response_type', 'code')
    loginUrl.searchParams.append('scope', 'email openid phone')
    window.location.href = loginUrl.toString()
  }

  const handleLogout = () => {
    const cognitoUser = userPool.getCurrentUser()
    cognitoUser?.signOut()
    removeToken()
    const loginUrl = new URL('https://us-east-1pfh9eaqyb.auth.us-east-1.amazoncognito.com/login')
    loginUrl.searchParams.append('client_id', '13c45mooksb7g74o8kmk1rgb3n')
    loginUrl.searchParams.append('redirect_uri', window.location.origin)
    loginUrl.searchParams.append('response_type', 'code')
    loginUrl.searchParams.append('scope', 'email openid phone')
    window.location.href = loginUrl.toString()
  }

  if (authState.status === 'loading') {
    return <div>Loading authentication state...</div>
  }
console.log(authState,"authState")
const tokenAuthenticated = getToken();
  return (
    <>
      {(authState.status === 'authenticated' || tokenAuthenticated) ? (
         <>
         <Controls />
         <BlueprintCanvas />
         <Box sx={{ position: "absolute", top: 10, right: 10 }}>
           <button onClick={handleLogout}>Sign Out</button>
         </Box>
       </>
      ) : (
        <button onClick={handleLogin}>Sign In with Cognito</button>
      )}
    </>
  )
}

export default App