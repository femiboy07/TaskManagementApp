import React, { useEffect, useState } from "react";





const useInitialGetWidth=()=>{
    const [width,setWidth]=useState(window.innerWidth);



    useEffect(()=>{
        const handleResize=()=>{
            setWidth(window.innerWidth)
        }

      
      window.addEventListener('resize',handleResize);

      return ()=>{
        window.removeEventListener('resize',handleResize);
        
    } 
    },[])
    return [width,setWidth]
}


export default useInitialGetWidth;