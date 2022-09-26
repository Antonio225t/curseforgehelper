import { useState } from "react";
import InputBox from "./InputBox";
import ModalButton from "./ModalButton";
import ModalDropdownButton from "./ModalDropdownButton";
import Modlist from "./Modlist";
import ModpackList from "./ModpackList";


function ModSearchCore() {
    const [fieldName, setFieldName] = useState("");
    const [modldr, setModldr] = useState(0);
    const [listaMods, setListaMods] = useState(false);

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
                    setListaMods(!listaMods)
                }} />
            </div>
            {listaMods ? <ModpackList searchFilter={fieldName} modLoaderType={modldr} /> : <Modlist searchFilter={fieldName} modLoaderType={modldr} />}
        </div>
    );
}

export default ModSearchCore;