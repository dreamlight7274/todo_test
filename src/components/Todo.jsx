import { useState, useEffect, useCallback, useRef } from "react";
import Popup from "reactjs-popup";
// pop a message or a new screen
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db";

function Todo({
  name,
  completed = false,
  id,
  toggleTaskCompleted,
  // latitude,
  // longitude,
  location,
  photoedTask,
  deleteTask,
  editTask,
}) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  function handleChange(event) {
    setNewName(event.target.value);
  }
  // function handleChange(e) {
  //   setNewName(e.target.value);
  // }
  const WebcamCapture = ({ id }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [imgId, setImgId] = useState(null);
    const [photoSave, setPhotoSave] = useState(false);

    useEffect(() => {
      if (photoSave) {
        console.log("detect photoSave");
        photoedTask(imgId);
        setPhotoSave(false);
      }
    });
    console.log("WebcamCapture", id);

    const capture = useCallback(
      (id) => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        console.log("capture", imageSrc.length, id);
      },
      [webcamRef, setImgSrc]
    );
    // the function will be recreated when webcamref and setImgSrc have some changes

    const SavePhoto = (id, imgSrc) => {
      console.log("SavePhoto", id, imgSrc.length);
      addPhoto(id, imgSrc);
      setImgId(id);
      setPhotoSave(true);
    };

    const cancelPhoto = (id, imgSrc) => {
      console.log("cancelPhoto", id, imgSrc.length);
    };
    return (
      <>
        {!imgSrc && ( // before take a photo, camera will give a live vedio
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
        )}
        {imgSrc && ( // after take the photo, it will become a img
          <img src={imgSrc} />
        )}

        {/* the button */}
        <div className="btn-group">
          {!imgSrc && ( // no photo
            <button type="button" className="btn" onClick={() => capture(id)}>
              Capture photo
            </button>
          )}
          {imgSrc && ( // have such a photo
            <button
              type="button"
              className="btn"
              onClick={() => SavePhoto(id, imgSrc)}
            >
              Save Photo
            </button>
          )}
          <button
            type="button"
            className="btn todo-cancel"
            onClick={() => cancelPhoto(id, imgSrc)}
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  const ViewPhoto = ({ id }) => {
    // find the photo form the database and display it
    const imgSrc = GetPhotoSrc(id);
    return (
      <>
        <div>
          <img src={imgSrc} alt={name} />
        </div>
      </>
    );
  };
  function handleCancel() {
    setEditing(false);
    setNewName("");
  }
  function handleSubmit(event) {
    event.preventDefault();
    editTask(id, newName);
    // clean "new name"
    setNewName("");
    setEditing(false);
  }
  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={id}>
          New name for {name}
        </label>
        <input
          id={id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={handleChange}
        />
      </div>
      <div className="btn-group">
        {/* <button type="button" className="btn todo-cancel">
          Cancel
          <span className="visually-hidden">renaming {name}</span>
        </button> */}
        <button
          type="button"
          className="btn todo-cancel"
          // onClick={() => setEditing(false)}
          onClick={() => handleCancel()}
        >
          Cancel
          <span className="visually-hidden">renaming {name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small">
      <div className="c-cb">
        <input
          id={id}
          type="checkbox"
          defaultChecked={completed}
          onChange={() => toggleTaskCompleted(id)}
        />
        <label className="todo-label" htmlFor={id}>
          {name}
          {/* &nbsp; | la {latitude}
          &nbsp; | lo {longitude} */}
          <a href="{location.mapURL}">(map)</a>
          &nbsp; | &nbsp;
          <a href="{location.smsURL}">(sms)</a>
        </label>
      </div>
      <div className="btn-group">
        {/* <button type="button" className="btn">
          Edit <span className="visually-hidden">{name}</span>
        </button> */}
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{name}</span>
        </button>
        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              Take Photo{" "}
            </button>
          }
          modal
        >
          <div>
            <WebcamCapture id={id} photoedTask={photoedTask} />
          </div>
        </Popup>

        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              View Photo{" "}
            </button>
          }
          modal
        >
          {/* modal: unless close the screen the user can't do anything on the other screen */}
          <div>
            <ViewPhoto id={id} alt={name} />
          </div>
        </Popup>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => deleteTask(id)}
        >
          Delete <span className="visually-hidden">{name}</span>
        </button>
      </div>
    </div>
  );
  // return (
  //   <li className="todo stack-small">
  //     <div className="c-cb">
  //       <input
  //         id={id}
  //         type="checkbox"
  //         defaultChecked={completed}
  //         onChange={() => toggleTaskCompleted(id)}
  //       />
  //       <label className="todo-label" htmlFor={id}>
  //         {name}
  //       </label>
  //     </div>
  //     <div className="btn-group">
  //       <button type="button" className="btn">
  //         Edit <span className="visually-hidden">{name}</span>
  //       </button>
  //       <button
  //         type="button"
  //         className="btn btn__danger"
  //         onClick={() => deleteTask(id)}
  //       >
  //         Delete <span className="visually-hidden">{name}</span>
  //       </button>
  //     </div>
  //   </li>
  // );
  return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
}

export default Todo;
