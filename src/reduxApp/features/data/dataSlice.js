import { createSlice } from "@reduxjs/toolkit";
import { addBoard, 
    localData,
    onCurrentBoardStatus,
    onDragDropTask,
    onEditTask, 
    onSelectBoard ,
    onAddNewTask,
    onEditBoard,
    onAddNewColumn,
    onChangeStatus,
    onEditSubtasks,
    deleteBoard,
    onDeleteTask,
} from "./actions/dataSliceActions";


const initialState={
    data:[],
    colorTheme:'dark',
    currentBoardStatus:[],
    boardTab:'',
    selectedBoard:null,
}



export const dataSlice=createSlice({
    name:'data',
    initialState:initialState,

    reducers:{
        hydrate:(state,action)=>action.payload,

        getLocalData:(state,action)=>localData(state,action),
        selectedColumn:(state,action)=>onSelectBoard(state,action),
        addNewTask:(state,action)=>onAddNewTask(state,action),
        onDeleteBoard:(state,action)=>deleteBoard(state,action),
        addBoards:(state,action)=>addBoard(state,action),
        editBoard:(state,action)=>onEditBoard(state,action),
        deleteTask:(state,action)=>onDeleteTask(state,action),
        setTheme:(state,action)=>{
            state.colorTheme=action.payload;
        },
        editSubtask:(state,action)=>onEditSubtasks(state,action),
        addNewColumn:(state,action)=>onAddNewColumn(state,action),
        editTask:(state,action)=>onEditTask(state,action),
        setCurrentBoardStatus:(state,action)=>onCurrentBoardStatus(state,action),
        changeStatus:(state,action)=>onChangeStatus(state,action),
        setDragDropTask:(state,action)=>onDragDropTask(state,action),
        tabBoard:(state,action)=>{
          state.boardTab=action.payload;
        }
    }


})


export const {getLocalData,
     addBoards,
    editTask,
    setCurrentBoardStatus,
    deleteTask
    ,editSubtask,
    onDeleteBoard
    ,tabBoard
    ,selectedColumn
    
    ,setDragDropTask
    ,hydrate
    ,addNewTask
    ,editBoard
    ,addNewColumn
    ,changeStatus,
    setTheme
}=dataSlice.actions;

export default dataSlice.reducer;