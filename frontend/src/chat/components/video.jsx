import React from "react";
import { useNavigate } from "react-router-dom";
import { BiPowerOff, BiVideo } from "react-icons/bi";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
export default function Video({ socket, currentChat }) {
  // const socket = useRef();
  const Navigate = useNavigate();
  const handleClick = async () => {
    console.log(currentChat);
    const user = await JSON.parse(localStorage.getItem("user"));
    const { _id, name } = user;
    console.log(socket);
    // socketdisconnect();
    const roomid = currentChat._id + "" + _id;
    console.log(roomid);
    socket.emit("send-noti", {
      to: currentChat._id,
      from: _id,
      msg: { roomid: roomid, senderid: _id, senderName: name },
    });
    Navigate(`/room/${roomid}`);
    // const data = await axios.get(`${logoutRoute}/${id}`);
    // if (data.status === 200) {
    //   localStorage.clear();
    //   navigate("/");
    // }
  };
  return (
    <Button onClick={handleClick}>
      <BiVideo />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  margin-left: auto;
  margin-right: 5px;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
`;
