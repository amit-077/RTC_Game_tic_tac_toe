import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Room from "./Room";
import App from "./App";
const Master = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Room />} />
          <Route path="/game/:id" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default Master;
