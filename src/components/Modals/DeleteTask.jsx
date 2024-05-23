
import React from 'react'
import { Dialog, DialogTrigger,DialogContent,DialogHeader, DialogClose, DialogTitle } from '../ui/dialog';
import DeleteButton from '../DeleteButton/DeleteButton';
import { Button, buttonVariants } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask } from '../../reduxApp/features/data/dataSlice';



export default function DeleteTask({tab,deleteBoard,setDeleteBoard,setTrigger,tasks,setCardDropDown,cardDropDown}){
    const colorTheme=useSelector((state)=>state.data.colorTheme);
    const dispatch=useDispatch();

    const  handleDeleteTask=()=>{
       dispatch(deleteTask({task:tasks,currentBoard:tab}));
        
      
   }


    return (
          <Dialog  onOpenChange={setCardDropDown}>
             <DialogTrigger asChild onClick={()=>setCardDropDown(false)}>
              <Button className={buttonVariants({variant:'sidecustomlight',className:'bg-transparent text-xl '})}>DeleteTask</Button> 
             </DialogTrigger>
            <DialogContent className={` ${colorTheme === 'light' ? 'bg-card':'bg-card'} w-full max-w-md`}>
             <DialogHeader>
                <DialogTitle>Delete This Task?</DialogTitle>
             </DialogHeader>
                <div>
                <p>Are you sure you want to delete the {`${tab}`} board? This action will remove all columns and tasks and cannot be reversed.</p>
                </div>
                <div className='flex w-full'>
                  <DialogClose>
                  <Button onClick={handleDeleteTask} className={buttonVariants({variant:"danger",size:'xl',className:' w-1/2  mr-5 '})}>Delete</Button>
                  </DialogClose>
                   <DialogClose >
                   <Button className={buttonVariants({variant:"secondary", size:'xl',className:' w-1/2'})}>
                     Cancel
                     </Button>
                   </DialogClose>
                   
                </div>
             </DialogContent>
          </Dialog>
    )
} 