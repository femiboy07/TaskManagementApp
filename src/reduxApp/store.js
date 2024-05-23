import { configureStore } from "@reduxjs/toolkit";
import dataReducer from '../reduxApp/features/data/dataSlice'



 
const KEY = 'task-storage';
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(KEY);
    if (!serializedState) return undefined;

    return JSON.parse(serializedState);
  } catch (e) {
    return undefined;
  }
};



export const saveState=async(state)=>{
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY, serializedState);
      } catch (e) {
        console.error(e);
      }
}

  
export const store= configureStore({
    reducer :{
         data:dataReducer
    },
    preloadedState:loadState()
})



