import {useEffect,useState} from 'react';

type PreloaderProps={onComplete:()=>void};

export default function Preloader({onComplete}:PreloaderProps){
  const[progress,setProgress]=useState(0);
  const[exiting,setExiting]=useState(false);

  useEffect(()=>{
    const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let intervalId:number|undefined;
    let finishTimer:number|undefined;
    let removeTimer:number|undefined;

    if(reducedMotion){
      setProgress(100);
      setExiting(true);
      removeTimer=window.setTimeout(onComplete,100);
    }else{
      let current=0;
      intervalId=window.setInterval(()=>{
        current=Math.min(current+1,100);
        setProgress(current);
        if(current===100){
          if(intervalId)window.clearInterval(intervalId);
          finishTimer=window.setTimeout(()=>setExiting(true),80);
          removeTimer=window.setTimeout(onComplete,580);
        }
      },18);
    }

    return()=>{
      if(intervalId)window.clearInterval(intervalId);
      if(finishTimer)window.clearTimeout(finishTimer);
      if(removeTimer)window.clearTimeout(removeTimer);
    };
  },[onComplete]);

  return <div className={`preloader${exiting?' is-exiting':''}`} role="status" aria-label="Loading CashUrCar" aria-live="off">
    <div className="preloader-content">
      <img className="preloader-logo" src="/Glossy%20CashUrCar%20Logo%20on%20Black.png" alt="CashUrCar"/>
      <span className="preloader-percent" aria-hidden="true">{progress}%</span>
      <div className="preloader-track" role="progressbar" aria-label="Loading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span style={{width:`${progress}%`}}/>
      </div>
    </div>
  </div>;
}
