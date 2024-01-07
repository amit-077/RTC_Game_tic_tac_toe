import { Box, Button, Text, useDisclosure, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import { useLocation, useParams } from "react-router-dom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const App = () => {
  const location = useLocation();
  const { state } = location;
  const name = state?.prevVal;
  const opponent =
    state?.playerArr[0] == name ? state?.playerArr[1] : state?.playerArr[0];

  const toast = useToast();
  const toastId = "test-toast";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [playerWinner, setPlayerWinner] = useState(null);

  console.log("Player name is : " + name);
  let num = 0;
  const { id } = useParams();

  // const [you, setYou] = useState("Player 1");
  // const [opponent, setOpponent] = useState("Player 2");
  const [turn, setTurn] = useState(1);
  const checkWin = () => {
    //
    let isDraw = true;
    let winner = false;
    const d1 = document.getElementById("b1").innerHTML;
    const d2 = document.getElementById("b2").innerHTML;
    const d3 = document.getElementById("b3").innerHTML;
    const d4 = document.getElementById("b4").innerHTML;
    const d5 = document.getElementById("b5").innerHTML;
    const d6 = document.getElementById("b6").innerHTML;
    const d7 = document.getElementById("b7").innerHTML;
    const d8 = document.getElementById("b8").innerHTML;
    const d9 = document.getElementById("b9").innerHTML;
    //

    if (
      (d1 == "X" && d2 == "X" && d3 == "X") ||
      (d4 == "X" && d5 == "X" && d6 == "X") ||
      (d7 == "X" && d8 == "X" && d9 == "X") ||
      (d1 == "X" && d4 == "X" && d7 == "X") ||
      (d2 == "X" && d5 == "X" && d8 == "X") ||
      (d3 == "X" && d6 == "X" && d9 == "X") ||
      (d1 == "X" && d5 == "X" && d9 == "X") ||
      (d3 == "X" && d5 == "X" && d7 == "X")
    ) {
      winner = true;
      console.log("Winner is declared");
      // alert("User 1 won");
      socket.emit("gameWinner", { winner: "X" });
      return;
    } else if (
      (d1 == "O" && d2 == "O" && d3 == "O") ||
      (d4 == "O" && d5 == "O" && d6 == "O") ||
      (d7 == "O" && d8 == "O" && d9 == "O") ||
      (d1 == "O" && d4 == "O" && d7 == "O") ||
      (d2 == "O" && d5 == "O" && d8 == "O") ||
      (d3 == "O" && d6 == "O" && d9 == "O") ||
      (d1 == "O" && d5 == "O" && d9 == "O") ||
      (d3 == "O" && d5 == "O" && d7 == "O")
    ) {
      winner = true;
      socket.emit("gameWinner", { winner: "O" });
      return;
    }

    if (!winner) {
      for (let i = 1; i < 10; i++) {
        if (document.getElementById(`b${i}`).innerHTML == "") {
          isDraw = false;
          return;
        }
      }

      if (isDraw) {
        socket.emit("draw");
      }
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    socket.on("moveX", (data) => {
      console.log(data.id);
      setTurn((prevVal) => {
        return prevVal + 1;
      });
      document.getElementById(`${data.id}`).innerHTML =
        num % 2 == 0 ? "X" : "O";
      num++;
      console.log(turn);
      setTimeout(() => {
        checkWin();
      }, 300);
    });

    socket.on("winnerGame", ({ name }) => {
      if (!toast.isActive(toastId)) {
        // toast({
        //   title: `${name} won the game`,
        //   status: "success",
        //   duration: 2000,
        // });
        setPlayerWinner(name);
        onOpen();
      }

      socket.on("restartGame", () => {
        setTurn(1);
        num = 0;
        restartGame();
      });
    });

    socket.on("drawGame", () => {
      alert("DRAW");
    });

    console.log(id);
  }, []);

  useEffect(() => {
    socket.on("startGame", ({ playerArr }) => {
      console.log(playerArr);
    });
  }, []);

  const playAgain = () => {
    socket.emit("PlayAgain", { id });
  };

  const restartGame = () => {
    for (let i = 1; i < 10; i++) {
      document.getElementById(`b${i}`).innerHTML = "";
    }
    onClose();
  };

  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      display={"flex"}
      alignItems={"center"}
      flexDir={"column"}
      bgGradient={"linear-gradient(to right, #4b6cb7, #182848);"}
      color={"#f5f5f5"}
    >
      {/*  Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={"#4B6CB6"} color={"#f5f5f5"}>
          <ModalBody>
            <Box
              w={"100%"}
              h={"100%"}
              display={"flex"}
              flexDir={"column"}
              alignItems={"center"}
              gap={"2rem"}
            >
              <Text fontSize={"2rem"}>{playerWinner} won the game!</Text>
              <Button colorScheme="blue" onClick={playAgain}>
                Play again!
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/*  */}
      <Box fontSize={"2rem"} mb={"3rem"} marginTop={"2rem"} fontWeight={"800"}>
        <Text
          onClick={() => {
            onOpen();
          }}
        >
          Tic-Tac-Toe{" "}
        </Text>
      </Box>
      <Box
        w={{ lg: "25%", base: "40%" }}
        h={{ lg: "40%", base: "35%" }}
        display={"flex"}
        flexWrap={"wrap"}
        mt={"-1rem"}
        // gap={"1rem"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* b1 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          borderTopLeftRadius={"0.5rem"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b1"></Text>
        </Box>
        {/* b2 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b2"></Text>
        </Box>
        {/* b3 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          borderTopRightRadius={"0.5rem"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b3"></Text>
        </Box>
        {/* b4 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b4"></Text>
        </Box>
        {/* b5 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b5"></Text>
        </Box>
        {/* b6 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b6"></Text>
        </Box>
        {/* b7 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          borderBottomLeftRadius={"0.5rem"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b7"></Text>
        </Box>
        {/* b8 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b8"></Text>
        </Box>
        {/* b9 */}
        <Box
          w={{ lg: "6rem", base: "5rem" }}
          h={{ lg: "6rem", base: "5rem" }}
          bgColor={"#4b6cb7"}
          border={"1px solid #fff"}
          boxShadow={"0 0 2px #b1b1b1"}
          borderBottomRightRadius={"0.5rem"}
          onClick={(e) => {
            const boxId = e.target.children[0].id;
            socket.emit("markX", { id: boxId, roomId: id });
          }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={{ lg: "3rem", base: "2rem" }} id="b9"></Text>
        </Box>
      </Box>
      <Box
        position={"absolute"}
        bottom={{ base: "9rem", lg: "7rem" }}
        w={"100vw"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Text fontSize={"1.6rem"}>
          {turn % 2 != 0 ? <b>X</b> : <b>O</b>}'s turn
        </Text>
      </Box>
      <Box
        position={"absolute"}
        bottom={"4rem"}
        w={"100vw"}
        display={"flex"}
        justifyContent={"space-around"}
      >
        <Box>
          <Text fontSize={{ lg: "1.8rem", md: "1.6rem", base: "1.5rem" }}>
            Player 1 (You): {name}
          </Text>
        </Box>
        <Box>
          <Text fontSize={{ lg: "1.8rem", md: "1.6rem", base: "1.5rem" }}>
            Player 2 : {opponent}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
