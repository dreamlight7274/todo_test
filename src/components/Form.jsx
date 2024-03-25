import { useEffect, useState } from "react";
function Form({ addTask, FindMe }) {
  const [name, setName] = useState("Learn React");
  const [addition, setAddition] = useState(false);

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addtion");
      FindMe();
      setAddition(false);
    }
  });
  // a trigger to make the locating work
  //   function handleChange() {
  //     console.log("Typing!");
  //   }

  // useEffect(() => {
  //   if (addition) {
  //   }
  // });

  function handleChange(event) {
    setName(event.target.value);
  }
  //   function handleSubmit(event) {
  //     event.preventDefault();
  //     addTask("Hello");
  //   }
  function handleSubmit(event) {
    event.preventDefault();
    setAddition(true);
    addTask(name);
    setName("");
  }
  return (
    <form onSubmit={handleSubmit}>
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
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
