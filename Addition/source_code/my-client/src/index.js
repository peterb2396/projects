import React from "react";
import ReactDOM from "react-dom/client";

import Addition from "./Addition";

const rootElement = ReactDOM.createRoot(document.getElementById("root"));
rootElement.render(
  <React.StrictMode>
    <Addition />
  </React.StrictMode>,
);