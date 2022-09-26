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
                                <div className="modal-listbox-item" key={item.id} onClick={()=>{console.log(item)}}>
                                    <span className="modal-moditem-name">{item.fileName}</span>
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