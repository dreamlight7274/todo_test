import "./styles.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
// import locateonetime from "./components/Locateonetime";

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
    const remainingTasks = savtasks.filter((task) => id !== task.id);
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
      // photo: false,
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
  const taskList = savtasks?.filter(FILTER_MAP[filter]).map((task) => (
    <Todo
      id={task.id}
      name={task.name}
      completed={task.completed}
      key={task.id}
      // latitude={task.location.latitude}
      // longitude={task.location.longitude}
      location={task.location}
      toggleTaskCompleted={toggleTaskCompleted}
      photoedTask={photoedTask}
      deleteTask={deleteTask}
      editTask={editTask}
    />
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
      <h1>TodoMatic</h1>
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
