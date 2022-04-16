import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from "@mui/material/Alert";
import Hero from "../components/Hero";
import axios from "axios";
import ShowCreds from "../components/ShowCreds";


const HomePage = ({connect, disconnect, isActive, account}) => {

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  if (user) {
    console.log("INSIDE HOME");
    console.log(user);
  }

  let myCreds = [1];
  let sharedWithMe = [];
  useEffect(()=>{
    const baseURL = "http://127.0.0.1:8000/";
    const getCredIDS = async () => {
      const U = await axios.get(baseURL+"getUserById?userId="+user.id);
      const credIDs = U.data.user.credentialIds;
      credIDs.forEach(async (credID) => {
        const C = await axios.get(baseURL+"getCredential?credentailId="+credID);
        const cred = C.data.credential;
        if (cred.ownerId === user.id) {
          myCreds.push(cred);
        } else {
          sharedWithMe.push(cred);
        }
      })
    }
    getCredIDS();
  
  }, [])

  return (
    <>
      {!user && (
        <div>
          <Hero />
        </div>
      )}
      {
        user && (
        <Container align="center">
          <Box sx={{ my: 4 }}>
            {(myCreds.length !== 0) && (
              <>
                <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#00897b", fontWeight: "bold"}}>
                  My Credentials
                </Typography>
                <ShowCreds credentials={myCreds} />
              </>
          )}
            {
              (sharedWithMe.length !== 0) && (
                <>
                  <Typography variant="h2" component="h1" gutterBottom sx={{ color: "#00897b", fontWeight: "bold"}}>
                    Shared with me
                  </Typography>
                  <ShowCreds credentials={sharedWithMe} />
                </>
              )
            }
            {
              (sharedWithMe.length === 0 && myCreds.length === 0) && (
                <Alert severity="error" sx={{width: "45%"}}>
                  No Credentials to show. 
                </Alert>
              )
            }
          </Box>
        </Container>
        )
      }
    </>
  );
}

export default HomePage;