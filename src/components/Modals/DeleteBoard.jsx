import React, { useCallback, useEffect } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import DeleteButton from "../DeleteButton/DeleteButton";
import { onDeleteBoard, setCurrentBoardStatus, tabBoard } from "../../reduxApp/features/data/dataSlice";
import { store } from "../../reduxApp/store";





// gombess190@outlook.com

export default function DeleteBoard({tab,deleteBoard,setDeleteBoard,setTrigger}){
    const colorTheme=useSelector((state)=>state.data.colorTheme);
    const state=useSelector((state)=>state.data.data);
    const currentBoardStatus=useSelector((state)=>state.data.currentBoardStatus)
    const dispatch=useDispatch();

    const  handleDeleteBoard=useCallback(()=>{
       dispatch(onDeleteBoard(tab));
       const remainingBoards = state.boards?.filter(board => board.name !== tab);
       if (remainingBoards.length > 0) {
         dispatch(tabBoard(remainingBoards[0].name));
         dispatch(setCurrentBoardStatus(remainingBoards[0].name))
       } else {
         dispatch(tabBoard(null)); // or handle the case where no boards are left
       }

      
   
    },[dispatch, tab, state.boards])


    return (
          <Dialog onOpenChange={setTrigger}>
             <DialogTrigger onClick={()=>setDeleteBoard(true)} >
               <DeleteButton setDeleteButton={setDeleteBoard} />
             </DialogTrigger>
            <DialogContent className={` ${colorTheme === 'light' ? 'bg-card':'bg-card'}`}>
             <DialogHeader>
                <DialogTitle>Delete This Board?</DialogTitle>
             </DialogHeader>
                <div>
                <p>Are you sure you want to delete the {`${tab}`} board? This action will remove all columns and tasks and cannot be reversed.</p>
                </div>
                <div>
                  <DialogClose>
                  <Button onClick={handleDeleteBoard} className={buttonVariants({variant:"danger",className:'pl-16 mr-5 pr-16'})}>Delete</Button>
                  </DialogClose>
                   <DialogClose >
                   <Button className={buttonVariants({variant:"secondary",className:'pl-16  pr-16'})}>
                     Cancel
                     </Button>
                   </DialogClose>
                   
                </div>
             </DialogContent>
          </Dialog>
    )
} 