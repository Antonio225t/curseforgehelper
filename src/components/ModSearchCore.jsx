import { useState } from "react";
import md5 from "js-md5";

import InputBox from "./InputBox";
import ModalButton from "./ModalButton";
import ModalDropdownButton from "./ModalDropdownButton";
import Modlist from "./Modlist";
import ModpackList from "./ModpackList";
import cross from "../icons/cross.webp";


function ModSearchCore() {
    const [fieldName, setFieldName] = useState("");
    const [modldr, setModldr] = useState(0);
    const [listaMods, setListaMods] = useState(false);
    const [aggiungiModpack, setAggiungiModpack] = useState(false);

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
                <ModalButton name={"Carica modpack JSON"} onClick={()=>{
                    setAggiungiModpack(!aggiungiModpack);
                }} />
            </div>
            <div className="modlist-container">
                <div className="modlist-containerp">
                    {listaMods ? <ModpackList searchFilter={fieldName} modLoaderType={modldr} /> : <Modlist searchFilter={fieldName} modLoaderType={modldr} />}
                </div>
                {aggiungiModpack ? (
                    <div className={"modlist-focusarea active"}>
                        <div className="modal-container">
                            <div className="modal-close-container">
                                <img className="modal-close" src={cross} alt={"X"} onClick={()=>{setAggiungiModpack(false);}} />
                            </div>
                            <input className="upload-box" type={"file"} accept={".json"} id={"fileImport"} />
                            <div className="modal-divisor"></div>
                            <div className="modal-center">
                                <ModalButton name={"Carica"} onClick={async ()=>{
                                    let mpacks = JSON.parse(localStorage.getItem("ch-savedModpacks"));
                                    let dom = document.getElementById("fileImport");
                                    if (dom) {
                                        [...dom.files].forEach(async (file)=>{
                                            let fjson;
                                            try {
                                                fjson = JSON.parse(await file.text());
                                                fjson.id = mpacks.length;
                                                mpacks.push(fjson);
                                                console.log(`Modpack con nome '${fjson.name}' v.${fjson.version} per Minecraft v.${fjson.gameVersion} aggiunto alla lista dei modpack con successo!`);
                                                localStorage.setItem("ch-savedModpacks", JSON.stringify(mpacks));
                                            } catch(_) {
                                                console.error(`Impossibile caricare il file '${file.name}'!\n` + _);
                                                alert(`Impossibile caricare il file '${file.name}'!\nGuarda la console con F12 o CTRL/COMMAND+SHIFT+I`);
                                                return;
                                            }
                                        });
                                    }
                                    setAggiungiModpack(false);
                                }} />
                            </div>
                        </div>
                    </div>
                ) : ""}
            </div>
        </div>
    );
}

export default ModSearchCore;