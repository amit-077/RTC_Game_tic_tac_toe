import { Box, Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";

const Room = () => {
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });
  }, []);

  useEffect(() => {
    socket.on("startGame", ({ message, playerArr }) => {
      setLoading(false);
      setName((prevVal) => {
        console.log(message, prevVal);
        navigate(`/game/${message}`, { state: {prevVal, playerArr} });
        return prevVal;
      });
    });
  }, []);

  const joinRoom = () => {
    socket.emit("join_room", { roomId: gameId, playerName: name });
    setLoading(true);
  };

  return (
    <Box w={"100vw"} h={"100vh"} display={"flex"} justifyContent={"center"}>
      <Box
        w={"30%"}
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"1rem"}
      >
        <Box>
          <Input
            placeholder="Enter room id"
            onChange={(e) => {
              setGameId(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Input
            placeholder="Enter your name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Box>
        <Box>
          <Button
            colorScheme="blue"
            isLoading={loading}
            loadingText={"Waiting for other player to join"}
            onClick={() => {
              if (gameId == "" || name == "") {
                alert("Enter details");
                return;
              }
              joinRoom();
              // navigate(`/game/${gameId}`, { state: name });
            }}
          >
            Play!
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Room;
