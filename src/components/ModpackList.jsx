import ModpackItem from "./ModpackItem";
import ModalModpack from "./ModalModpack";
import { useState } from "react";


function ModpackList({searchFilter, modLoaderType}) {

    const [focusedModpack, setFocusedModpack] = useState(void 0);
    const [modpacks, setModpacks] = useState(JSON.parse(localStorage.getItem("ch-savedModpacks")));
    var i = -1;
    
    /*/var Modpack = {
        "name": "Modpacktest",
        "modLoader": 4,
        "mods": [
            {
                "modId": 238222,
                "fileId": 3969092,
                "download": "https://edge.forgecdn.net/files/3969/92/jei-1.18.2-9.7.2.264.jar",
                "fileName": "jei-1.18.2-9.7.2.264.jar"
            }
        ],
        "description": "An awsome modpack",
        "icon": "https://media.discordapp.net/attachments/658680089877413908/917169416037355520/trigger.gif",
        "gameVersion": "1.19.2",
        "modpackVersion": "1.0.0",
        "id": 0
    }/*/

    return (
        <div className="modlist-container">
            <div className="modlist-containerp">
                {modpacks.map(e=>{
                    i++;
                    e.id = i;
                    return modLoaderType===0 || e.modLoader===modLoaderType ? (
                        <ModpackItem key={Math.random()*9999} index={i} data={e} clickCallback={(d)=>{
                            setFocusedModpack(d);
                        }} onDelete={()=>{
                            var items = JSON.parse(localStorage.getItem("ch-savedModpacks"));
                            items.splice(e.id, 1);
                            localStorage.setItem("ch-savedModpacks", JSON.stringify(items));
                            setModpacks(items);
                        }} />
                    ) : "";
                })}
            </div>
            <div className={"modlist-focusarea " + (focusedModpack ? "active" : "")}>
                {focusedModpack ? <ModalModpack data={focusedModpack} onClose={()=>{
                    setFocusedModpack(void 0);
                }} /> : ""}
            </div>
        </div>
    );
}

ModpackList.defaultProps = {
    "searchFilter":"",
    "modLoaderType":0
}

export default ModpackList;