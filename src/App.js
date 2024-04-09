import "./styles.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import GyroscopeScroll from "./components/GyroscopeScroll";
import schedule from "node-schedule";
import { deletePhoto } from "./db";



// ?: check, none return "undefined"

// (
//   <Todo
//     id={task.id}
//     name={task.name}
//     completed={task.completed}
//     key={task.id}
//   />
// ));
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};
const FILTER_NAMES = Object.keys(FILTER_MAP);

console.log(FILTER_NAMES);
export default function App({ tasks }) {
  // get the data from the local storage and save it in the state
  function usePersistTasks(key, defaultValue) {
    const [state, setState] = useState(
      () => JSON.parse(localStorage.getItem(key)) || defaultValue
    );
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(state));
    }, [key, state]);
    return [state, setState];
  }

  const [savtasks, setTasks] = usePersistTasks("tasks", []);
  // const [savtasks, setTasks] = useState(tasks);
  const [filter, setFilter] = useState("All");
  const [lastInsertedId, setLastInsertedId] = useState("");
  // hook for location

  // useEffect(() => {
  //   console.log(tasks[0]);
  // }, [tasks]);

  // function addTask(name1) {
  //   alert(name1);
  // }
  // function toggleTaskCompleted(id) {
  //   console.log(tasks[0]);
  // }
  // function toggleTaskCompleted(id) {
  //   const updatedTasks = tasks.map((task) => {
  //     // if this task has the same ID as the edited task
  //     if (id === task.id) {
  //       // use object spread to make a new object
  //       // whose `completed` prop has been inverted
  //       return { ...task, completed: !task.completed };
  //     }
  //     return task;
  //     // otherwise, just return the original task
  //   });
  //   setTasks(updatedTasks);
  //   console.log(tasks[0]);
  // }

  const [status, setStatus] = useState("");
  const [link, setLink] = useState("");

  function locateTask(id, location) {
    console.log("Locate task", id, "Before");
    console.log(location, savtasks);
    const locatedTaskList = savtasks.map((task) => {
      if (id === task.id) {
        return { ...task, location: location };
      }
      return task;
    });
    console.log(locatedTaskList);
    setTasks(locatedTaskList);
  }

  const FindMe = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`the position of you is ${latitude} and ${longitude}`);
    const linkcreate = `https://google.com/maps?q=${latitude},${longitude}`;

    // setlati(latitude);
    // setlogi(longitude);

    setStatus("");
    setLink(`https://google.com/maps?q=${latitude},${longitude}`);
    console.log(link);
    locateTask(lastInsertedId, {
      latitude: latitude,
      longitude: longitude,
      error: "",
      mapURL: linkcreate
      // mapURL: `https://google.com/maps?q=${latitude},${longitude}`
    });
  };

  const error = () => {
    setStatus("Unable to retrieve your location");
  };

  function drag(e, id) {
  e.dataTransfer.setData("text", id);
}
function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const taskElementId = e.dataTransfer.getData("text");

  const taskElement = document.getElementById(taskElementId);

  // remove the element from original space
  taskElement.remove();

  // drop the data to target space
  const dropArea = document.getElementById('div1');
  dropArea.appendChild(taskElement);
}
  function testNoti() {
    console.log("test noti");
    // may be need an approach to use sms
    if ("Notification" in window) {
      console.log("The browser supports notifications");
      Notification.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            console.log(
              "The browser has got the permission to send notifications"
            );
            // new Notification("deadline alarm", {
            //   body: `Task '${task.name}' will be due in 5 minutes`,
            // });
            new Notification("Notification test success");
          }
          if (permission === "denied") {
            console.log("User denied the permission to send notifications");
            // new Notification("deadline alarm", {
            //   body: `Task '${task.name}' will be due in 5 minutes`,
            // });
          }
        })
        .catch((error) => {
          console.error("System can't request permission:", error);
        });
    }
  }
  //

  // tasks solved

  function handleNotifications() {
    const addNotiTasks = savtasks.map((task) => {
      if (task.deadline) {
        const deadlineTime = new Date(task.deadline);
        const notificationTime = new Date(
          deadlineTime.getTime() - 5 * 60 * 1000
        );
        console.log("deadline", deadlineTime.toString());
        console.log("notificationTime", notificationTime.toString());
        const notificationJob = schedule.scheduleJob(
          task.id,
          notificationTime,

          function () {
            //   // if (
            //   //   "Notification" in window &&
            //   //   Notification.permission === "granted"
            //   // ) {
            //   // , {
            //   //   body: `Task '${task.name}' will be due in 5 minutes`,
            //   // }
            //   // const notification =
            // new Notification("deadline alarm");
            console.log("notification sent");
            new Notification("deadline alarm", {
              body: `Task '${task.name}' will be due in 5 minutes`,
            });
            // test can't be used inside the function

            //   // }
            // if (!("Notification" in window)) {
            //   // no service
            //   // alert("the browser does not support notifications");
            //   console.log("the browser does not support notifications");
            // } else if (Notification.permission === "granted") {
            //   // OK, The browser has got the permission to send notifications
            //   const notification = new Notification("deadline alarm", {
            //     body: `Task '${task.name}' will be due in 5 minutes`,
            //   });
            // } else if (Notification.permission !== "denied") {
            //   // try get the permission
            //   Notification.requestPermission().then((permission) => {
            //     if (permission === "granted") {
            //       const notification = new Notification("deadline alarm", {
            //         body: `Task '${task.name}' will be due in 5 minutes`,
            //       });
            //     }
            //   });
            // }

            //   console.log(
            //     `Notification for task '${task.name}' will be sent in the suitable time.`
            //   );
          }
        );
        // task.notiScheduleID = 1;
        return { ...task, notiScheduleID: task.id };
      }
      return task;
    });
    setTasks(addNotiTasks);
    localStorage.setItem("tasks", JSON.stringify(addNotiTasks));
    new Notification("notification is activated", {
      body: "The Notification will be published 5 minutes before the task's deadline",
    });
  }

  function cancelNotifications() {
    const cancelNotiTasks = savtasks.map((task) => {
      if (task.notiScheduleID) {
        schedule.cancelJob(task.notiScheduleID);
        console.log("notification job of ", task.name, " canceled");

        // task.notiScheduleID = 1;
        return { ...task, notiScheduleID: null };
      }
      return task;
    });
    setTasks(cancelNotiTasks);
    localStorage.setItem("tasks", JSON.stringify(cancelNotiTasks));
    new Notification("notification is canceled", {
      body: "The tasks of notification has been canceled",
    });
  }

  // useEffect(() => {
  //   const intervaljob = setInterval(() => {
  //     checkDeadline();
  //   }, 1000000); // check every one minutes

  //   return () => clearInterval(intervaljob);
  //   // no element, no interval job
  // }, []);

  // function checkDeadline() {
  //   const currentTime = new Date();

  //   // const maychangedTaskList = savtasks.map((task) => {
  //   //   // if this task has the same ID as the edited task
  //   //   if (task.deadline !== null) {
  //   //     timeRemaining = task.deadline - currentTime;
  //   //     console.log("timeRemaining", timeRemaining.toString());
  //   //     if (timeRemaining === 900000) {
  //   //       console.log("Task", task.name, "will be due in 15 minutes");
  //   //     }
  //   //     // Copy the task and update its name
  //   //     return task;
  //   //   }
  //   //   // Return the original task if it's not the edited task
  //   //   return task;
  //   // });
  //   savtasks.forEach((task) => {
  //     if (task.deadline !== null) {
  //       const changeddeadline = new Date(task.deadline);
  //       console.log(changeddeadline.toString());
  //       console.log(currentTime.toString());
  //       const timeRemaining = changeddeadline - currentTime;
  //       console.log("timeRemaining", timeRemaining.toString());
  //       if (timeRemaining < 900000) {
  //         console.log("Task", task.name, "will be due in 15 minutes");
  //       }
  //     }
  //   });
  //   // const mayupdatetasks = savtasks;
  //   // mayupdatetasks.forEach((task) => {
  //   //   if (task.deadline !== null) {
  //   //     timeRemaining = task.deadline - currentTime;
  //   //     if (timeRemaining < 900000 && task.ifalarm === false) {
  //   //       console.log("Task", task.name, "will be due in 15 minutes");
  //   //       task.ifalarm = true;
  //   //     }
  //   //   }
  //   // });
  //   // doesn't work because it lead to one savtasks
  //   // setTasks(maychangedTaskList);
  //   // becaus usestate is asynchronous, react will  combine the similar jobs
  //   // localStorage.setItem("tasks", JSON.stringify(maychangedTaskList));
  //   console.log("detect checking deadline");
  // }
  // tasks solved

  function toggleTaskCompleted(id) {
    const updatedTasks = savtasks.filter(FILTER_MAP[filter]).map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // use object spread to make a new object
        // whose `completed` prop has been inverted
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  }
  function editTask(id, newName) {
    const editedTaskList = savtasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        // Copy the task and update its name
        return { ...task, name: newName };
      }
      // Return the original task if it's not the edited task
      return task;
    });
    setTasks(editedTaskList);
    localStorage.setItem("tasks", JSON.stringify(editedTaskList));
  }

  function deleteTask(id) {
    // console.log(id);
    const cancelOneNotiTasks = savtasks.map((task) => {
      if (task.id === id && task.photo === true) {
        deletePhoto(task.id)
        console.log("photo in the database has been deleted")
      }
      if (task.id === id && task.notiScheduleID) {
        schedule.cancelJob(task.notiScheduleID);
        console.log("notification job of ", task.name, " canceled");

        // task.notiScheduleID = 1;
        return { ...task, notiScheduleID: null };
      }
      return task;
    });

    // console.log(id);
    const remainingTasks = cancelOneNotiTasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
    // leave the tasks with the different id
    localStorage.setItem("tasks", JSON.stringify(remainingTasks));
  }

  function addTask(name) {
    // latitude, (longitude = locateonetime());
    const newTask = {
      id: `todo-${nanoid()}`,
      name,
      completed: false,
      location: { latitude: "##", longitude: "##", error: "##", mapURL: "##" },
      photo: false,
      deadline: null,
      notiScheduleID: null,
    };

    // todo- and a random id
    setLastInsertedId(newTask.id);
    setTasks([...savtasks, newTask]);
    // add to the end of the array
    // create a new tasks array with the new task
    localStorage.setItem("tasks", JSON.stringify(savtasks));
    // localStorage.setItem("tasks", JSON.stringify([...savtasks, newTask]));
  }
  // const tasklist = tasks?.map((task) => task.name);

  function photoedTask(id) {
    console.log("Photoed task", id);
    const photoedTaskList = savtasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return { ...task, photo: true };
      }
      return task;
      // otherwise, just return the original task
    });
    console.log(photoedTaskList);
    setTasks(photoedTaskList);
    // localStorage.setItem("tasks", JSON.stringify(photoedTaskList));
    // miss in the lab, it should be saved in the localStorage
  }

    function addDeadline(id, date) {
    console.log("task added deadline", id);
    const deadlineTaskList = savtasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return { ...task, deadline: date };
      }
      return task;
    });
    console.log(deadlineTaskList);
    setTasks(deadlineTaskList);
  }

  function deleteDeadline(id) {
    console.log("task deleted deadline", id);
    const deadlineDeletedTaskList = savtasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        if (task.notiScheduleID) {
          schedule.cancelJob(task.notiScheduleID);
          console.log("notification job of ", task.name, " canceled");

          // task.notiScheduleID = 1;
          return { ...task, notiScheduleID: null };
        }

        return { ...task, deadline: null };
        console.log("deadline of ", task.name, " canceled");
      }
      return task;
    });
    console.log(deadlineDeletedTaskList);
    setTasks(deadlineDeletedTaskList);
  }

  const taskList = savtasks?.filter(FILTER_MAP[filter]).map((task) => (
    <div
      id={task.id+"-d"}
      draggable="true"
      onDragStart={(e) => drag(e, task.id+"-d")}
    >
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      latitude={task.location.latitude}
      longitude={task.location.longitude}
      location={task.location}
      photo={task.photo}
      deadline={task.deadline}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={editTask}
      addDeadline={addDeadline}
      deleteDeadline={deleteDeadline}
    />
    </div>
  ));
  const filterList = FILTER_NAMES.map((name) => (
    // <FilterButton key={name} name={name} />
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  // three buttons upon
  // 1 is task, more than 1 is tasks
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  return (
    // <div className="App">
    //   <h1>Hello CodeSandbox</h1>
    //   <h2>Start editing to see some magic happen!</h2>
    // </div>

    <div className="todoapp stack-large">
      <h1>Todo-List ++</h1>
      <GyroscopeScroll />
       <label className="label__lg">
          What is necessary
        </label>

<div id="div1" className="drop-area" onDrop={(e) => drop(e)} onDragOver={(e) => allowDrop(e)}></div>
      {/* <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {tasklist}
      </ul> */}
      {/* <form>
        <h2 className="label-wrapper">
          <label htmlFor="new-todo-input" className="label__lg">
            What needs to be done?
          </label>
        </h2>
        <input
          type="text"
          id="new-todo-input"
          className="input input__lg"
          name="text"
          autoComplete="off"
        />
        <button type="submit" className="btn btn__primary btn__lg">
          Add
        </button>
      </form> */}
      <Form addTask={addTask} FindMe={FindMe} />
      <div className="filters btn-group stack-exception">
        {/* <button type="button" className="btn toggle-btn" aria-pressed="true">
          <span className="visually-hidden">Show </span>
          <span>all</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className="btn toggle-btn" aria-pressed="false">
          <span className="visually-hidden">Show </span>
          <span>Active</span>
          <span className="visually-hidden"> tasks</span>
        </button>
        <button type="button" className="btn toggle-btn" aria-pressed="false">
          <span className="visually-hidden">Show </span>
          <span>Completed</span>
          <span className="visually-hidden"> tasks</span>
        </button> */}
        {/* <FilterButton />
        <FilterButton />
        <FilterButton /> */}
        {filterList}
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={testNoti}>
          {" "}
          test Notification{" "}
        </button>
        <button type="button" className="btn" onClick={handleNotifications}>
          {" "}
          Set Notification{" "}
        </button>
        <button
          type="button"
          className="btn__danger"
          onClick={cancelNotifications}
        >
          {" "}
          close Notification{" "}
        </button>
      </div>
      <p>The notification system is currently working only on the PC browsers</p>

      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {/* <li className="todo stack-small">
          <div className="c-cb">
            <input id="todo-0" type="checkbox" defaultChecked />
            <label className="todo-label" htmlFor="todo-0">
              Eat
            </label>
          </div>
          <div className="btn-group">
            <button type="button" className="btn">
              Edit <span className="visually-hidden">Eat</span>
            </button>
            <button type="button" className="btn btn__danger">
              Delete <span className="visually-hidden">Eat</span>
            </button>
          </div>
        </li> */}
        {/* <Todo name="Eat" id="todo-0" completed />
        <Todo name="Sleep" id="todo-1" />
        <Todo name="Repeat" id="todo-2" /> */}
        {taskList}
      </ul>
    </div>
  );
}
