import React, { useCallback, useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogTrigger,DialogContent, DialogClose } from "../ui/dialog";

import { FolderArchiveIcon, PlusIcon, XIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import {  useFieldArray, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage,Form } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addBoards, tabBoard,setCurrentBoardStatus } from "../../reduxApp/features/data/dataSlice";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";



const formSchema=z.object({
    name:z.string({
        required_error:'required'
    }).trim().min(2,{
     message:'minimum of 2 words'
    }),
   
    columns:z.array(z.object({
        name:z.string({required_error:'field is required'}).trim().min(3,{
            message:'jjj'
        }),
        id:z.number(),
        tasks:z.array()
    })),
    
})






export default function CreateNewBoard({setShowModalSide,icon,breifCaseIcon,showModalSide,setChangeSide,changeSide}){

    const dispatch=useDispatch()
  
    const board=useSelector((state)=>state.data.data);
    // const tab=useSelector((state)=>state.data.boardTab);
    console.log(board.boards)
    const currentBoardStatus=useSelector((state)=>state.data.currentBoardStatus);
    
    const colorTheme=useSelector((state)=>state.data.colorTheme);
  const [open,setOpen]=useState(true)


  function generateNumericId(length) {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNumber = Math.floor(Math.random() * Math.pow(2, length)); // Generate random number with specified length
    const convert= timestamp.toString() + randomNumber.toString();
    return parseInt(convert)
     // Concatenate timestamp and random number
  }

const form=useForm({ resolver: zodResolver(formSchema
    .refine(
        (value)=>{
         console.log(value)
        
          return  !board.boards?.find((task) => task?.name.toLowerCase() === value?.name?.toLowerCase())
          
        },{
          message:'Col name already used',
          path:['name']
})),
    defaultValues: {
      name: "",
      columns:[{name:"",id:generateNumericId(8),tasks:[]}],
      
    }});

   
const {fields,append,remove}=useFieldArray({
    control:form.control,
    name:`columns`,
}) ;


const appendCol=()=>{
    append({name:"",id:generateNumericId(8),tasks:[]})
}

const removeCol=useCallback((index)=>{
  remove(index)
},[remove]);


const handleClearValues=()=>{
  form.clearErrors()
  form.setValue('name', '');
  form.reset();
  form.setValue('columns', [{ name: "", id: generateNumericId(2),tasks:[] }]);
  setShowModalSide(false);
}
   
 
  const handleSubmitBoard=(data)=>{
   console.log(data)
  if(!data){

    return;
  }
  dispatch(addBoards({
    id:generateNumericId(2),
    name:data?.name,
    columns:data?.columns
  }))
  handleClearValues()
  dispatch(tabBoard(data?.name))
  dispatch(setCurrentBoardStatus(data?.name))

    
} 
  
  const handleTrigger=()=>{
    setShowModalSide(true);
    handleClearValues()

    if(changeSide){
      setChangeSide(false)
    }
    
  }
    return(
        <Form {...form}>
        <Dialog  open={showModalSide}  onOpenChange={setShowModalSide}> 
            <DialogTrigger onClick={handleTrigger} >
            <li  className={"flex items-center gap-2   p-3 pl-8  rounded-r-full "}>
                 {breifCaseIcon}
                  <Button
                     className={buttonVariants({variant:"sidecustom", className:' text-xl font-extrabold bg-transparent flex justify-start text-left  pl-0'})  } >  
                       <PlusIcon size={18}/>
                        Create New Board
                    </Button>
                </li>
            </DialogTrigger>
            <DialogContent className={`outline-none  border-none h-[450px]  overflow-auto  ${colorTheme === 'light' ? 'bg-card':' dark bg-card text-foreground'} `}>
            <form  className="outline-none border-none px-2 py-2  space-y-5  w-full flex flex-col justify-center " onSubmit={form.handleSubmit(handleSubmitBoard)} >
           
            <DialogHeader>
                <DialogTitle>
                    Add New Board
                </DialogTitle>
            </DialogHeader> 
                  
                   <FormField 
                    control={form.control} 
                    name="name"
                     render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>title</FormLabel>
                  <FormControl >
                    <Input  className="outline-none focus:outline-none peer focus:border-blue-600 "   {...field}   />
                  </FormControl>
                 <FormMessage className='absolute right-5 top-1/2 h-full '/>
                </FormItem>
              )}/> 
              <div className="">
                <FormLabel>columns</FormLabel>
            {fields.map((col,index)=>(
                 <div key={col.id} className="flex flex-2 mt-3">
                     <FormField 
                     control={form.control} 
                     name={`columns[${index}].name`}
                     render={({ field }) => (
                   <FormItem className=" relative w-full" >
                 <FormControl  >
                    <Input  className="outline-none focus:outline-none peer focus:border-blue-600 h-full "   {...field}   />
                  </FormControl>
                 <FormMessage className='absolute right-5 -top-1/2 h-full border-red-400 '/>
                </FormItem>

              )}/> 
              {fields.length > 1 && 
              <Button className={buttonVariants({variant:'',size:'icon',className:`self-stretch flex-shrink ${colorTheme === 'light' ? ' text-[#828fa3]':' text-white'}  items-center bg-transparent`})} onClick={()=>removeCol(index)} >
              <XIcon size={25} className={`text-[#828fa3]`}/>
             </Button>}
                 </div>
              ))}
              </div>
             <div>
             <Button className="w-full rounded-full" type="button" onClick={appendCol}>
              <PlusIcon size={15}/>
             AddNewColumn</Button> 
             </div>
          
        
          
          <Button  className="w-full  rounded-full" type="submit" >
           Create New Board
          </Button>
        
          
          </form>
            </DialogContent>
        </Dialog>
        </Form>
    )
} 

