import React from "react";
import CardItems from "../CardItems/CardItems.component";
import { Draggable } from "@hello-pangea/dnd";
import { useSelector } from "react-redux";
import AddNewColumn from "../Modals/AddNewColumn";






export default function ColumnContainer({dropRef,item,provided,colorball,tab,current,strip}){
    const status=useSelector((state)=>state.data.currentBoardStatus);
    console.log(status);
    console.log(item)
      console.log(item.id.toString())

    
     

  
    return(
          <div className="flex flex-col ">
             <div  className={`column-title flex items-center text-secondary-foreground    uppercase font-extrabold `}>
                   <span className={` ${colorball === 0  ? ` bg-blue-600`: colorball === 1 ?  `bg-green-700`: colorball > 1 ? ` rand`:null}  rounded-[100%] min-w-[15px] h-[15px] mr-3 text-[.75rem]   `}></span>
                   <span className=" text-ellipsis overflow-hidden whitespace-nowrap text-[.75rem] tracking-[2.4px]">{`${item.name}(${item.tasks.length})`}</span>
            </div>
          
          <div ref={dropRef} className={`${ `${item.tasks.length === 0 ? ` border-dashed mt-4  border-[3px] border-[#3E3F4E]   shadow-md  min-w-[18.5rem] mr-[1.3rem]  `:'h-screen min-w-[18.5rem]  '}`} h-screen   `}>
              <span style={{display:'none'}}>{provided.placeholder}</span>
              <div>
                <div >
                {item.tasks.map((item,index)=>(
                  <Draggable draggableId={item.id.toString()} key={item.id}   index={index}>
                    {(provided,snapshot)=>(
                       <CardItems tasks={item}  tab={tab} cardRef={provided.innerRef} provided={provided}/>
                    )}
                   </Draggable>
                 

                ))} 
                </div> 
              
               
          </div>
          
          </div>
           
         </div>
  
    )
}