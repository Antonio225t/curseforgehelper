import cross from "../icons/cross.webp";
import infoI from "../icons/info i.png";
import loading from "../icons/loading1.gif";

import ModalButton from "./ModalButton";
import { useState } from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";

function Modal({data, onClose}) {

    const [loadingFiles, setLoadingFiles] = useState(false);
    const [mammamia, setMammamia] = useState(void 0); //Eh, devo fare così per settare modpack che sennò non lo fa per qualche ragione ancora sconosciuta :(
    const [modpack, setModpack] = useState(data);

    if (mammamia) {
        setModpack(mammamia);
        setMammamia(void 0);
    }

    return (
        <div className="modal-container">
            <div className="modal-close-container">
                <img className="modal-close" src={cross} alt={"X"} onClick={onClose} />
            </div>
            <div className="modal-center">
                <img className="modal-icon-32" src={data.icon} alt={"?"} />
                <h3 className="no-margin">{data.name}</h3>
            </div>
            <div className="modal-divisor"></div>
            <div className="modal-center">
                <ModalButton name={loadingFiles ? "Caricamento..." : "Scarica file JSON"} icon={loadingFiles ? loading : infoI} disabled={loadingFiles} onClick={async ()=>{
                    let a = document.createElement("a");
                    a.href = "data:application/octet-stream," + JSON.stringify(data);
                    a.download = data.name+".json";
                    a.click();
                }} title={"Scarica il file JSON del modpack in modo da essere condiviso."} />
                <ModalButton name={loadingFiles ? "Caricamento..." : "Scarica mods ZIP"} icon={loadingFiles ? loading : infoI} disabled={loadingFiles} onClick={async ()=>{
                    setLoadingFiles(true);
                    async function fetchMod(url) {
                        return new Promise((resolve)=>{
                            fetch("https://curseforge-files.antonio225.repl.co/?url="+url)
                            .then(resp=>{return resp.blob()}).then(resp=>{
                                resolve(resp);
                            });
                        });
                    }
                    const zipfile = new JSZip();
                    for (let mod of data.mods) {
                        zipfile.file(mod.fileName, await fetchMod(mod.download));
                    }
                    zipfile.generateAsync({ type: 'blob' }).then(function (content) {
                        FileSaver.saveAs(content, data.name+".zip");
                    });
                    setLoadingFiles(false);
                }} title={"Scarica un file ZIP contenenti tutte le mod del modpack."} />
            </div>
            {modpack.mods.length>0 && !loadingFiles ? (
                <>
                    <div className="modal-listbox">
                        {modpack.mods.map((item)=>{
                            return (
                                <div className="modal-listbox-itemmodpack" key={item.fileId}>
                                    <span className="modal-moditem-name">{item.fileName}</span>
                                    <div className="modal-mpack-downlaod">
                                        <ModalButton name={"Scarica"} title={"Scarica la mod."} onClick={()=>{
                                            window.open(item.download);
                                        }} />
                                        <img className="modal-close" alt={"X"} src={cross} onClick={()=>{
                                            const items = JSON.parse(localStorage.getItem("ch-savedModpacks"));
                                            modpack.mods.splice(modpack.mods.map(e=>{return e.fileId}).indexOf(item.fileId), 1);
                                            items[modpack.id] = modpack;
                                            localStorage.setItem("ch-savedModpacks", JSON.stringify(items));
                                            setMammamia(items[modpack.id]);
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <center><span>Mods totali: {modpack.mods.length}</span></center>
                </>
            ) : ""}
        </div>
    )
}

Modal.defaultProps = {
    "data": {},
    "onClose": ()=>{},
    "index":0
}

export default Modal;