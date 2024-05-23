import './App.css'
import Layout from './components/Layout/Layout.component';
import { getLocalData,hydrate,setCurrentBoardStatus, setTheme, tabBoard } from './reduxApp/features/data/dataSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadState, store } from './reduxApp/store';







function App() {
    
    const dispatch=useDispatch(); 
    const [dataLo,setDataLo]=useState(null)
    const [loading,setLoading]=useState(false);
    const colorTheme=useSelector((state)=>state.data.colorTheme);
    const themeChange=()=>colorTheme === 'dark' ? dispatch(setTheme('light')):dispatch(setTheme('dark'));
    const board=useSelector((state)=>state.data.data);


   
  useEffect(()=>{
    const persistedState = loadState();
    const fetchData=async()=>{
      setLoading(true)
  try{
    
    const response= await fetch('/data.json');
    const meet= await response.json()
    const get=meet;
    console.log(get)
    console.log(get.boards,"get")
    dispatch(getLocalData(get));
    dispatch(setCurrentBoardStatus(get.boards[0].name));
    dispatch(tabBoard(get.boards[0].name));
    }catch(error){
      console.error('Error fetching data',error)
    }finally{
      setLoading(false);
    }
    }
    if (persistedState) {
      
      store.dispatch(hydrate(persistedState.data));
     }
    if (!persistedState && !persistedState?.data?.data?.boards ) {
      fetchData();
    }
  },[dispatch])
    
    if(loading){
      return (
        <div className=' w-full h-full justify-center items-center'>...loading</div>
      )
    } 

    return (
         <div>
          <Layout themeChange={themeChange} board={board}/>
        </div>
    );
  }
export default App;
