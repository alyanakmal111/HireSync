// import React from "react";
// import { Button, notification, Space } from "antd";
// import { useNavigate } from "react-router-dom";
// const close = () => {
//   console.log(
//     "Notification was closed. Either the close button was clicked or duration time elapsed."
//   );
// };
// const Notify = () => {
//   const navigate = useNavigate();
//   const [api, contextHolder] = notification.useNotification();
//   const openNotification = () => {
//     const key = `open${Date.now()}`;
//     const btn = (
//       <Space>
//         <Button type="link" size="small" onClick={() => api.destroy()}>
//           Destroy All
//         </Button>
//         <Button type="primary" size="small" onClick={() => navigate("/")}>
//           Confirm
//         </Button>
//       </Space>
//     );
//     api.open({
//       message: "Notification Title",
//       description:
//         'A function will be be called after the notification is closed (automatically after the "duration" time of manually).',
//       btn,
//       key,
//       onClose: close,
//     });
//   };
//   return (
//     <>
//       {contextHolder}
//       <Button type="primary" onClick={openNotification}>
//         Open the notification box
//       </Button>
//     </>
//   );
// };
// export default Notify;
import React from "react";
import { ToastContainer, toast } from "react-toastify";

const Msg = ({ closeToast, toastProps }) => (
  <div>
    HEllo world {toastProps.position}
    <button>Retry</button>
    <button onClick={closeToast}>Close</button>
  </div>
);

function App() {
  const displayMsg = () => {
    toast(<Msg />);
    // toast(Msg) would also work
  };
  // displayMsg();
  return (
    <div>
      <button onClick={displayMsg}>Click me</button>
      <ToastContainer />
    </div>
  );
}
export default App;
