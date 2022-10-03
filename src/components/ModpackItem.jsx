import cross from "../icons/cross.webp";
import "../App.css";

const ModpackItem = ({data, clickCallback, index, onDelete}) => {
    //console.log(data);

    return (
        <div className="moditem-container modpack-space" onClick={(e)=>{
            if (e.target.className==="modpack-close"||e.target.className==="modal-close") {
                onDelete();
                return;
            }
            clickCallback(data);
        }}>
            <div className="modpack-container">
                <img className="moditem-avatar" alt={"?"} src={data.icon} />
                <div className="moditem-description-container">
                    <span className="moditem-name" title={data.description}>{data.name}</span>
                </div>
                <div className="moditem-divisor"></div>
                <div className="moditem-info">
                    {data.modLoader===1 ? <code className="moditem-prop" title={"Modpack con Forge"}>Forge</code> : ""}
                    {data.modLoader===4 ? <code className="moditem-prop" title={"Modpack con Fabric"}>Fabric</code> : ""}
                    <code className="moditem-prop" title={"Versione del Modpack"}>Modpack: {data.modpackVersion}</code>
                    <code className="moditem-prop" title={"Versione di Minecraft"}>Minecraft: {data.gameVersion}</code>
                    <code className="moditem-prop" title={"Mods totali"}>Mods: {data.mods.length}</code>
                </div>
            </div>
            <div className="modpack-close" onClick={onDelete}>
                <img className="modal-close" alt={"X"} src={cross} />
            </div>
        </div>
    );
}

export default ModpackItem;