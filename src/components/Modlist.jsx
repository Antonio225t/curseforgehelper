import { useEffect, useState } from "react";
import "../App.css"
import ModItem from "./ModItem";
import ModalMod from "./ModalMod"
import ModalButton from "./ModalButton";

import arrowLeft from "../icons/arrow-left.png"
import arrowRight from "../icons/arrow-right.png"
import loading from "../icons/loading1.gif"
import InputBox from "./InputBox";
//import main from "../main"


const Modlist = ({classId, categoryId, gameVersion, searchFilter, sortField, sortOrder, modLoaderType, gameVersionTypeId, slug, onLoad}) => {
    const [modFound, setModFound] = useState([]);
    const [focusedMod, setFocusedMod] = useState(void 0);
    const [pages, setPages] = useState(void 0);
    const [index, setIndex] = useState(0);

    const [loadingPage, setLoadingPage] = useState(3);
    const [previousFilter, setPreviousFilter] = useState(searchFilter);


    useEffect(()=>{
        if (searchFilter!==previousFilter) {setPreviousFilter(searchFilter);setIndex(0);}
        if (searchFilter===previousFilter) fetch("https://api.curseforge.com/v1/mods/search?gameid=432"+(modLoaderType ? "&modLoaderType="+modLoaderType : "")+(sortOrder ? "&sortOrder="+sortOrder : "")+(gameVersion ? "&gameVersion="+gameVersion : "")+(searchFilter ? "&searchFilter="+searchFilter : "")+(slug ? "&slug="+slug : "")+(sortField ? "&sortField="+sortField : "")+(classId ? "&classId="+classId : "")+(categoryId ? "&categoryId="+categoryId : "")+(gameVersionTypeId ? "&gameVersionTypeId="+gameVersionTypeId : "")+(index ? "&index="+index : ""), {method:"GET",headers:{"Accept": "application/json", "x-api-key":"$2a$10$g4AxMnvx.UK708X844lqL.6HswJJZBZ11mDDxPU420eEj93RI0Whe"}})
        .then(resp=>{return resp.json()}).then(resp=>{
            setModFound(resp.data);
            setPages(resp.pagination);
            setLoadingPage(0);
            //console.log(resp);
        });
    }, [modLoaderType, sortOrder, gameVersion, searchFilter, sortField, slug, classId, categoryId, gameVersionTypeId, onLoad, index, previousFilter]);

    return (
        <div>
            <div className="modsearchcore-fields flex-center">
                {pages ? (
                    <>
                        <ModalButton icon={loadingPage===1 ? loading : arrowLeft} name={"Indietro"} disabled={loadingPage || pages.index===0} onClick={()=>{
                            setIndex(pages.index-pages.pageSize);
                            setLoadingPage(1);
                        }} />
                        <span>{parseInt((pages.index+pages.pageSize)/pages.pageSize)}</span>
                        <ModalButton icon={loadingPage===2 ? loading : arrowRight} name={"Avanti"} disabled={loadingPage || pages.index+pages.resultCount>=pages.totalCount} onClick={()=>{
                            setIndex(pages.index+pages.pageSize);
                            setLoadingPage(2);
                        }} />
                        <span>{parseInt(pages.totalCount/pages.pageSize % 1>0 ? pages.totalCount/pages.pageSize+1 : pages.totalCount/pages.pageSize)}</span>
                        <InputBox placeholder={"Vai a pagina"} disabled={loadingPage} width={100} onEnter={(text)=>{
                            let n = parseInt(text);
                            let max = pages.totalCount/pages.pageSize;
                            if (max % 1>0) max++;
                            max = parseInt(max);
                            
                            if (isNaN(n)) {alert("Devi inserire un numero valido compreso tra 1 e "+max+"!");return;}
                            if (n < 1) n = 1;
                            if (n > max) n = max;
                            if (n===parseInt((pages.index+pages.pageSize)/pages.pageSize)) return;
                            setIndex(n*pages.pageSize-pages.pageSize);
                            setLoadingPage(3);
                        }} />
                        <span>Mods nella lista: {pages.resultCount}</span>
                    </>
                ) : ""}
            </div>
            <div className="modlist-container">
                <div className="modlist-containerp">
                    {modFound.map(e=>{
                        return modLoaderType===0 || e.latestFilesIndexes.filter(e=>{return e.modLoader===modLoaderType}).length>0 ? (
                            <ModItem key={Math.random()*9999} data={e} clickCallback={(d)=>{
                                setFocusedMod(d);
                            }}></ModItem>
                        ) : "";
                    })}
                </div>
                <div className={"modlist-focusarea " + (focusedMod ? "active" : "")}>
                    {focusedMod ? <ModalMod data={focusedMod} onClose={()=>{
                        setFocusedMod(void 0);
                    }}></ModalMod> : ""}
                </div>
            </div>
        </div>
    );
}

Modlist.defaultProps = {
    "classId":6,
    "categoryId":"",
    "gameVersion":"",
    "searchFilter":"",
    "sortField":2,
    "sortOrder":"desc",
    "modLoaderType":0,
    "gameVersionTypeId":"",
    "slug":"",
    "onLoad":(data)=>{},
    "index":0
};

export default Modlist;