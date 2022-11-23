import ModSearchCore from "./components/ModSearchCore";
import "./App.css";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    window.filescache = {};
    document.title = "Curseforge Helper";
  });
  if (!localStorage.getItem("ch-savedModpacks")) localStorage.setItem("ch-savedModpacks", "[]");
  return (
    <>
      <div style={{"padding":"10px"}}>
        <ModSearchCore />
      </div>
    </>
  );
}

export default App;
