

import Welcome from './Components/Welcome.jsx'
import Addition from "./Components/Addition.jsx";
import Inventory from "./Components/Inventory.jsx";
import Login from "./Components/Login.jsx";
import Account from './Components/Account.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import React, {useState} from 'react';
import raw from "./host.txt"
import { BrowserRouter, Routes, Route } from "react-router-dom";


const Main = () => {
  const [host, setHost] = useState("")
  // get host from text file
fetch(raw)
 .then(r => r.text())
 .then(text => {
  var copy = (' ' + text).slice(1);
  setHost(copy)
});

//const host = "http://3.232.168.176:3001"
console.log(host)

  function setToken(userToken) {
    // Store the username as a token to display and allow logged-in-features
    sessionStorage.setItem('token', userToken);
  }
  
  function getToken() {
    return sessionStorage.getItem('token');
  }

   
  if (host)
    return (
      <>

    <BrowserRouter>
      <Routes>
          <Route index element={<Welcome token = {getToken} host = {host}/>} />
          <Route path="addition" element={<Addition token = {getToken} host = {host}/>} />
          <Route path="inventory" element={<Inventory token = {getToken} host = {host} />} />
          <Route path="login" element={<Login setToken = {setToken} token = {getToken} host = {host}/>} />
          <Route path="account" element={<Account setToken = {setToken} token = {getToken} host = {host}/>} />
      </Routes>
    </BrowserRouter>
    </>
  

    )

}

export default Main;