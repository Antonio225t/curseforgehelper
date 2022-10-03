import { useState } from "react";
import ModalButton from "./ModalButton";
import dropIcon from "../icons/dropdown.png";


function ModalDropdownButton({items, settedDefaultItem, onItemSelect, prefix, alwaysShow}) {

    const [defaultItem, setDefaultItem] = useState(alwaysShow || settedDefaultItem || items[0]);
    const [choosing, setChoosing] = useState(false);
    const [rect, setRect] = useState({});
    const id = "dropdownMenu"+parseInt(Math.random()*9999);

    document.addEventListener("mousedown", (e)=>{
        if (choosing) {
            if (!e.path.map((item)=>{return item.className;}).includes("modal-dropdown-container")) {
                setChoosing(false);
                document.removeEventListener("mousedown", e);
            }
        }
    })

    return (
        <>
            <ModalButton id={id} icon={dropIcon} name={prefix+defaultItem} onClick={()=>{
                let recta = document.getElementById(id).getBoundingClientRect();
                let rect = {"left":recta.x+"px","top":recta.y+recta.height+"px","minWidth":recta.width};
                setRect(rect)
                setChoosing(true);
            }} />
            {choosing ? (
                <div className="modal-dropdown-container" style={rect}>
                    {items.map((e)=>{
                        return (
                            <div className={"modal-dropdown-item " + (e===defaultItem ? "modal-dropdown-item-sel" : "")} key={Math.random()*9999} onClick={()=>{
                                setChoosing(false);
                                setDefaultItem(alwaysShow || e);
                                onItemSelect(e);
                            }}>{e}</div>
                        );
                    })}
                </div>
            ) : ""}
        </>
    );
}

ModalDropdownButton.defaultProps = {
    "items":[],
    "defaultItem":void 0,
    "onItemSelect":(item)=>{},
    "prefix":"",
    "alwaysShow":void 0
};

export default ModalDropdownButton;