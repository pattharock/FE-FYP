import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useState} from 'react'
import {getCredentialsByUser} from './apis/GetApis'

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

const ShowCreds = ({ credentials }) => {

  const [dataRows,setDataRows] = useState([])
  // getCredentialsByUser()
  console.log('credentials',credentials)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No. </TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">UNIX Timestamp</TableCell>
            <TableCell align="right">Document</TableCell>
            <TableCell align="right">Link</TableCell>
            <TableCell align="right">Asset Hash</TableCell>
            <TableCell align="right">Valid</TableCell>
            <TableCell align="right">Transfer</TableCell>
            <TableCell align="right">Revoke</TableCell>
            <TableCell align="right">Share</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {credentials.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.owner}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.doc}</TableCell>
              <TableCell align="right">{row.link}</TableCell>
              <TableCell align="right">{row.assetHash}</TableCell>
              <TableCell align="right">{row.valid}</TableCell>
              <TableCell align="right">{row.transfer}</TableCell>
              <TableCell align="right">{row.revoke}</TableCell>
              <TableCell align="right">{row.share}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default ShowCreds;