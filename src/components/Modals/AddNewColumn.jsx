import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button, buttonVariants } from "../ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { addNewColumn, setCurrentBoardStatus } from "../../reduxApp/features/data/dataSlice";




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


export default function AddNewColumn({setActiveTab,activeBar}){
   const [addSubTask,setAddSubTask]=useState(false);
   const dispatch=useDispatch()
   const board=useSelector((state)=>state.data.data);
   const tab=useSelector((state)=>state.data.boardTab);
   const currentBoardStatus=useSelector((state)=>state.data.selectedBoard);
   const targetBoards=board.boards?.find((b)=>b.name === tab);
   const [closeModal,setCloseModal]=useState(false);
   const colorTheme=useSelector((state)=>state.data.colorTheme);





   function generateUniqueRandomNumber() {
    return uuidv4().replace(/-/g, '').slice(0, 10);
  }
    

  const form=useForm({
    defaultValues: {
      name:targetBoards.name,
      columns:targetBoards?.columns?.map((item)=>({
        id: item.id,
        name: item.name,
        tasks: item.tasks,
      })),
      id:targetBoards.id
},mode:'onChange'}) ;
  
    
  const forms= form;
  
  const {fields,append,remove}=  useFieldArray({
    control:forms.control,
    name:`columns`,
    
  })

  const watchFieldArray = forms.watch('columns') ;
  
  const controlledFields = fields?.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray?.[index],
    };
  });

  console.log(controlledFields,"controllFields")
  
  console.log(controlledFields,"fields"); 
  console.log(watchFieldArray,"watchFieldsArray")

  const theSame=watchFieldArray.find((item)=>item.name === 'Todo');
  console.log(theSame)
  
  const appendSubtask=()=>{
      append({name:"",id:targetBoards?.columns.length + 1,tasks:[]})
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
  setCloseModal(false)
    
}


  
    return (

    <Form {...forms}>
        
         <Dialog onOpenChange={setCloseModal} open={closeModal}>
         <DialogTrigger  asChild  >
         <div className="add-project flex flex-col mt-10  pr-5 ">
             <div className={`add-column flex flex-col justify-center    text-xl  w-[18rem] h-96 `}> 
          <Button  className={buttonVariants({variant:"sidecustom",className:` flex hover:bg-none  rounded-md  items-center  w-full text-3xl justify-center h-full ${colorTheme === 'light' ? 'bg-[rgba(130,143,163,0.4)] bg-gradient-to-b  from-startg via-middleg to-endg':'dark bg-[rgba(130,143,163,0.4)] bg-gradient-to-b  from-startg via-middleg to-endg text-[rgb(130,143,163)] '}`})} >
            <PlusIcon/>
            New Column
        </Button>
        </div>
         </div>
         </DialogTrigger>
       
      <DialogContent  className={` outline-none  border-none h-[450px] overflow-y-auto ${colorTheme === 'light' ? 'bg-card': 'dark bg-card text-foreground'}`} >
      <DialogHeader>
        <DialogTitle>
          Add New Column</DialogTitle>
        </DialogHeader>
       <form  className="outline-none border-none w-full space-y-4 flex flex-col justify-center"  onSubmit={forms.handleSubmit(handleSubmitColumn)} >
       <FormField 
          control={forms.control} 
          name="name"
          render={({ field }) => (
            <FormItem className=" relative w-full ">
                  <FormControl>
                    <Input  disabled className="outline-none focus:outline-none peer focus:border-blue-600  w-full "   {...field}   />
                    </FormControl>
                 <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]   '/>
            </FormItem>
        )}/>        

      <div className="flex flex-col"> 
      <FormLabel>Columns</FormLabel>
      {controlledFields.map((item, index) => (
          <div key={`${item.id}-${index}`}  className="flex items-center justify-center  w-full pt-2">
         <FormItem className='relative w-full'>  
          {/* <FormControl>        */}
         <Input defaultValue={item.name}  {...forms.setFocus(`columns`)} {...forms.register(`columns[${index}].name`,{required:true,validate:(value)=>hasDuplicates(value,index,watchFieldArray)})}  className="outline-none focus:outline-none peer focus:border-blue-600 h-full w-full "     />
          {/* </FormControl>          */}
         {forms.formState.errors.columns?.[index]?.name?.type === 'required' &&  <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>required</FormMessage>}
         {forms.formState.errors.columns?.[index]?.name?.type ===  "validate" && <FormMessage className='absolute right-5 -translate-y-1/2 top-[50%]  '>Used</FormMessage>} 
        </FormItem>
             
           <Button disabled={item.tasks.length > 0}className={buttonVariants({variant:'',size:'icon',className:`self-stretch flex-shrink ${colorTheme === 'light' ? ' text-[#828fa3]':' text-white'}  items-center bg-transparent`})}  type="button" onClick={()=>removeSubtask(index)} >
              <XIcon size={25} color="#828fa3"/>
           </Button>
          </div>

        ))}
      </div>
    
          <div>
           <Button className="w-full rounded-full" type="button" onClick={appendSubtask}>
            <PlusIcon size={15}/>
           AddNewColumn</Button> 
           </div>
        <div>
         
      </div>
      
        <Button  className="w-full mt-5 rounded-full" type="submit" >
        Save changes
        </Button>
       
       
    
      </form> 
      </DialogContent>
     
     </Dialog>
      </Form>
    
    )
        
        
    
}