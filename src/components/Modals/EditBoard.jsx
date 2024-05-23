import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button, buttonVariants } from "../ui/button";
import { EllipsisVertical, PlusIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { addNewColumn, editBoard, setCurrentBoardStatus, tabBoard } from "../../reduxApp/features/data/dataSlice";

import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,DropdownMenu, DropdownMenuSubTrigger } from "../ui/dropdown-menu";
import Header from "../Header/Header.component";
import EditButton from "../EditButton/EditButton";





const formSchema=z.object({
   name:z.string(),
   columns:z.array(z.object({
       name:z.string({required_error:'this field is required'}).trim().min(1,{
         message:'Required'
       }),
       id:z.string(),
       tasks:z.array(),
    })),
    id:z.string()

})


export default function EditBoard({setEditBoard,setDeleteBoard,setIsDialogOpen,handleEditBoardClick,setTrigger,trigger,setDialog,dialog}){
    const [addSubTask,setAddSubTask]=useState(false);
   const dispatch=useDispatch()
   const colorTheme=useSelector((state)=>state.data.colorTheme);
   const board=useSelector((state)=>state.data.data);
   const tab=useSelector((state)=>state.data.boardTab);
   const currentBoardStatus=useSelector((state)=>state.data.selectedBoard);
   const targetBoards=board.boards?.find((b)=>b.name === tab);




    

  const form=useForm({
    defaultValues: {
      name:tab,
      columns:targetBoards?.columns?.map((item)=>({
        id: item?.id,
        name: item?.name,
        tasks: item?.tasks,
      })),
      id:targetBoards?.id
}}) ;
  
    
   
    
  // 
  const forms= form;
  
  const {fields,append,remove}=  useFieldArray({
    control:forms.control,
    name:`columns`,
    
  })

  const watchFieldArray = forms.watch('columns');
  const controlledFields = fields?.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  const handleBoardName=(value)=>{
    if(value) return
    return  !board?.boards?.find((task) => task?.name.toLowerCase() === value.toLowerCase())
  }



  console.log(controlledFields,"controllFields")
  
  console.log(controlledFields,"fields"); 
  console.log(watchFieldArray,"watchFieldsArray")
  const theSame=watchFieldArray.find((item)=>item.name === 'Todo');
  console.log(theSame)
  
  const appendSubtask=()=>{
      append({name:"",id:nanoid(),tasks:[]})
  }
  
  const removeSubtask=useCallback((index)=>{

    remove(index)
  },[remove]);

  const hasDuplicates=(value,index,watchFieldArray)=>{
    const arr= watchFieldArray.map((item)=>item.name)

    if(arr.indexOf(value) !== index){
      return false;
    }
    return true;
    
  }
  
  
  
 
 const handleSubmitColumn=(data)=>{
   console.log(data,"hdhhdhshddsjds");
   if(!data)return;
   dispatch(addNewColumn({currentBoard:tab,newBoard:data}))
   dispatch(setCurrentBoardStatus(data.name));
   dispatch(tabBoard(data.name));
   setTrigger(false)
}



    return (

         <Form {...forms}>
        <Dialog   onOpenChange={setTrigger}>
        <DialogTrigger >
        
        <EditButton handleEditBoardClick={handleEditBoardClick} tab={tab} setTrigger={setTrigger}/>
        </DialogTrigger>
       <DialogContent  className={` outline-none  border-none   h-[450px] overflow-auto ${colorTheme === 'light' ? 'bg-card': 'dark bg-card text-foreground'} `}  >
      <DialogHeader>
        <DialogTitle>
          Edit Board</DialogTitle>
        </DialogHeader>
       <form className="outline-none border-none w-full space-y-4 flex flex-col justify-center"  onSubmit={forms.handleSubmit(handleSubmitColumn)} >
      
            <FormItem className=" relative w-full ">
                  <FormControl>
                    <Input  {...forms.register("name",{required:true,validate:(value)=>handleBoardName(value)})} className="outline-none focus:outline-none peer focus:border-blue-600  w-full "     />
                    </FormControl>
                    {forms.formState.errors?.name?.type === 'required' &&  <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>required</FormMessage>}  
                    {forms.formState.errors?.name?.type ===  "validate" && <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>Used</FormMessage>} 
            </FormItem>
  

      <div className="flex flex-col"> 
      <FormLabel>Columns</FormLabel>
      {controlledFields?.map((item, index) => (
          <div key={item.id}  className="flex items-center justify-center  w-full pt-2">
         <FormItem className='relative w-full'>  
          <FormControl>       
         <Input {...forms.register(`columns.${index}.name`,{required:true,validate:(value)=>hasDuplicates(value,index,watchFieldArray)})}  className="outline-none focus:outline-none peer focus:border-blue-600 h-full w-full "     />
          </FormControl>         
         {forms.formState.errors.columns?.[index]?.name?.type === 'required' &&  <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>required</FormMessage>}
         {forms.formState.errors.columns?.[index]?.name?.type ===  "validate" && <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>Used</FormMessage>} 
        </FormItem>
        {controlledFields.length > 1 && 
           <Button disabled={item.tasks.length > 0} className={buttonVariants({variant:'',size:'icon',className:`self-stretch flex-shrink ${colorTheme === 'light' ? ' text-[#828fa3]':' text-white'}  items-center bg-transparent`})} type="button" onClick={()=>removeSubtask(index)} >
              <XIcon size={25} />
           </Button>}
          </div>

        ))}
      </div>
    
     
           <Button className="w-full rounded-full" type="button" onClick={appendSubtask}>
            <PlusIcon size={15}/>
            AddNewColumn
           </Button> 
          
        <div>
         
      </div>
       <Button  className="w-full mt-5 rounded-full" type="submit" >
           Create New Column
        </Button>
      </form> 
      </DialogContent>
     
     </Dialog>
      </Form>
    
    )
        
        
    
}