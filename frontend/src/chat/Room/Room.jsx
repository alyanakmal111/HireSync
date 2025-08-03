import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { appid, secret } from "../Room/helper";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../../websocketprovider";
import { useEffect, useRef } from "react";
import { notification } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "./room.css";
// import { k } from "vite/dist/node/types.d-jgA8ss1A";

const Room = () => {
  const Navigate = useNavigate();
  const { roomid } = useParams();
  const [api, contextHolder] = notification.useNotification();
  const { socket } = useWebSocket();
  const customId = "custom-id-yes";
  const { addUser } = useWebSocket();
  var opendata = {};
  ///////////
  // const close = () => {
  //   console.log(
  //     "Notification was closed. Either the close button was clicked or duration time elapsed."
  //   );
  // };
  // const openNotification = (data) => {
  //   const key = `open${Date.now()}`;
  //   notification.config({
  //     maxCount: 1,
  //   });
  //   api.open({
  //     message: "Call rejected",
  //     description: `${data.senderName} has rejected the video call`,
  //     key,
  //     duration: 20,
  //     maxCount: 1,
  //     onClose: close,
  //   });
  // };

  const Msg = ({ closeToast, toastProps }) => (
    <div>
      {opendata.senderName} has rejected the call
      <br></br>
      <button className="button-3" onClick={closeToast}>
        Close
      </button>
    </div>
  );
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = socket;
    if (socketRef.current) {
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log(socket);
      socketRef.current.on("connect", () => {
        console.log("Connected to server");
        console.log(socket);
        addUser(userData._id);
      });
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from server");
      });
      socketRef.current.on("recieve-rej", (data) => {
        opendata = data;
        console.log("Received rejection:", data);
        toast(<Msg />, {
          toastId: customId,
        });
        // openNotification(data);
      });
    }
  }, [socket]);
  ///////////////////////////

  const user = JSON.parse(localStorage.getItem("user"));

  const myLiveStream = async (element) => {
    // generate Kit Token
    // useEffect(() => {
    const appID = appid;
    const serverSecret = secret;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomid,
      Date.now().toString(),
      `${user.name}`
    );

    //create instance for live room

    var zc = ZegoUIKitPrebuilt.create(kitToken);

    // join room function
    console.log(zc);
    // }, []);
    zc.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Copy link",
          url: `http://localhost:5173/user/room/${roomid}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showLeavingView: false,
      showPreJoinView: false,
      showLeaveRoomConfirmDialog: false,

      onLeaveRoom: () => {
        zc.hasJoinedRoom = false;
        zc.root = undefined;
        console.log("hum chaly home screen pay ");
        // zc.hangUp();
        // zc.destroy();
        // zc.destroy;
        ////////////////
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(function (stream) {
            // Access the camera and audio stream tracks
            const tracks = stream.getTracks();

            // Loop through each track and stop it
            tracks.forEach(function (track) {
              track.stop(); // Stop the track (camera or audio)
            });
          })
          .catch(function (error) {
            console.error("Error accessing camera and audio:", error);
          });
        /////////////////
        Navigate("/chat");
        window.location.reload();
        console.log(zc);
        console.log("left room");
      },
    });
  };
  return (
    <>
      {contextHolder}
      <ToastContainer autoClose={20000} />
      <div ref={myLiveStream}>
        <center>
          {" "}
          <h1>Rating</h1>
        </center>
      </div>
    </>
  );
};

export default Room;
