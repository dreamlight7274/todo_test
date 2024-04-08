import { useState, useEffect, useCallback, useRef } from "react";
import Popup from "reactjs-popup";
// pop a message or a new screen
import "reactjs-popup/dist/index.css";
import Webcam from "react-webcam";
import { addPhoto, GetPhotoSrc } from "../db";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Todo({
  name,
  completed = false,
  id,
  toggleTaskCompleted,
  latitude,
  longitude,
  location,
  photo,
  deadline,
  photoedTask,
  deleteTask,
  editTask,
  addDeadline,
  deleteDeadline,
}) {
  // const [isEditing, setEditing] = useState(false);
  const [mode, setMode] = useState(0);
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
      setImgSrc(null);

    };
    return (
      <>
        {!imgSrc && ( // before take a photo, camera will give a live video
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
          {imgSrc && (<button
            type="button"
            className="btn todo-cancel"
            onClick={() => cancelPhoto(id, imgSrc)}
          >
            Cancel
          </button>)
          }
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
// the button to view the photo
    const viewphotoButton = photo ? (
    <button type="button" className="btn">
      {" "}
      View Photo{" "}
    </button>
  ) : (
    <button type="button" className="btn_nophoto" disabled>
      {" "}
      No Photo{" "}
    </button>
  );
  function handleCancel() {
    setMode(0);
    setNewName("");
  }
    function handleClockview() {
    setMode(2);
  }
    function backDefault() {
    setMode(0);
    // setsavDeadline(null);
  }
  function handleSubmit(event) {
    event.preventDefault();
    editTask(id, newName);
    // clean "new name"
    setNewName("");
    setMode(0);
  }
    const DeadlineDesign = ({ id }) => {
    // console.log(deadline);
    console.log(id);
    const [savdeadline, setsavDeadline] = useState(new Date());
    const [isSaveddeadline, setIsSaveddeadline] = useState(false);
    // const saveDeadlineRef = useRef();

    // const saveDeadline = useCallback(() => {
    //   addDeadline(id, savdeadline);
    //   setIsSaveddeadline(true);
    // }, [id]);
    const saveDeadline = () => {
      const finalsavedeadline = savdeadline.toString();
      addDeadline(id, finalsavedeadline);
      setIsSaveddeadline(true);
    };
    // const saveDeadline = useCallback(() => {
    //   addDeadline(id, savdeadline);
    //   setIsSaveddeadline(true);
    // }, [id]);

    // saveDeadlineRef.current = saveDeadline;

    // const handleSaveDeadlineClick = () => {
    //   saveDeadlineRef.current();
    // };
    return (
      <>
        <DatePicker
          selected={savdeadline}
          onChange={(date) => setsavDeadline(date)}
          // locale="en-GB"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={1}
          dateFormat="dd/MM/yyyy, HH:mm"
        />
        <div className="btn-group">
          {isSaveddeadline === false ? (
            <button type="button" className="btn" onClick={saveDeadline}>
              Save Deadline
            </button>
          ) : (
            <button
              type="button"
              className="btn__addedtime"
              onClick={saveDeadline}
            >
              Successfully!
            </button>
          )}
        </div>
      </>
    );
  };
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
          &nbsp; | la {latitude}
          &nbsp; lo {longitude}
          &nbsp; | &nbsp;
          <a href={location.mapURL}>(map)</a>
          {/* &nbsp; | la {latitude}
          &nbsp; | lo {longitude} */}
          {/*<a href={location.mapURL}>(map)</a>*/}
          {/*&nbsp; | &nbsp;*/}
          {/*<a href="{location.smsURL}">(sms)</a>*/}
        </label>
        {deadline !== null ? (
          <label className="todo-label" htmlFor={id}>
            {/* Deadline: {deadline.toString()} */}
            Deadline: {deadline}
          </label>
        ) : (
          <label className="todo-label" htmlFor={id}>
            (No deadline)
          </label>
        )}
      </div>
      <div className="btn-group">
        {/* <button type="button" className="btn">
          Edit <span className="visually-hidden">{name}</span>
        </button> */}
        <button type="button" className="btn" onClick={() => setMode(1)}>
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
          // trigger={
          //   <button type="button" className="btn">
          //     {" "}
          //     View Photo{" "}
          //   </button>
          // }
          trigger={viewphotoButton}
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
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => handleClockview()}>
          Notification <span className="visually-hidden">{name}</span>
        </button>
      </div>
    </div>
  );
    const alarmTemplate = (
    <div className="stack-small">
      {/* <SpeechRecoginizecreate /> */}
      <div className="c-cb">
        <input
          id={id}
          type="checkbox"
          defaultChecked={completed}
          onChange={() => toggleTaskCompleted(id)}
        />
        <label className="todo-label" htmlFor={id}>
          {name}
          {/* <a href={`https://www.google.com/maps/@${latitude},${longitude}`}>
            &nbsp; | la {latitude}
            &nbsp; | lo {longitude}
          </a> */}
          {/* {location.mapURL} */}
          &nbsp; | la {latitude}
          &nbsp; lo {longitude}
          &nbsp; | &nbsp;
          <a href={location.mapURL}>(map)</a>
          {/* &nbsp; | &nbsp; */}
          {/* <a href="{location.smsURL}">(sms)</a> */}
        </label>
        <label className="todo-label" htmlFor={id}>
          {/* Deadline: {deadline.toString()} */}
          {deadline !== null ? (
            <label className="todo-label" htmlFor={id}>
              {/* Deadline: {deadline.toString()} */}
              Deadline: {deadline}
            </label>
          ) : (
            <label className="todo-label" htmlFor={id}>
              (No deadline)
            </label>
          )}
        </label>
      </div>
      <div className="btn-group">
        {/* <button type="button" className="btn">
          Edit <span className="visually-hidden">{name}</span>
        </button> */}
        <Popup
          trigger={
            <button type="button" className="btn">
              {" "}
              set Deadline{" "}
            </button>
          }
          modal
        >
          <div>
            <DeadlineDesign id={id} photoedTask={photoedTask} />
          </div>
        </Popup>

        <button
          type="button"
          className="btn btn__danger"
          onClick={() => deleteDeadline(id)}
        >
          Delete Deadline<span className="visually-hidden">{name}</span>
        </button>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => backDefault()}>
          Back <span className="visually-hidden">{name}</span>
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
  // return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>;
    return (
    <li className="todo">
      {(() => {
        if (mode === 1) {
          return editingTemplate;
        } else if (mode === 0) {
          return viewTemplate;
        } else if (mode === 2) {
          return alarmTemplate;
        }
      })()}
    </li>
          );
}

export default Todo;
