import cross from "../icons/cross.webp";
import ModalButton from "./ModalButton";

import curseforge from "../icons/curseforge.png";
import infoI from "../icons/info i.png";
import loading from "../icons/loading1.gif";
import { useState } from "react";
import ModalDropdownButton from "./ModalDropdownButton";

function Modal({data, onClose}) {

    const [dataLoad, setDataLoad] = useState(void 0);
    const [loadingFiles, setLoadingFiles] = useState(false);

    //Filter per modlist
    const [gamever, setGamever] = useState("Tutte");
    const [relver, setRelver] = useState("Tutte");

    var versions = ["Tutte"];
    //var moddata = void 0;

    if (dataLoad && !window.filescache[data.id]) {
        /*/moddata = {};
        for (let file of dataLoad.data) {
            
        }/*/
        window.filescache[data.id] = dataLoad;
    } else if (!dataLoad && window.filescache[data.id]) {
        setDataLoad(window.filescache[data.id]);
    }

    var mpacksi = JSON.parse(localStorage.getItem("ch-savedModpacks"));
    var mpacks = [];
    let i=0;
    for (let pack of mpacksi) {
        mpacks.push([i, pack]);
        i++;
    }

    if (dataLoad) {
        //console.log(dataLoad);

        dataLoad.data.forEach((item)=>{
            item.gameVersions.forEach((version)=>{
                if (!versions.includes(version)) {
                    versions.push(version);
                }
            });
        });
    }

    return (
        <div className="modal-container">
            <div className="modal-close-container">
                <img className="modal-close" src={cross} alt={"X"} onClick={onClose} />
            </div>
            <div className="modal-center">
                <img className="modal-icon-32" src={data.logo?.url} alt={"?"} />
                <h3 className="no-margin">{data.name}</h3>
            </div>
            <div className="modal-divisor"></div>
            <div className="modal-center">
                <ModalButton name={"Curseforge"} icon={curseforge} onClick={()=>{window.open(data.links.websiteUrl)}} title={"Reindirizzamento a curseforge"} />
                <ModalButton name={loadingFiles ? "Caricamento..." : "Carica info"} icon={loadingFiles ? loading : infoI} disabled={dataLoad || loadingFiles ? true : false} onClick={async ()=>{
                    setLoadingFiles(true);
                    async function fetchLoad(index) {
                        return new Promise(resolve=>{
                            index = index || 0;
                            fetch("https://api.curseforge.com/v1/mods/"+data.id+"/files?pageSize="+index, {method:"GET",headers:{"Accept": "application/json", "x-api-key":"$2a$10$g4AxMnvx.UK708X844lqL.6HswJJZBZ11mDDxPU420eEj93RI0Whe"}})
                            .then(resp=>{return resp.json()}).then(resp=>{
                                resolve(resp);
                            });
                        });
                    }
                    var r = await fetchLoad();
                    setDataLoad(await fetchLoad(r.pagination.totalCount));
                    setLoadingFiles(false);
                }} title={"Carica le informazioni della mod per verificare completamente il suo stato di supporto."} />
                {dataLoad ? (
                    <>
                        <ModalDropdownButton prefix={"Versioni: "} items={versions} onItemSelect={(item)=>{
                            setGamever(item);
                        }} />
                        <ModalDropdownButton prefix={"Rilascio: "} items={["Tutte", "Stabili", "Alpha", "Beta"]} onItemSelect={(item)=>{
                            setRelver(item);
                        }} />
                    </>
                ) : ""}
            </div>
            {dataLoad ? (
                <>
                    <div className="modal-listbox">
                        {dataLoad.data.map(item=>{
                            return ![gamever === "Tutte" ? true : item.gameVersions.includes(gamever), relver === "Tutte" ? true : (relver==="Stabili" ? item.releaseType===1 : (relver==="Beta" ? item.releaseType===2 : relver==="Alpha" ? item.releaseType===3 : false))].includes(false) ? (
                                <div className="modal-listbox-item" key={item.id}>
                                    <div className="modal-listbox-item-2">
                                        <span className="modal-moditem-name">{item.fileName}</span>
                                        <ModalDropdownButton alwaysShow={"..."} items={["Nuovo", ...mpacks.map((tem)=>{return tem[1].name+" "+tem[0];})]} onItemSelect={(tem)=>{
                                            let mod = {"download":item.downloadUrl,"fileId":item.id,"modId":item.modId,"fileName":item.fileName};
                                            if (tem==="Nuovo") {
                                                console.log(item)
                                                let gameVer = item.gameVersions.filter((ee)=>{return ee.includes(".")})[0];
                                                let modLoader = item.gameVersions.filter((ee)=>{return !ee.includes(".")})[0];
                                                modLoader = modLoader==="Forge" ? 1 : modLoader==="Cauldron" ? 2 : modLoader==="LiteLoader" ? 3 : modLoader==="Fabric" ? 4 : modLoader==="Quilt" ? 5 : 0;
                                                let mpack = {name:window.prompt("Inserisci il nome del modpack."),modLoader:modLoader,mods:[mod],description:"",icon:"https://docs.curseforge.com/images/favicon-77e794e5.ico",gameVersion:gameVer,modpackVersion:"0.1"}
                                                mpack.id = mpacksi.length-1;
                                                mpacksi.push(mpack);
                                                localStorage.setItem("ch-savedModpacks", JSON.stringify(mpacksi));

                                                console.log("Aggiunto "+item.fileName+" al modpack "+mpack.name+" che è stato appena definito dall'utente e salvato nello storage locale!");
                                                return;
                                            }
                                            const index = tem.split(" ")[tem.split(" ").length-1];
                                            mpacksi[index].mods = mpacksi[index].mods.filter((e)=>{return e.modId!==mod.modId});
                                            mpacksi[index].mods.push(mod);
                                            localStorage.setItem("ch-savedModpacks", JSON.stringify(mpacksi));
                                            console.log("Aggiunto "+item.fileName+" al modpack "+mpacksi[index].name+"!");
                                        }} />
                                    </div>
                                    <div className="modal-moditem-versions">
                                        {item.gameVersions.map(version=>{
                                            return <code key={Math.random()*9999} className="moditem-prop moditem-prop-inmodal">{version}</code>
                                        })}
                                        {item.releaseType===2 ? <code className="moditem-prop moditem-prop-inmodal moditem-prop-beta">Beta</code> : ""}
                                        {item.releaseType===3 ? <code className="moditem-prop moditem-prop-inmodal moditem-prop-alpha">Alpha</code> : ""}
                                    </div>
                                </div>
                            ) : "";
                        })}
                    </div>
                    <center><span>File totali: {dataLoad.pagination.totalCount}</span></center>
                </>
                ) : ""}
        </div>
    )
}

Modal.defaultProps = {
    "data": {},
    "onClose": ()=>{}
}

export default Modal;