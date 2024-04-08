import { useEffect, useState } from "react";
import "regenerator-runtime/runtime";
import { useSpeechRecognition } from "react-speech-recognition";
import SpeechRecognition from "react-speech-recognition";

function SpeechRecoginizecreate() {
  const { transcript, resetTranscript } = useSpeechRecognition();
  const [recognitionResult, setRecognitionResult] = useState(null);

  const startListen = () => {
    if (window.hasOwnProperty("webkitSpeechRecognition")) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-UK";
      recognition.start();

      recognition.onresult = (e) => {
        const bestResult = e.results[0][0].transcript;

        console.log("Speech Result:", bestResult);
        // useEffect(() => {
        //   setrecognitionResult(bestResult);
        // }, [bestResult]);
        setRecognitionResult(bestResult);
      };

      recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
      };
    } else {
      console.error("The browser doesn't support webkitSpeechRecognition");
    }
  };
  const stopListen = () => {
    SpeechRecognition.stopListening();
  };
  const cleanResult = () => {
    setRecognitionResult(null);
  };

  // return recognitionResult;

  // return (
  //   <div>
  //     <button onClick={startListen}>Start Listening</button>
  //     <button onClick={stopListen}>Stop Listening</button>
  //     <p>Transcript: {recognitionResult}</p>
  //   </div>
  // );
  return {
    startListen,
    stopListen,
    cleanResult,
    recognitionResult,
  };
}
function Form({ addTask, FindMe }) {
  const [name, setName] = useState("Learn React");
  const [addition, setAddition] = useState(false);
    const { startListen, stopListen, cleanResult, recognitionResult } =
    SpeechRecoginizecreate();

  useEffect(() => {
    if (addition) {
      console.log("useEffect detected addtion");
      FindMe();
      setAddition(false);
    }
  });
    useEffect(() => {
    if (recognitionResult !== null) {
      setName(recognitionResult);
    }
  }, [recognitionResult]); // use effect, if recognitionResult is not null
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
        value={recognitionResult || name}
        onChange={handleChange}
      />
            <div className="btn-group">
        <button type="button" className="btn" onClick={startListen}>
          {" "}
          start recognize{" "}
        </button>
        <button type="button" className="btn" onClick={stopListen}>
          {" "}
          stop recognize{" "}
        </button>
        <button type="button" className="btn__danger" onClick={cleanResult}>
          {" "}
          just input{" "}
        </button>
      </div>
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
