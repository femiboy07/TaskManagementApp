import { produce,current} from 'immer';


export const localData=(state,action)=>{
    return {...state,data:action.payload}
}


export const onSelectBoard=(state,action)=>{
    

    return {...state,selectedBoard:action.payload}
}


export const addBoard=(state,action)=>{
   const newBoard=action.payload
     const data=current(state.data)
     
    const newState= produce(data,draftState=>{
        draftState?.boards.push(newBoard)
    })

   return {...state,data:newState} 

}

export const deleteBoard=(state,action)=>{
    const currentBoardTab = action.payload;
    const data = current(state.data);
    const exist = data.boards.find((item) => item.name === currentBoardTab);
    if (exist) {
      const targetBoardIndex = data.boards.findIndex((item) => item.name === currentBoardTab);
      const newState = produce(data, (draftState) => {
        draftState.boards.splice(targetBoardIndex, 1);
      });
      return { ...state, data: newState };
    } else throw console.error('on delete board err');
}


export const onDeleteTask=(state,action)=>{
   const {task,currentBoard}=action.payload;

   const data=current(state.data);

   const exist = data.boards.find((item) => item.name === currentBoard);
  
   if(exist){
       //find which column is tasks located
       const boardIndex=data.boards.findIndex((bIndex)=>bIndex.name === currentBoard);

       const columnContainer= exist.columns.findIndex((item) => item.tasks?.find((item) => item.id === task.id));
    
             //get specific task 
             const taskIndex=exist.columns[columnContainer].tasks.findIndex((t)=>t.id === task.id);

             
                // we can now modify the state meaning the draftState with immmer library;
                const newState= produce(data,draftState=>{
                        draftState?.boards[boardIndex]?.columns[columnContainer].tasks.splice(taskIndex,1)


                   })

              return {...state,data:newState}     
            
       }
   }


export const onCurrentBoardStatus=(state,action)=>{
    const currentBoardTab=action.payload;
     const data=current(state.data);
    const currentBoard=data.boards.find((board)=>board.name === currentBoardTab)
    const targetBoardStatusArr=currentBoard.columns.map((item) => item.name);
    return {...state,currentBoardStatus:targetBoardStatusArr}

}

export const onAddTask=(state,action)=>{
    
    const {currentBoard,newTask}=action.payload;
    const data=current(state);

    const findBoard=data.findIndex((item)=>item.name === currentBoard);

    //lets find column Name;

    if(findBoard !== -1){
        const updateState=data.map((board,index)=>{
            if(index === findBoard){
                const columnIndex=board.columns.findIndex((col,index)=>col.name === newTask.status)
                    
                        if(columnIndex !== -1){
                            return {
                                ...board,
                                columns:board.columns.map((column,index)=>{
                                    if(index === columnIndex){
                                        return{
                                            ...column,
                                            tasks:[...column.tasks,newTask]
                                        }
                                    }
                                    return column;
                                })
                            }
                        }
                
                
                    return columnIndex;
                
            }
            return board;
        })
        return updateState;
    }

    return state;
    
}



export const onEditTask=(state,action)=>{
    const { currentBoardTab, newTask, oldTask } = action.payload;
    const data = current(state.data);
    console.log(data)
    const targetBoard = data.boards.find((item) => item.name === currentBoardTab);
    console.log(targetBoard,"targetbbb")
    const targetBoardIndex = data.boards.findIndex((item) => item.name === currentBoardTab);
     console.log(targetBoardIndex)
    const targetColumnIndex = targetBoard?.columns.findIndex((item) =>
      item.tasks?.find((task) => task.id === oldTask.id)
    );
    const newTargetColumnIndex = targetBoard.columns.findIndex((item) => item.name === newTask.status);
  
    const targetTaskIndex = targetBoard.columns[targetColumnIndex].tasks.findIndex((item) => item.id === oldTask.id);
  
    const newState = produce(data, (draftState) => {
      if (
        newTask.status.toLocaleLowerCase() !== oldTask.status.toLocaleLowerCase() ||
        targetColumnIndex !== newTargetColumnIndex
      ) {
        draftState.boards[targetBoardIndex]?.columns[targetColumnIndex].tasks.splice(targetTaskIndex, 1);
        draftState.boards[targetBoardIndex]?.columns[newTargetColumnIndex].tasks.push(newTask);
      } else draftState.boards[targetBoardIndex].columns[targetColumnIndex].tasks[targetTaskIndex] = newTask;
    });
    return { ...state, data: newState };
    
}
export const onDragDropTask = (state, action) => {
    const { currentBoardId, srcColumnId, destColumnId, draggable, newIndex ,srcIndex} = action.payload;

    return produce(state, draft => {
        const data = draft.data;
        const boardIndex = data.boards.findIndex(board => board.id === currentBoardId);

        if (boardIndex !== -1) {
            const board = data.boards[boardIndex];
            const sourceColumnIndex = board.columns.findIndex(column => column.id === srcColumnId);
            const sourceColumns=board.columns.find(column => column.id === srcColumnId);
            const destColumnIndex = board.columns.findIndex(column => column.id === destColumnId);

            if (sourceColumnIndex !== -1) {
                const sourceColumn = board.columns[sourceColumnIndex];
                let newDestTasks;
                let newDestColumn;
                let movedTaskIndex;
                let destinationColumn;

                if (srcColumnId === destColumnId) {
                    // If source and destination columns are the same
                     movedTaskIndex = sourceColumn.tasks.findIndex(task => task.id === sourceColumns.tasks[srcIndex].id);

                    if (movedTaskIndex !== -1) {
                        // Remove the task from its old position
                        const [movedTask] = sourceColumn.tasks.splice(movedTaskIndex, 1);
                        // Insert the task into its new position
                        sourceColumn.tasks.splice(newIndex, 0, movedTask);
                    }
                } else if (destColumnIndex !== -1) {
                    // If source and destination columns are different
                 destinationColumn = board.columns[destColumnIndex];
                    newDestTasks = [...destinationColumn.tasks];
                    const movedTaskIndex = sourceColumn.tasks.findIndex(task => task.id === sourceColumns.tasks[srcIndex].id);
                  



                    if (movedTaskIndex !== -1) {
                        // Remove the task from its old position in the source column
                        const [movedTask] = sourceColumn.tasks.splice(movedTaskIndex, 1);
                        newDestTasks.splice(newIndex, 0, movedTask);
                        // sourceColumns.tasks[srcIndex].status=newDestColumn;
                    
                        // destinationColumn.tasks[movedTaskIndex].status=newDestColumn

                    }
                }

                draft.data.boards[boardIndex] = {
                    ...board,
                    columns: board.columns.map(column =>
                        column.id === srcColumnId ? { ...column, tasks: sourceColumn.tasks } :
                        column.id === destColumnId ? { ...column, tasks: newDestTasks.map((item)=>{
                            return {...item,status:destinationColumn.name}
                        }) } :
                        column
                    )
                };
                
                // Check if selected board matches the current board being modified
                if (draft.selectedBoard && draft.selectedBoard.id === currentBoardId) {
                    // Update the selected board's columns
                    draft.selectedBoard.columns = draft.data.boards[boardIndex].columns;
                }
            }
        }
    });
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 */
export const onAddNewTask = (state, action) => {
    const { currentBoard, newTask } = action.payload;
    const data = current(state.data);

    

    const exist=data.boards.find((item)=>item.name === currentBoard);
    console.log(exist)

    if(exist){
        const boardIndex=data.boards.findIndex((item)=>item.name === currentBoard);
        console.log(boardIndex)

        const targetColumnIndex = exist?.columns?.findIndex((item) => item.name === newTask.status);
       console.log(targetColumnIndex)
      const newState = produce(data, draftState => {
        console.log(draftState.boards)
      draftState.boards[boardIndex].columns[targetColumnIndex].tasks.push(newTask);

      if(draftState.selectedBoard && draftState.selectedBoard.name === currentBoard){
          draftState.selectedBoard[boardIndex].columns[targetColumnIndex].tasks.push(newTask)
      }
    });
     return { ...state, data: newState,selectedBoard:newState };

    }

};

export const onEditBoard = (state, action) => {
    const { currentBoard, columnStatus } = action.payload;
  
    return produce(state, draft => {
      const boardIndex = draft.data.boards.findIndex(item => item.name === currentBoard);
  
      if (boardIndex !== -1) {
        const columnIndex = draft.data.boards[boardIndex].columns.findIndex(col => col.name === columnStatus);
  
        if (columnIndex !== -1) {
          const tasksLength = draft.data.boards[boardIndex].columns[columnIndex].tasks.length;
  
          if (tasksLength === 0) {
            draft.data.boards.forEach(board => {
              board.columns = board.columns.filter(col => col.name !== columnStatus);
            });
          }
        }
      }
    });
  };



export const onAddNewColumn = (state, action) => {
    const { currentBoard, newBoard } = action.payload;
        
    const data = current(state.data);

    const exist = data?.boards?.find((item) => item.name === currentBoard);
    if (exist) {
        const targetBoardIndex = data?.boards?.findIndex((item) => item.name === currentBoard);

        const newState = produce(data, (draftState) => {
            const existingBoard = draftState.boards[targetBoardIndex];
            if(newBoard.name){
            draftState.boards[targetBoardIndex].name=newBoard?.name
            }
            

            const updatedBoard = {
                ...existingBoard,
                
                columns: newBoard.columns.map((column) => {
                    // If the column already exists in the targetBoard, preserve its tasks
                    const existingColumn = existingBoard.columns.find((c) => c.id === column.id );
                    return {
                        ...column,
                    
                        tasks: existingColumn ? existingColumn.tasks : column.tasks,
                    };
                }),
            };

            draftState.boards[targetBoardIndex] = updatedBoard;
        });
        return { ...state, data: newState };
    } else {
        throw new Error('on edit board err');
    }
};

export const onEditSubtasks=(state,action)=>{
    const {columnStatus,currentBoard,tasks,subtask,check}=action.payload;

    return produce(state,draftState=>{
        const exist=draftState.data.boards.findIndex((b)=>b.name === currentBoard)

        if(exist !== -1){
            const columnIndex=draftState.data.boards[exist].columns.findIndex((col)=>col.name === columnStatus);

            if(columnIndex !== -1){
                //get task
                const taskIndex=draftState.data.boards[exist].columns[columnIndex].tasks.findIndex((t)=>t.id === tasks);

                if(taskIndex !== -1){

                const  subTaskIndex=draftState.data.boards[exist].columns[columnIndex].tasks[taskIndex].subtasks.findIndex((sub,index)=> index === subtask);
                
                if(subTaskIndex !== -1){
                    draftState.data.boards[exist].columns[columnIndex].tasks[taskIndex].subtasks[subTaskIndex].isCompleted=check
                }
             }
            }
        }
    })
}


export const onChangeStatus=(state,action)=>{

    const {origcolumnStatus,currentBoard,tasks,newColumnStatus}=action.payload;

    return produce(state,draftState=>{
        const exist=draftState.data.boards.findIndex((b)=>b.name === currentBoard);

        if(exist !== -1){
            const column=draftState.data.boards[exist].columns.findIndex((col)=>col.name === origcolumnStatus);

            if(column !== -1){
                const oldTask=draftState.data.boards[exist].columns[column].tasks.findIndex((task)=>task.id === tasks);
               
                const getTask=draftState.data.boards[exist].columns[column].tasks[oldTask];

                const newColumn=draftState.data.boards[exist].columns.findIndex((newcol)=>newcol.name === newColumnStatus);
                if(oldTask !== -1){
                // const tasl=draftState.data.boards[exist].columns[column].tasks[oldTask]
                draftState.data.boards[exist].columns[column].tasks.splice(oldTask,1)
                draftState.data.boards[exist].columns[newColumn].tasks.push(getTask);
                const changedIndex=draftState.data.boards[exist].columns[newColumn].tasks.findIndex((task)=>task.id === getTask.id);
                
                if(changedIndex !== -1){
                draftState.data.boards[exist].columns[newColumn].tasks[changedIndex]={
                      ...getTask,
                      status:newColumnStatus,
                      ...getTask.subtasks,
                      

                }
            }
                }
               
            }
        }

    })
}