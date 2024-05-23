import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { useDispatch } from "react-redux";
import { tabBoard } from "../../reduxApp/features/data/dataSlice";







export default function EditButton({handleEditBoardClick,setTrigger,tab}){
    const dispatch=useDispatch();
    
    return (
        <Button  id="edit"  className={buttonVariants({variant:"sidecustomlight",className:'w-full text-xl bg-transparent'})}>
            EditBoard
        </Button>
    )
}