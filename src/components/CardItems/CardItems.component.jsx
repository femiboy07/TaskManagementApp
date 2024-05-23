
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { Card,CardHeader,CardContent } from "../ui/card";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, editSubtask } from "../../reduxApp/features/data/dataSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { EllipsisVertical } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "react-hook-form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import EditBoard from "../Modals/EditBoard";
import EditTask from "../Modals/EditTask";
import DeleteBoard from "../Modals/DeleteBoard";
import DeleteTask from "../Modals/DeleteTask";





export default function CardItems({cardRef,tasks,provided,tab,columns}){
                const [checkedSubtasks,setCheckedSubtasks]=useState(false);
                const [isCompleted,setIsCompleted]=useState(false);
                const [subtasks,setSubtasks]=useState(tasks)
                const dispatch=useDispatch();
                const substask=subtasks.subtasks.length;
                const boards=useSelector((state)=>state.data.data);
                const status=useSelector((state)=>state.data.currentBoardStatus);
                const colorTheme=useSelector((state)=>state.data.colorTheme);
                const [cardDropDown,setCardDropDown]=useState(false);
                const [cardItem,setCardItem]=useState(false)
                
                console.log(status)
                console.log(boards,"boards");
                const item=boards.boards.find((item)=>item.name === tab);
               //  const columnStatus=item.columns.filter((item)=>item.tasks.map((item)=>item.id === tasks.id));
               const column=item.columns;
               console.log(column);
               
                 
                console.log(item)
                const filteCompletedSubstask=subtasks.subtasks.filter((items)=>items.isCompleted !== false).length;
                console.log(columns);
              const {formState,control,register}=useForm()

         const handleCheckedChange=useCallback((index)=>{
         

        
         console.log(subtasks)
          const item=subtasks.subtasks.slice();
          console.log(item)
          console.log(item)
         
           item[index]={...item[index],isCompleted:!item[index].isCompleted};
           dispatch(editSubtask({columnStatus:subtasks.status,currentBoard:tab,tasks:subtasks.id,subtask:index,check:item[index].isCompleted}))
          setSubtasks({...subtasks,subtasks:item}) 
         
       },[dispatch, subtasks, tab])

         
      const handleStatusChange=useCallback((value)=>{
         // origcolumnStatus,currentBoard,tasks,newColumnStatus;
         const original=subtasks.status;
         const newColumnStatus=value

           console.log(tasks.status)
           console.log(value);
           dispatch(changeStatus({origcolumnStatus:tasks.status,currentBoard:tab,tasks:tasks.id,newColumnStatus:newColumnStatus}))
      },[dispatch, subtasks.status, tab, tasks.id, tasks.status])

     const handleMenuItemSelect=(e)=>{
         
           setCardDropDown(false)
      }

     return (
      <>
            
             <Dialog  open={cardDropDown} onOpenChange={setCardDropDown}>
               <DialogTrigger asChild>
             <Card ref={cardRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                className={`pacing-cards text-foreground w-[17rem]  mt-5 text-left border  items-start flex flex-col `}>
                <CardHeader>
                   <h1 className=" tracking-tighter leading-tight font-extrabold">{tasks.title}</h1>
                </CardHeader>
                <CardContent className="p-0 pl-6 pt-1 pb-2  text-secondary-foreground">
                    <span className=" text-secondary-foreground">{`${filteCompletedSubstask} of ${substask} subtasks`}</span>
                 </CardContent>
              </Card>
             </DialogTrigger>
             <DialogContent className={`mt-5 lg:h-fit flex flex-col ${colorTheme === 'light' ? 'bg-card':' dark bg-card text-foreground'} `}>
                <DialogHeader>
                  <div className="flex justify-between  mt-10">
                  <DialogTitle className='flex-1 flex-wrap text-left'>{tasks?.title}</DialogTitle>
               
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                         <EllipsisVertical className="w-6  h-6 "   / >
                           </DropdownMenuTrigger>
                          
                           <DropdownMenuContent className={`  w-36 absolute top-2  shadow-sm right-1 rounded-md pt-5 pb-5 ${colorTheme === 'light' ? ' bg-card':' bg-card'}`}>
                          
                           <EditTask tab={tab} oldTask={tasks} setCardDropDown={setCardDropDown} cardDropDown={cardDropDown} />
                           
                           <DeleteTask tab={tab} tasks={tasks} setCardDropDown={setCardDropDown} cardDropDown={cardDropDown}/>
                           </DropdownMenuContent>


                  </DropdownMenu>
            
                  </div>
                  </DialogHeader>
                  {!tasks.description ? <p>No Description</p>:<p>{tasks.description}</p>}
              <div className="order ">
                  <span className="pb-5">{` subtasks ${filteCompletedSubstask} of ${substask}`}</span>
                   {tasks.subtasks.map((item,index)=>(
                    <label key={index} className={` ${colorTheme === 'light'?'bg-[#F4F7FD] text-card-foreground':'dark bg-background'} flex rounded-md cursor-pointer   gap-2  mb-2 space-x-2 px-2 pt-6 pb-6 items-center  w-full h-8 leading-none " htmlFor={item?.id}`}>
                       <input type="checkbox"  key={item.id}     id={item?.id}  defaultChecked={item.isCompleted} className=" inset-0" onChange={()=>handleCheckedChange(index)} />
                        {item?.title}</label>
                     
                   ))}

                  </div>
               
              <Select onValueChange={handleStatusChange} className=" bg-slate-950" defaultValue={tasks.status} >
                 <SelectTrigger >
                    <SelectValue />
                 </SelectTrigger>
                
                <SelectContent className=" bg-white">
                  {status.map((item)=>(
                     <SelectItem  value={item} >{item}</SelectItem>
                  ))}
                   
               
                </SelectContent>
              </Select>
            
            
        
         
             </DialogContent>
             </Dialog>
             </>

            )

}



