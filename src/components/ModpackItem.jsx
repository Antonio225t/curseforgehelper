import "../App.css";

const ModpackItem = ({data, clickCallback}) => {
    //console.log(data);

    return (
        <div className="moditem-container" onClick={()=>clickCallback(data)}>
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
    );
}

export default ModpackItem;