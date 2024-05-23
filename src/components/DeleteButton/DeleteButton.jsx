import React from "react";
import { Button, buttonVariants } from "../ui/button";







export default function DeleteButton({setDeleteButton}){
    return (
        <Button onClick={()=>setDeleteButton(true)} className={buttonVariants({variant:"sidecustomlight",className:'w-full text-xl bg-transparent'})}>
            DeleteBoard
        </Button>
    )
}