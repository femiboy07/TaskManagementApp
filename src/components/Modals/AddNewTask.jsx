import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import {Schema, z} from 'zod';
import { FormField, FormItem, FormLabel,FormControl,FormDescription,FormMessage,Form, useFormField } from "../ui/form";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "../ui/select";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import {  PlusIcon, XIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { DialogTrigger,Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { addNewTask } from "../../reduxApp/features/data/dataSlice";
import { nanoid } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { DialogClose } from "@radix-ui/react-dialog";






const formSchema=z.object({
  
     title:z.string().min(2,{
      message:'minimum of 2 words'
     }),
     description:z.string().max(100,{
      message:'not more than 100 words'
     }),
     subtasks:z.array(z.object({
        title:z.string({required_error:'this field is required'}).trim().min(1,{
          message:'Required'
        }),
        isCompleted:z.boolean()
     })),
     status:z.string()
})





export default  function AddNewTaskModal({tab,title}){
   const dispatch=useDispatch() 
   const board=useSelector((state)=>state.data.data);
   const currentBoardStatus=useSelector((state)=>state.data.currentBoardStatus);
   const targetBoard=board?.boards?.find((b)=>b.name === tab);
   const [closeModal,setCloseModal]=useState(true);
   const [initial,setInitial]=useState(false)
   const colorTheme=useSelector((state)=>state.data.colorTheme);
   console.log(targetBoard)
   console.log(currentBoardStatus);
   console.log(targetBoard?.columns)
   
  
  



const form=useForm({ resolver: zodResolver(formSchema.refine(
  (value)=>{
   
   
    return  !targetBoard?.columns?.some((column) =>
      column.tasks?.some((task) => task?.title.toLowerCase() === value?.title.toLowerCase())
    );  
  },{
    message:'Title name already used',
    path:['title']
  }
)),
  defaultValues: {
    title: "",
    description:"",
    status:currentBoardStatus[0],
    subtasks:[{title:"",isCompleted:false}],
    
  }});

  
 
  
// 
const forms=form;

const {fields,append,remove}=useFieldArray({
  control:forms.control,
  name:`subtasks`,
  
  
})



const appendSubtask=()=>{
    append({title:"",isCompleted:false})
}

const removeSubtask=useCallback((index)=>{
  remove(index)
},[remove]);




function generateUniqueRandomNumber() {
  return uuidv4().replace(/-/g, '').slice(0, 10);
}


const handleClearValues=()=>{
  
  forms.clearErrors()
  forms.setValue('title', '');
 forms.setValue('description', '');
 // Clear subtasks array (if needed)
 forms.setValue('subtasks', [{ title: "", isCompleted: false }]);
 forms.setValue('status', currentBoardStatus[0]);
 setInitial(false);
}

const handleSubmitTask=(data)=>{
 console.log(data)
if(!data) return;
  dispatch(addNewTask({currentBoard:tab,newTask:{
    title:data?.title,
    description:data?.description,
    subtasks:data?.subtasks,
    id:generateUniqueRandomNumber(),
    statusId:0,
    status:data?.status,
  }}))

 handleClearValues()
  
}

function handleTrigger(){
   setInitial(true)
   handleClearValues()
}
  
    
     return (
      <Form {...forms} className=" border-none outline-none">
       
          <Dialog  open={initial} onOpenChange={setInitial} > 
           
           <DialogTrigger onClick={handleTrigger}  className={buttonVariants({variant:"default",size:`${title === '' ? `icon`:''}`,className:`flex  cursor-pointer items-center pt-7 pb-7  ${title === ''?" rotate-90":""}   `})} >
           <div className={`flex   items-center text-lg ${title === '' ? 'rounded-full' :`rounded-full`}  pt-5 pb-5 `}>
            <PlusIcon className=" h-4 w-6 " /> 
            {title}
            </div> 
          </DialogTrigger>
         
        <DialogContent  className={` outline-none  border-none h-[450px] md:h-[600px] overflow-auto ${colorTheme === 'light' ? 'bg-card':' dark bg-card text-foreground'} `} >
        <DialogHeader className={`pt-10`}>
          <DialogTitle>
            Add New Task</DialogTitle>
          </DialogHeader>
         <form  className="outline-none border-none px-2 space-y-4 flex flex-col justify-center max-w-md "  onSubmit={forms.handleSubmit(handleSubmitTask)}>
           <FormField 
             control={forms.control} 
             name="title"
             render={({ field }) => (
                <FormItem className=" relative">
                  <FormLabel>title</FormLabel>
                  <FormControl >
                    <Input  className="outline-none focus:outline-none peer focus:border-blue-600 "   {...field}   />
                  </FormControl>
                 <FormMessage className='absolute right-5 top-1/2 h-full '/>
                </FormItem>
              )}/>
             
             <FormField 
             control={forms.control} 
             name="description" 
              render={({ field }) => (
                 <FormItem >
                  <FormLabel>description</FormLabel>
                  <FormControl >
                    <Textarea type="text"   placeholder="description"  {...field} className=" resize-none min-h-32  "  />
                  </FormControl>
                <FormMessage />
                </FormItem>
              )}/>
        <div className="flex flex-col"> 
          <FormLabel className='' >Subtask</FormLabel>
        {fields.map((item, index) => (
          <div key={`${item.id}-${index}`}  className="flex items-center justify-center  w-full pt-2">
            <FormField 
             control={forms.control} 
             key={`subtasks[${index}.title]`}
             name={`subtasks[${index}].title`}
             render={({ field }) => (
                <FormItem className=" relative w-full h-full ">
                  <FormControl>
                    <Input  className="outline-none focus:outline-none peer focus:border-blue-600 h-full w-full "   {...field}   />
                    
                  </FormControl>
                 <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]   '/>
                </FormItem>
              )}/>
            <Button className={buttonVariants({variant:'',size:'icon',className:`self-stretch flex-shrink ${colorTheme === 'light' ? ' text-[#828fa3]':' text-white'}  items-center bg-transparent`})} onClick={()=>removeSubtask(`subtasks[${index}].title`)} >
              <XIcon size={25} />
           </Button>
          </div>

        ))}
        </div>
          {fields.length < 7 &&
            <div>
             <Button className="w-full rounded-full" type="button" onClick={appendSubtask}>
              <PlusIcon size={15}/>
             AddNewSubtasks</Button> 
             </div>}
          <div>
            <FormField
            control={forms.control}
            name="status"
            render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} className=" bg-slate-950" defaultValue={field.value} >
                <FormControl >
                  <SelectTrigger >
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=" bg-white"> 
                  {currentBoardStatus?.map((item,index)=>(
                    <SelectItem key={index} value={item} >{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <FormMessage />
            </FormItem>
            )}
        />
        </div>
        
         <Button  className="w-full mt-5 rounded-full" type="submit"  >
             Create New Task
          </Button>
      </form> 
        </DialogContent>
       
       </Dialog>
        </Form>
        )
}




