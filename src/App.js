import React from "react";
import "./App.css";
import io from "socket.io-client";
import { useState, useEffect, useCallback } from "react";

function App() {
  const [dataValue = { userId: "", url: "" }, setDataValue] = useState();
  const [socketApi2, setSocketApi2] = useState(null);
  const [inprocess = false, setInprocess] = useState();
  const [noti = false, setNoti] = useState();
  const [message, setMessage] = useState();
  const _onChange = useCallback(
    (e) => {
      const obj = Object.assign(dataValue);
      const { name, value } = e.target;
      obj[name] = value;
      setDataValue({
        userId: obj.userId,
        url: obj.url,
      });
    },
    [dataValue, setDataValue]
  );
  const _setValueSocket = useCallback(() => {
    let socketApp = io("http://localhost:4000");
    socketApp.on("connect", function () {});
    socketApp.on("event", function (data) {});
    socketApp.on("disconnect", function () {});
    socketApp.on("notification", (data) => {
      if (data) {
        setNoti(true);
      }
    });
    setSocketApi2(socketApp);
  }, [setSocketApi2, setNoti]);
  useEffect(() => {
    _setValueSocket();
    if (noti) {
      setMessage("Defaced");
    }
  }, [_setValueSocket, noti, message]);
  const _onClick = useCallback(() => {
    console.log(dataValue);
    socketApi2.emit("createChecked", dataValue);
    setInprocess(true);
    socketApi2.emit("requestCheckedFirst", dataValue);
    socketApi2.on("createChecked", (data, socket) => {
      console.log(data);
    });
    setInterval(function () {
      socketApi2.emit("responseChecked", dataValue);
    }, 60000);
    socketApi2.on("notification", (data) => {
      console.log(data);
    });
  }, [socketApi2, dataValue, setInprocess]);

  return (
    <div className="App">
      <header className="App-header">
        <form>
          <label htmlFor="userId">User Id</label>
          <br />
          <input
            name="userId"
            value={dataValue.userId || ""}
            onChange={_onChange}
          />
          <br />
          <label htmlFor="label">Url</label>
          <br />
          <input name="url" value={dataValue.url || ""} onChange={_onChange} />
          <br />
          {!inprocess ? (
            <button type="button" onClick={_onClick}>
              Confirm
            </button>
          ) : (
            <button type="button" disabled>
              Confirm
            </button>
          )}
        </form>
        <h1>{message}</h1>
      </header>
    </div>
  );
}

export default App;
