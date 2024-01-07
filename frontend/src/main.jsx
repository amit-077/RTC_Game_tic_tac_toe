import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Room from "./Room";
import Master from "./Master";

ReactDOM.render(
  <Master/>,
  document.getElementById("root")
);
