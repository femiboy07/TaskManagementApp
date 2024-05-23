import React, { useEffect, useState } from "react";
import { ArrowDownIcon, BriefcaseBusinessIcon, Eye, EyeIcon, EyeOffIcon, FolderArchiveIcon, MoonIcon, PlusIcon, SunIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {setCurrentBoardStatus, tabBoard } from "../../reduxApp/features/data/dataSlice";
import CreateNewBoard from "../Modals/CreateNewBoard";
import { Switch } from "../ui/switch";
import { setTheme } from "../../reduxApp/features/data/dataSlice";
import { Button, buttonVariants } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";







export default function SideBar({themeChange,hideBar,setHidebar,showModalSide,setShowModalSide,board}){
    
      const dispatch=useDispatch()
      const colorTheme=useSelector((state)=>state.data.colorTheme);
      const [mode,setMode]=useState(colorTheme === "light");
      const currentTab=useSelector((state)=>state.data.boardTab);
      
      

      const handleChange=()=>{
        themeChange()
        setMode(!mode)
      }
     
    

  return (
  
    <div  style={{height:`calc(100% - 6rem)`}} className={` hidden md:fixed  w-72 z-50   ${hideBar === true ? ' -translate-x-full transition-transform  ':" transition-all md:fixed"}   ${colorTheme === 'dark' ? ' border-[#3E3F4E] border-r bg-card  ':' bg border-1 border-r '}   md:flex flex-col  justify-between left-0    `}>
  <div className="flex flex-col justify-between w-full h-full overflow-y-auto overflow-x-hidden w-75  pr-2">
  <ul className={`w-full  `}>
   <li className="pt-2 pl-8 text-sm ">All BOARDS {board?.boards?.length}</li>
      {board?.boards && board?.boards?.map((item,index)=>(
             <li key={index}   onClick={()=>{
               
               dispatch(tabBoard(item.name));
               dispatch(setCurrentBoardStatus(item.name))
             }
             } className={`flex items-center gap-2 ${currentTab === item.name ? `bg-primary  font-extrabold ${colorTheme === 'light'? 'text-[#ffff]':' text-[#ffff]'}`: `text-[#828fa3] font-extrabold  `} mt-2 rounded-r-full text-lg p-3 pl-8 cursor-pointer `}>
             <FolderArchiveIcon size={18}/>
              <span href='/' typeof="button">{item.name}</span>
              </li>
             ))}
    <CreateNewBoard  icon={<PlusIcon size={18}/>} breifCaseIcon={<BriefcaseBusinessIcon/>} showModalSide={showModalSide} setShowModalSide={setShowModalSide}/>
  </ul>
  <div className="  mb-5 mt-5 flex flex-col items-center justify-center w-72 pr-5  ">
    <div className={`flex items-center justify-between bg-background rounded-md w-56 h-12 p-3  pl-12 pr-12 ${colorTheme === 'dark'?' bg-background':''}`}>
    <MoonIcon size={18} className={`${colorTheme === 'light' ? '':'text-[#828fa3]'}`}/> 
      <Switch className="h-6 bg-red-600"  checked={mode} onCheckedChange={handleChange}/>
   <SunIcon size={18} className={`${colorTheme === 'light' ? '':'text-[#828fa3]'}`} />
   </div>
   <div className={`flex w-full pl-5 ${colorTheme ? 'text-[#828fa3]':''}`}>
   <Button className={buttonVariants({variant:"sidecustomlight",className:`p-3 flex mt-2 gap-2 bg-transparent justify-start`})} onClick={()=>setHidebar(!hideBar)}>
     <EyeOffIcon/>
     <span>close side bar</span>
   </Button>
   </div>
  </div>
 </div>


    </div>
      
    
  )
}