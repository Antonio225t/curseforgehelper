import ModSearchCore from "./components/ModSearchCore";
import "./App.css";

function App() {

  window.filescache = {};
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
