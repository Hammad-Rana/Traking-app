import React, { useEffect, useState } from "react";
import { setToken, removeToken, getToken } from "./utils/token";
import { Box, Button } from "@mui/material";
import Controls from "./components/Controls";
import BlueprintCanvas from "./components/BlueprintCanvas";
import useDeviceStore from "./components/hooks/useDeviceStore";

const CLIENT_ID = "13c45mooksb7g74o8kmk1rgb3n";
const COGNITO_DOMAIN =
  "https://us-east-1pfh9eaqyb.auth.us-east-1.amazoncognito.com";
const REDIRECT_URI = window.location.origin;
const TOKEN_URL = `${COGNITO_DOMAIN}/oauth2/token`;
const LOGOUT_URL = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${REDIRECT_URI}`;

// Utility function to decode JWT
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const App = () => {
  const { authState, setAuthState } = useDeviceStore();
  console.log(useDeviceStore(), "useDeviceStore()");
  useEffect(() => {
    handleAuthFlow();
  }, []);

  const handleAuthFlow = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      setAuthState({
        status: "error",
        user: null,
        error: error,
      });
      return;
    }

    if (code) {
      await exchangeCodeForToken(code);
    } else {
      checkExistingSession();
    }
  };

  const exchangeCodeForToken = async (code) => {
    try {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI,
      });

      // Add client_secret if your app client requires it
      // body.append("client_secret", "YOUR_CLIENT_SECRET");

      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to exchange authorization code"
        );
      }

      const tokens = await response.json();
      setToken(tokens.id_token); // Store ID token for user info

      const idToken = decodeJWT(tokens.id_token);
      const accessToken = decodeJWT(tokens.access_token);

      if (!idToken?.email && !accessToken?.email) {
        throw new Error("Email claim not found in tokens");
      }

      setAuthState({
        status: "authenticated",
        user: {
          username: idToken["cognito:username"] || idToken.sub,
          email: idToken.email || accessToken.email,
          phone: idToken.phone_number,
          name: idToken.name || idToken.given_name,
        },
        error: null,
      });

      // Clean URL after successful auth
      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthState({
        status: "error",
        user: null,
        error: error.message,
      });
    }
  };

  const checkExistingSession = () => {
    const token = getToken();
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && (decoded.email || decoded["cognito:username"])) {
        setAuthState({
          status: "authenticated",
          user: {
            username: decoded["cognito:username"] || decoded.sub,
            email: decoded.email,
            phone: decoded.phone_number,
            name: decoded.name || decoded.given_name,
          },
          error: null,
        });
        return;
      }
    }
    setAuthState({ status: "unauthenticated", user: null, error: null });
  };

  const handleLogin = () => {
    const scopes = [
      "openid",
      "email",
      "profile",
      "phone",
      "aws.cognito.signin.user.admin",
    ].join("+");

    window.location.href =
      `${COGNITO_DOMAIN}/login?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${scopes}`;
  };

  const handleLogout = () => {
    setAuthState({
      status: "",
      user: null,
      error: null,
    });
    // removeToken();
    window.location.href =
      `${COGNITO_DOMAIN}/login?` +
      `client_id=${CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${scopes}`;
  };

  if (authState.status === "loading") {
    return <div>Loading authentication state...</div>;
  }

  if (authState.status === "error") {
    return (
      <div style={{ padding: 20 }}>
        <h2>Authentication Error</h2>
        <p>{authState.error}</p>
        <button onClick={handleLogin}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      {authState.status === "authenticated" ? (
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            bgcolor: "#fff",
            color: "#000",
          }}
        >
          <Controls user={authState.user} />
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <BlueprintCanvas />
          </Box>
          <Box sx={{ position: "absolute", top: 10, right: 10 }}>
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Sign Out
            </Button>
          </Box>
        </Box>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2>Please Sign In</h2>
          <button
            onClick={handleLogin}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Sign In with Cognito
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
