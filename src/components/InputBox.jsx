import { useState, useRef } from "react";


function InputBox({placeholder, onEnter, onContentAdd, enterBlur, width, disabled}) {

    const text = useRef(null);
    const [hasContent, setHasContent] = useState(false);

    return (
        <div className={"inputBox-container "+(disabled ? "inputBox-disabled" : "")} style={{"width":width+"px"}} onClick={disabled ? ()=>{} : ()=>{text.current.focus();}}>
                <div ref={text} contentEditable={!disabled} onKeyDown={(e)=>{
                    if(e.keyCode===8) {
                        let sel = document.getSelection();

                        if (!sel.rangeCount) return false;
                        if (sel.focusOffset!==sel.anchorOffset) {e.preventDefault()} else if (text.current.innerHTML.length===1) setHasContent(false);

                        sel.deleteFromDocument();
                        if (text.current.innerHTML==="") setHasContent(false);
                    }
                }} onKeyPress={(e)=>{
                    if (e.charCode===13) {
                        e.preventDefault()
                        if (enterBlur) text.current.blur();
                        onEnter(text.current.innerHTML);
                        return;
                    }
                    if (text.current.innerHTML==="") setHasContent(true);
                    onContentAdd(text.current.innerHTML+e.key);
                }} onPaste={(e)=>{
                    e.preventDefault();
                    let sel = document.getSelection();
                    let data = e.clipboardData.getData("text/plain").replace("\n", " ");

                    if (!sel.rangeCount) return false;
                    sel.deleteFromDocument();
                    sel.getRangeAt(0).insertNode(document.createTextNode(data));

                    let range = sel.getRangeAt(0);
                    range.setStart(range.endContainer, range.endOffset);

                    sel.removeAllRanges()
                    sel.addRange(range);
                    if (!text.current.innerHTML==="") setHasContent(true);

                    onContentAdd(text.current.innerHTML);
                }} className="inputBox-text-container"></div>
                {!(placeholder==="") && !hasContent ? (
                    <span className="inputBox-placeholder">{placeholder}</span>
                ) : ""}
            </div>
    );
}

InputBox.defaultProps = {
    "placeholder":"",
    "onEnter":(text)=>{},
    "onContentAdd":(text)=>{},
    "enterBlur":false,
    "width": 75,
    "disabled":false
};


export default InputBox;