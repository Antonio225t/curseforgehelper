import { useState } from "react";
import md5 from "js-md5";

import InputBox from "./InputBox";
import ModalButton from "./ModalButton";
import ModalDropdownButton from "./ModalDropdownButton";
import Modlist from "./Modlist";
import ModpackList from "./ModpackList";


function ModSearchCore() {
    const [fieldName, setFieldName] = useState("");
    const [modldr, setModldr] = useState(0);
    const [listaMods, setListaMods] = useState(false);

    async function test() {
        try {
            await fetch("https://curseforge-files.antonio225.repl.co/");
        } catch(_){}
    }
    test();
    ["dragenter", "dragleave", "dragover"].forEach((ev)=>{
        document[ev] = (e)=>{
            e.preventDefault();
            e.stopPropagation();
        }
    });
    document.ondrop = (e)=>{
        e.preventDefault();
        e.stopPropagation();
        [...e.dataTransfer.files].forEach(async (file)=>{
            let reader = new FileReader();
            console.log(file.name.toLowerCase().endsWith(".json"), file)
            if (file.name.toLowerCase().endsWith(".json")) { // Loads JSON files for modpack sharings.
                reader.onload = async (r)=>{
                    let dec = new TextDecoder();
                    let plainText = dec.decode(r.target.result);
                    let jsonForm;
                    try {
                        jsonForm = JSON.parse(plainText);
                    } catch(_){
                        return new Error("Il file " + file + " non è un modpack valido!");
                    }
                    let mpacks = JSON.parse(localStorage.getItem("ch-savedModpacks"));
                    jsonForm.id = mpacks.length-1;
                    mpacks.push(jsonForm);
                    localStorage.setItem("ch-savedModpacks", JSON.stringify(mpacks));
                    console.log("Aggiunto modpack " + jsonForm.name + " alla lista dei modpack con ID: " + jsonForm.id + "!\nContenuto:",jsonForm);
                };
            } else if (file.name.toLowerCase().endsWith(".jar")) { // Loads JAR files for searching the mods (not working).
                reader.onload = async (r)=>{
                    var hash = md5.create();
                    hash = hash.update(r.target.result);
                    console.log(hash.hex());
                };
            }
            reader.readAsArrayBuffer(file);
        });
    }

    return (
        <div className="modsearchcore-container">
            <div className="modsearchcore-fields">
                <InputBox onEnter={(text)=>{setFieldName(text)}} enterBlur={false} placeholder={"Cerca"} width={300} />
                <ModalDropdownButton items={["Tutti", "Forge", "Fabric", "Quilt", "Cauldron", "LiteLoader"]} defaultItem={"Tutti"} onItemSelect={(item)=>{
                    if (item==="Tutti") setModldr(0);
                    else if (item==="Forge") setModldr(1);
                    else if (item==="Cauldron") setModldr(2);
                    else if (item==="LiteLoader") setModldr(3);
                    else if (item==="Fabric") setModldr(4);
                    else if (item==="Quilt") setModldr(5);
                }} />
                <ModalButton name={listaMods ? "Cerca mods" : "Lista modpacks"} onClick={()=>{
                    setListaMods(!listaMods);
                }} />
            </div>
            {listaMods ? <ModpackList searchFilter={fieldName} modLoaderType={modldr} /> : <Modlist searchFilter={fieldName} modLoaderType={modldr} />}
        </div>
    );
}

export default ModSearchCore;