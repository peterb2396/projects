
import Welcome from './Components/Welcome.jsx'
import Addition from "./Components/Addition.jsx";
import Inventory from "./Components/Inventory.jsx";
import Login from "./Components/Login.jsx";
import Account from './Components/Account.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import React from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

const Main = () => {


  function setToken(userToken) {
    // Store the username as a token to display and allow logged-in-features
    sessionStorage.setItem('token', userToken);
  }
  
  function getToken() {
    return sessionStorage.getItem('token');
  }

   

    return (
      <>

    <BrowserRouter>
      <Routes>
          <Route index element={<Welcome token = {getToken}/>} />
          <Route path="addition" element={<Addition token = {getToken}/>} />
          <Route path="inventory" element={<Inventory token = {getToken} />} />
          <Route path="login" element={<Login setToken = {setToken} token = {getToken}/>} />
          <Route path="account" element={<Account setToken = {setToken} token = {getToken}/>} />
      </Routes>
    </BrowserRouter>
    </>
  

    )

}

export default Main;