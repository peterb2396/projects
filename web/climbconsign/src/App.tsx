import React, {useState} from 'react';
//import CustomerSearchModal from './components/CustomerSearchModal';
import LoginView from './Views/LoginView';
import './App.css'; //css for everywhere
import HomeView from './Views/HomeView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// @ts-ignore
import raw from "./host.txt";
import LogsView from './Views/LogsView';
import GroupsView from './Views/GroupsView';

export default function App() {
  
  function setToken(userToken: string) {
    sessionStorage.setItem('token', userToken);
  }
  
  function getToken() {
    const tokenString = sessionStorage.getItem('token');
    return tokenString
  }

  const [host, setHost] = useState("")
  // get host from text file
  fetch(raw)
  .then(r => r.text())
  .then(text => {
    var copy = (' ' + text).slice(1);
    setHost(copy)
  });
  
  if (host)
  return (
    <div className="App">
      {
        getToken()? ( // If authenticated, use the router
          <BrowserRouter>
          <Routes>
              <Route index element={<HomeView host = {host}/>} /> 
              <Route path='/admin/logs' element={<LogsView host = {host}/>} /> 
              <Route path='/admin/groups' element={<GroupsView host = {host}/>} /> 
          </Routes>
        </BrowserRouter>
        ) : (
          // We pass the host so we can make a http request to authenticate the user
          <LoginView setToken={setToken} host = {host}/>
        )

      }
    </div>
  )
  else
  return(<></>)
}

