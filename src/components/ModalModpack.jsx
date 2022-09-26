import cross from "../icons/cross.webp";
import infoI from "../icons/info i.png";
import loading from "../icons/loading1.gif";

import ModalButton from "./ModalButton";
import { useState } from "react";
import JSZip from "jszip";
import FileSaver from "file-saver";

function Modal({data, onClose}) {

    const [loadingFiles, setLoadingFiles] = useState(false);

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
                <ModalButton name={loadingFiles ? "Caricamento..." : "Scarica mods ZIP"} icon={loadingFiles ? loading : infoI} disabled={loadingFiles} onClick={()=>{
                    setLoadingFiles(true);
                    async function fetchMod(url) {
                        return new Promise((resolve)=>{
                            fetch(url)
                            .then(resp=>{return resp.blob()}).then(resp=>{
                                resolve(resp);
                            });
                        });
                    }
                    const zipfile = new JSZip();
                    data.mods.forEach(async (mod)=>{
                        zipfile.file(mod.fileName, await fetchMod(mod.download));
                    });
                    zipfile.generateAsync({ type: 'blob' }).then(function (content) {
                        FileSaver.saveAs(content, data.name+".zip");
                    });
                    setLoadingFiles(false);
                }} title={"Scarica un file ZIP contenenti tutte le mod del modpack."} />
            </div>
            {data.mods.length>0 && !loadingFiles ? (
                <>
                    <div className="modal-listbox">
                        {data.mods.map(item=>{
                            return (
                                <div className="modal-listbox-item" key={item.fileId}>
                                    <span className="modal-moditem-name">{item.fileName}</span>
                                </div>
                            );
                        })}
                    </div>
                    <center><span>Mods totali: {data.mods.length}</span></center>
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