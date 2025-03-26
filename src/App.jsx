import React, { useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from 'aws-amplify/auth'; // Updated import
import "@aws-amplify/ui-react/styles.css";
import config from './amplifyconfiguration.json';
import useDeviceStore from "./components/hooks/useDeviceStore";
import Controls from "./components/Controls";
import BlueprintCanvas from "./components/BlueprintCanvas";
import { setToken } from "./utils/token";

// Configure Amplify before rendering
Amplify.configure(config);

const App = () => {
  const { themeMode } = useDeviceStore();
  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  // Function to handle setting the token after successful authentication
  const handleAuthStateChange = async (authState) => {
    if (authState === 'signedIn') {
      try {
        // Get the current authenticated user's session
        const { tokens } = await fetchAuthSession();
        
        // Set the tokens (accessToken and idToken are available in tokens)
        if (tokens?.accessToken) {
          setToken('accessToken', tokens.accessToken.toString());
        }
        if (tokens?.idToken) {
          setToken('idToken', tokens.idToken.toString());
        }
        
        console.log('User successfully signed in and tokens stored');
      } catch (error) {
        console.error('Error getting session or tokens:', error);
      }
    } else if (authState === 'signedOut') {
      // Clear tokens when user signs out
      setToken('accessToken', null);
      setToken('idToken', null);
      console.log('User signed out and tokens cleared');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: "flex", 
        height: "100vh", 
        bgcolor: themeMode === "dark" ? "#121212" : "#fff", 
        color: themeMode === "dark" ? "#fff" : "#000" 
      }}>
        <Authenticator 
          onStateChange={({ authState }) => handleAuthStateChange(authState)}
          hideSignUp={false}
        >
          {({ signOut, user }) => (
            <>
              <Controls />
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <BlueprintCanvas />
              </Box>
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                <button onClick={signOut}>Sign Out</button>
              </Box>
            </>
          )}
        </Authenticator>
      </Box>
    </ThemeProvider>
  );
};

export default App;