
import Welcome from './Components/Welcome.jsx'
import Addition from "./Components/Addition.jsx";
import Inventory from "./Components/Inventory.jsx";
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

const Main = () => {

    

    return (

    <BrowserRouter>
      <Routes>
          <Route index element={<Welcome />} />
          <Route path="addition" element={<Addition />} />
          <Route path="inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  

    )

}

export default Main;