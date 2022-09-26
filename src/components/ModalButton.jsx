

function ModalButton({icon, iconAlt, name, title, disabled, onClick, onDisableClick, id}) {
    return (
        <div id={id} className={"modal-button " + (disabled ? "modal-button-disabled" : "")} onClick={disabled ? onDisableClick : onClick} title={title}>
            {icon ? <img src={icon} alt={iconAlt} /> : ""}
            {name ? <span>{name}</span> : ""}
        </div>
    )
}

ModalButton.defaultProps = {
    "icon":void 0,
    "name":void 0,
    "iconAlt": "icon",
    "title":void 0,
    "disabled": false,
    "onClick":()=>{},
    "onDisableClick":()=>{},
    "id":void 0
};

export default ModalButton;