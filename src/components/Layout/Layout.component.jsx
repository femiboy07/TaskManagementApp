import React, { Suspense,useCallback,useEffect, useMemo, useState } from "react";
import SideBar from "../Sidebar/Sidebar.component";
import Header from "../Header/Header.component";
import { Button, buttonVariants } from "../ui/button";
import { Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import ColumnContainer from "../ColumnContainer/ColumnContainer.component";
import {setDragDropTask, setTheme } from "../../reduxApp/features/data/dataSlice";
import AddNewColumn from "../Modals/AddNewColumn";
import EditBoard from "../Modals/EditBoard";
import useInitialGetWidth from "../Hooks/useInitialGetWidth";
import SideBarModal from "../Modals/SideBarModal";




export default function Layout(){
    
    const board=useSelector((state)=>state.data.data);
    console.log(board);
    const dispatch=useDispatch()
    const tab=useSelector((state)=>state.data.boardTab);
   
    console.log(tab);
    const selectBoard=useSelector((state)=>state.data.currentBoardStatus);
    const colorTheme=useSelector((state)=>state.data.colorTheme);
    const current=useMemo(()=>board?.boards?.find((item)=>item.name === tab),[board?.boards, tab]);
    const [hideBar,setHidebar]=useState(false);
    const [switchArrow,setSwitchArrow]=useState('down');
     console.log(current);
     const [draggableId,setDraggableId]=useState(null);
     const [isDragging,setIsDragging]=useState(false)
     const [editBoard,setEditBoard]=useState(false);
     const [deleteBoard,setDeleteBoard]=useState(false);
     const [isDialogOpen, setIsDialogOpen] = useState(false);
     const [width]=useInitialGetWidth();
    const  [showModalSide,setShowModalSide]=useState(false);
    
     const themeChange=()=>colorTheme === 'dark' ? dispatch(setTheme('light')):dispatch(setTheme('dark'));
     // Function to handle the click event and open the dialog
     const handleEditBoardClick = () => {
       setIsDialogOpen(true);
       // Optionally, you can dispatch an action here if needed
       // dispatch(editBoard({ currentBoard: tab, columnStatus: "Next" }));
     };
   
     
   
     
    
    console.log(selectBoard,"state")

    const onDragStart=(data)=>{
      console.log(data);
      setDraggableId(parseInt(data.draggableId))
      setIsDragging(true)
     }
  
 
    const onDragEnd=(data)=>{
      const {source,destination}=data;
      if (!destination) return;
        console.log(data);
        const sourceDroppable=parseInt(source.droppableId);
        const destDroppable=parseInt(destination.droppableId);
        console.log(sourceDroppable,"src")
        console.log(destDroppable,"dest")
        // setIsDragging(false)

        dispatch(setDragDropTask({currentBoardId:current.id,srcColumnId:sourceDroppable,destColumnId:destDroppable,newIndex:destination.index,srcIndex:source.index}))
        console.log(source,destination);
        setIsDragging(false)
      }

    const handleHideSideBar=()=>{
      setHidebar(!hideBar)
    }

    

  
   
    return (
        <div className={`h-screen w-full flex   flex-col ${colorTheme === 'light' ? ' bg-background':'dark bg-background' } `}>
         <Header  
           tab={tab} 
           setEditBoard={setEditBoard} 
           setHidebar={setHidebar}  
           setShowModalSide={setShowModalSide} 
           showModalSide={showModalSide} 
           handleEditBoardClick={handleEditBoardClick}  
           editBoard={editBoard} 
           deleteBoard={deleteBoard} 
           colorTheme={colorTheme}
           setDeleteBoard={setDeleteBoard}
           themeChange={themeChange}
           hideBar={hideBar}
           />
            <div className="relative  h-full w-full overflow-auto snap-center snap-x  pl-8 sm:pr-18 lg:pr-16 flex  ">
             <SideBar  themeChange={themeChange} showModalSide={showModalSide} setShowModalSide={setShowModalSide} hideBar={hideBar} setHidebar={setHidebar} handleHideSideBar={handleHideSideBar} />
            <div className={`absolute ${isDragging ? 'snap-none':''} snap-end  flex w-full h-full pt-[1.1rem] pb-[1.5rem] ${hideBar ? 'left-0  transition-[left]':'md:left-[18rem] transition-[left] left-0'}    pl-8   `}>
            {hideBar && 
            <Button  className={buttonVariants({className:`fixed bottom-10 flex items-center justify-center pl-7 -left-4 ${width <= 768 ? 'hidden':''}`})}  onClick={()=>setHidebar(false)}>
            <Eye className="w-4 h-4"/>
            </Button>
           }
              <DragDropContext onDragEnd={onDragEnd}  onDragStart={onDragStart}>
                <>
                {current && current?.columns?.map((column,index)=>(
                      <Droppable droppableId={column.id?.toString()} key={index}>
                       {(provided,snapshot)=>(
                        <>
                        <ColumnContainer dropRef={provided.innerRef} tab={tab} current={current}   provided={provided}  {...provided.droppableProps} colorball={index} item={column}  />
                </>                        
                )}
                      </Droppable>))}
               </>
              </DragDropContext>
              {tab  &&  current?.columns?.length <= 6 && <AddNewColumn key={tab} />}
              
               </div>
                
              
          
            </div>
           
         </div>   
          
          
        
    )
}