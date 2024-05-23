import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentBoardStatus, tabBoard } from "../../reduxApp/features/data/dataSlice";
import { ArrowDownIcon, ArrowUpIcon, EyeOffIcon, FolderArchiveIcon, MoonIcon, SunIcon } from "lucide-react";
import CreateNewBoard from "./CreateNewBoard";
import { Switch } from "../ui/switch";
import { Button, buttonVariants } from "../ui/button";
import useInitialGetWidth from "../Hooks/useInitialGetWidth";





export default function SideBarModal({themeChange,hideBar,setHidebar,showModalSide,setShowModalSide,colorTheme}){

    const dispatch=useDispatch()
    const state=useSelector((state)=>state.data.data);
    // const colorTheme=useSelector((state)=>state.data.colorTheme);
    const [mode,setMode]=useState(colorTheme === "light");
    const currentTab=useSelector((state)=>state.data.boardTab);
    const [switchArrow,setSwitchArrow]=useState(false);
    const [width]=useInitialGetWidth()
    
    const handleChange=()=>{
        themeChange()
        setMode(!mode)
      }

      const handleOpenSideModal=()=>{
        setShowModalSide(!showModalSide);
        setSwitchArrow(!switchArrow);

    }


       useEffect(()=>{
           if(width >= 768 ){
            setShowModalSide(!showModalSide)
        
           }

           if(showModalSide){
             setSwitchArrow(true)
           }

        
       
    },[setShowModalSide, showModalSide, width])
    return (
        <Dialog open={showModalSide} onOpenChange={handleOpenSideModal}>
            <DialogTrigger >
            <Button onClick={handleOpenSideModal} className={buttonVariants({variant:'sidecustomlight',className:' bg-transparent pl-0 transition-[rotate] duration-75 rotate-360'})}>
          {!switchArrow && !showModalSide  ?
          ( 
          <ArrowDownIcon size={15} className=" self-center cursor-pointer"/>
          )
          :(<ArrowUpIcon size={15} className=" self-center cursor-pointer"/>)}
           </Button>
            </DialogTrigger>
    <DialogContent  className={`h-[25rem] w-75 overflow-auto  px-0 flex  justify-between  ${colorTheme === 'dark' ? ' dark border-[#3E3F4E] border-r bg-card  ':'  border-1 border-r bg-card '}       `}>
         <div className="flex flex-col justify-between ">
          <ul className={`w-full  pr-5   `}>
          <li className="pt-2 pl-8 text-sm ">All BOARDS {state?.boards?.length}</li>
            {state?.boards?.map((item,index)=>(
             <li key={index}   onClick={()=>{
              dispatch(tabBoard(item.name));
               dispatch(setCurrentBoardStatus(item.name))
             }
             } className={`flex items-center gap-2 ${currentTab === item.name ? `bg-primary  font-extrabold ${colorTheme === 'light'? 'text-[#ffff]':' text-[#ffff]'}`: `text-[#828fa3] font-extrabold  `} mt-2 rounded-r-full text-lg p-3 pl-8 cursor-pointer `}>
             <FolderArchiveIcon size={18}/>
              <span href='/' typeof="button">{item.name}</span>
              </li>
             ))}
      {currentTab && <CreateNewBoard  tab={currentTab}/>}
  </ul>

  <div className=" mb-10 mt-5 flex flex-col items-center justify-center    ">
    <div className={`flex items-center justify-between  rounded-md  h-12  w-52 pl-12 pr-12 ${colorTheme === 'dark'?'dark bg-background':' bg-background'}`}>
    <MoonIcon size={18} className={`${colorTheme === 'light' ? '':' dark text-[#828fa3]'}`}/> 
      <Switch className="h-6 "  checked={mode} onCheckedChange={handleChange}/>
   <SunIcon size={18} className={`${colorTheme === 'light' ? '':'text-[#828fa3]'}`} />
   </div>
   </div>
  
 </div>
</DialogContent>
           
        </Dialog>
    )
}