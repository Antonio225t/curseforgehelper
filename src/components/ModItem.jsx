import "../App.css";

const ModItem = ({data, clickCallback}) => {
    //console.log(data);

    var forge = false;
    var fabric = false;
    var mcvers = [];
    //var server = false;

    //Checking stuff
    forge = data.latestFilesIndexes.filter(e=>{return e.modLoader===1}).length>0;
    fabric = data.latestFilesIndexes.filter(e=>{return e.modLoader===4}).length>0;
    data.latestFilesIndexes.forEach(e=>{
        if (!mcvers.includes(e.gameVersion)) {
            mcvers.push(e.gameVersion);
        }
    });

    return (
        <div className="moditem-container" onClick={()=>clickCallback(data)}>
            <img className="moditem-avatar" alt={"?"} src={data.logo?.url} />
            <div className="moditem-description-container">
                <span className="moditem-name" title={data.summary}>{data.name}</span>
            </div>
            <div className="moditem-divisor"></div>
            <div className="moditem-info">
                {data.classId===4471 ? <code title={"Questo è un modpack"}>Modpack</code> : ""}
                {forge ? <code className="moditem-prop" title={"Incluso Forge"}>Forge</code> : ""}
                {fabric ? <code className="moditem-prop" title={"Incluso Fabric"}>Fabric</code> : ""}
                <code className="moditem-prop" title={"Disponibile per: "+mcvers.map(e=>{return " ["+e+"]"})}>Su {mcvers.length} MC V.</code>
            </div>
            <div className="moditem-divisor"></div>
            <div className="moditem-info">
                {data.categories.map(e=>{
                    return <img src={e.iconUrl} title={e.name} key={Math.random()*9999} alt={e.name} />
                })}
            </div>
        </div>
    );
}

export default ModItem;