import React, {useState } from "react";
import { Button } from "../ui/button";
import {EllipsisVertical} from "lucide-react";
import { buttonVariants } from "../ui/button";
import { useDispatch } from "react-redux"
import AddNewTaskModal from "../Modals/AddNewTask";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import EditBoard from "../Modals/EditBoard";
import DeleteBoard from "../Modals/DeleteBoard";
import useInitialGetWidth from "../Hooks/useInitialGetWidth";
import SideBarModal from "../Modals/SideBarModal";



export default function Header({tab,setDeleteBoard,deleteBoard,hideBar,handleEditBoardClick,colorTheme,setShowModalSide,showModalSide,setHidebar,themeChange,board}){
      
      
      const [trigger,setTrigger]=useState(false);
      const [dialog,setDialog]=useState(false);
      const [width]=useInitialGetWidth();
      const [changeSide,setChangeSide]=useState(false)
     

     
    


      
    return (
        <div className={`w-full h-32  ${colorTheme === 'light' ? ' bg border-b':'dark bg border-b '}  flex-shrink  flex-grow  z-50    flex  items-center  text-foreground`}>
          <div className={`Leade min-w-[18rem] pt-8 h-full md:flex hidden  pr-0 pl-8 ${colorTheme === 'light' ?'border-r border-b':'dark border-r  border-[#3E3F4E]'}`}>
          <span className=" text-3xl font-semibold tracking-tight ">
          
           Kanbam
           </span>
          </div>
         <div className=" flex justify-between w-full h-full  pr-[1rem] items-center ">
          {width >= 768 ?
           <h3 className="text-2xl font-semibold text-wrap tracking-tight pl-8 ">
           {tab ? tab : 'No Board Found'}
          </h3>:
          <div className="flex gap-1 ">
          <h3 className="text-2xl font-semibold text-wrap tracking-tight pl-8  ">
            {tab ? tab :'No Board Found'}
           </h3>
           <SideBarModal colorTheme={colorTheme}  changeSide={changeSide} setChangeSide={setChangeSide} themeChange={themeChange} board={board} hideBar={hideBar} setHidebar={setHidebar} showModalSide={showModalSide} setShowModalSide={setShowModalSide}/>
          </div>
          
          }
    <div className=" flex justify-center    items-center gap-3">
         {tab && <AddNewTaskModal tab={tab} title={`${width >= 768 ? `Add new Task`:''}`} />}
      { tab &&
   <DropdownMenu>
    <DropdownMenuTrigger    onClick={()=>setTrigger(true)} >
     <Button  className={buttonVariants({size:'default',className:`${colorTheme === 'light' ? 'hover:bg-[#E4EBFA]  bg-transparent text-primary ':' bg-transparent text-foreground'} px-1`})} >
     <EllipsisVertical />
     </Button>
     </DropdownMenuTrigger>
      {trigger &&
       <DropdownMenuContent className={` ${!trigger ? 'hidden':''} w-36 absolute top-2  shadow-sm right-1 rounded-md pt-5 pb-5 ${colorTheme === 'light' ? ' bg-card':' bg-card'}`}>
           <EditBoard tab={tab} handleEditBoardClick={handleEditBoardClick} dialog={dialog} setDialog={setDialog} setTrigger={setTrigger} />
            <DeleteBoard tab={tab} setDeleteBoard={setDeleteBoard} setTrigger={setTrigger} deleteBoard={deleteBoard}/>
                  
     </DropdownMenuContent>}
   </DropdownMenu>}
   
    
           
         
          </div>
        </div>
        
        </div>
    )
}