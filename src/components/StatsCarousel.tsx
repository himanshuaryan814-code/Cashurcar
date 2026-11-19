import {useEffect,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent} from 'react';
import type {HomeStatistic} from '../lib/homeStats';

type StatsCarouselProps={stats:HomeStatistic[]};
type DragState={pointerId:number;startX:number;startScroll:number};

function StatItems({stats,copy=false}:{stats:HomeStatistic[];copy?:boolean}){
  return <div className={`stats-grid${copy?' stats-grid-copy':''}`} aria-hidden={copy||undefined}>{stats.map((stat,index)=><div key={`${index}-${stat.title}`}><strong>{stat.value}</strong><b>{stat.title}</b><p>{stat.description}</p></div>)}</div>;
}

export default function StatsCarousel({stats}:StatsCarouselProps){
  const viewport=useRef<HTMLDivElement>(null);
  const dragging=useRef<DragState|null>(null);
  const interactionTimer=useRef<number|undefined>(undefined);
  const[interacting,setInteracting]=useState(false);

  useEffect(()=>{
    return()=>{if(interactionTimer.current!==undefined)window.clearTimeout(interactionTimer.current)};
  },[]);

  const pauseAnimation=()=>{
    if(interactionTimer.current!==undefined)window.clearTimeout(interactionTimer.current);
    setInteracting(true);
  };

  const resumeAnimation=()=>{
    if(interactionTimer.current!==undefined)window.clearTimeout(interactionTimer.current);
    interactionTimer.current=window.setTimeout(()=>setInteracting(false),1000);
  };

  const startDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    pauseAnimation();
    if(event.pointerType!=='mouse'||event.button!==0)return;
    const element=viewport.current;
    if(!element)return;
    dragging.current={pointerId:event.pointerId,startX:event.clientX,startScroll:element.scrollLeft};
    element.setPointerCapture(event.pointerId);
  };

  const moveDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const drag=dragging.current;
    const element=viewport.current;
    if(!drag||!element)return;
    event.preventDefault();
    element.scrollLeft=drag.startScroll-(event.clientX-drag.startX);
  };

  const endDrag=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(dragging.current?.pointerId===event.pointerId)dragging.current=null;
    resumeAnimation();
  };

  const keepScrollWithinOneSet=()=>{
    const element=viewport.current;
    const firstSet=element?.querySelector<HTMLElement>('.stats-grid');
    if(!element||!firstSet)return;
    const maxScroll=Math.max(0,firstSet.offsetWidth-element.clientWidth);
    if(element.scrollLeft>maxScroll)element.scrollLeft=maxScroll;
  };

  return <div className={`stats-viewport${interacting?' is-interacting':''}`} ref={viewport} tabIndex={0} role="region" aria-label="CashUrCar statistics" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={()=>{if(dragging.current){dragging.current=null;resumeAnimation()}}} onScroll={keepScrollWithinOneSet} onWheel={()=>{pauseAnimation();resumeAnimation()}} onFocus={pauseAnimation} onBlur={resumeAnimation}>
    <div className="stats-track">
      <StatItems stats={stats}/>
      <StatItems stats={stats} copy/>
    </div>
  </div>;
}
