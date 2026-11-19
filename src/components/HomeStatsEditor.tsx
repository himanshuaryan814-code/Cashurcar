import {useEffect,useState} from 'react';
import type {FormEvent} from 'react';
import {getHomeStats,saveHomeStats} from '../lib/api';
import {defaultHomeStats,type HomeStatistic} from '../lib/homeStats';

export default function HomeStatsEditor(){
  const[items,setItems]=useState<HomeStatistic[]>(defaultHomeStats.items);
  const[loading,setLoading]=useState(true);
  const[busy,setBusy]=useState(false);
  const[notice,setNotice]=useState('');
  const[error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const content=await getHomeStats();
        if(active)setItems(content.items);
      }catch(loadError){
        if(active)setError(loadError instanceof Error?loadError.message:'Could not load homepage statistics.');
      }finally{
        if(active)setLoading(false);
      }
    };
    void load();
    return()=>{active=false};
  },[]);

  const update=(index:number,field:keyof HomeStatistic,value:string)=>{
    setItems(current=>current.map((item,itemIndex)=>itemIndex===index?{...item,[field]:value}:item));
    setNotice('');
  };

  async function save(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setBusy(true);
    setNotice('');
    setError('');
    try{
      await saveHomeStats({items});
      setNotice('Homepage statistics saved.');
    }catch(saveError){
      setError(saveError instanceof Error?saveError.message:'Could not save homepage statistics.');
    }finally{
      setBusy(false);
    }
  }

  return <section className="form-panel homepage-stats-editor">
    <h2>Homepage Statistics</h2>
    <p className="demo-note">Edit the ten statistics shown on the homepage.</p>
    {loading?<p className="muted">Loading statistics…</p>:<form className="lead-form" onSubmit={save}>
      <div className="homepage-stats-fields">{items.map((item,index)=><fieldset className="homepage-stat-field" key={index}>
        <legend>Statistic {index+1}</legend>
        <label>Value<input required value={item.value} onChange={event=>update(index,'value',event.target.value)}/></label>
        <label>Title<input required value={item.title} onChange={event=>update(index,'title',event.target.value)}/></label>
        <label>Description<textarea required rows={2} value={item.description} onChange={event=>update(index,'description',event.target.value)}/></label>
      </fieldset>)}</div>
      {error&&<p className="form-error" role="alert">{error}</p>}
      {notice&&<p className="form-message" role="status">{notice}</p>}
      <button className="btn btn-red" disabled={busy}>{busy?'Saving…':'Save Statistics'}</button>
    </form>}
  </section>;
}
