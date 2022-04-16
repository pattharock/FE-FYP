import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from "@mui/material/Alert";
import Hero from "../components/Hero";
import axios from "axios";
import ShowCreds from "../components/ShowCreds";
import {encrypt, decrypt} from "../components/rsa/utils"


const HomePage = ({connect, disconnect, isActive, account}) => {

  const [dataRows, setDataRows] = useState([])
 
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  if (user) {
    console.log("INSIDE HOME");
    console.log(user);
  }
  console.log('user',user)

  let myCreds = [1];
  let sharedWithMe = [];
  useEffect(()=>{
    const baseURL = "http://127.0.0.1:8000/";
    const getCredIDS = async () => {
      const res = await axios.get(baseURL+'getFilesByUser?userId='+user.id)
      var num = 1
      res.data.credentials.forEach( async (i)=>{
        var doc = ''
        var link = ''
        var assetHash = ''
        var t = ''
        var s = ''
        var r = ''
        i.viewers.forEach((item)=>{
          if(item.id === user.id){
            if(item.permissions.transfer){
              t = 'Allowed'
            }else{
              t = 'Disallowed'
            }
            if(item.permissions.share){
              s = 'Allowed'
            }else{
              s = 'Disallowed'
            }
            if(item.permissions.revoke){
              r = 'Allowed'
            }else{
              r = 'Disallowed'
            }
      
          }
          doc = item.data.fileName
          link = item.data.metadataUrl
          assetHash = item.data.assetHash
        });
  
        const resp = await axios.get(baseURL+'getUserById?userId='+i.currentOwner);
  
        const pks = localStorage.getItem('privateKey' + user.username) ? localStorage.getItem('privateKey' + user.username) : "";
        const privateKey = (pks === "") ? {} : JSON.parse(pks);
    
        i.viewers.forEach(async (it) => {
          if (it.id === user.id) {  
            console.log(privateKey) 
            const assetHash = await decrypt(it.data.assetHash, privateKey);
            const link = await decrypt(it.data.metadataUrl, privateKey);
            console.log(link, assetHash)
            
            setDataRows((oldData)=>[...oldData, {
              id:num, 
              owner: resp.data.user.username,
              doc:it.data.fileName, 
              date: i.createdAt.toString(),
              link,
              assetHash, 
              valid:i.isValid.toString(),
              transfer: t,
              revoke: r,
              share: s, 
            }] )
            num = num + 1
          }
        })
      })
      console.log('dataRows',dataRows)
      // ShowCreds(dataRows)
      // credIDs.forEach(async (credID) => {
      //   const C = await axios.get(baseURL+"getCredential?credentailId="+credID);
      //   console.log(C)
      //   const cred = C;
      //   if (cred.id === user.id) {
      //     myCreds.push(cred);
      //   } else {
      //     sharedWithMe.push(cred);
      //   }
      // })
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
                <ShowCreds credentials={dataRows} />
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