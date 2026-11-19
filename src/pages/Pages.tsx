import {useEffect,useMemo,useRef,useState} from 'react';import type {FormEvent,ReactNode} from 'react';import {Link,useParams,useSearchParams,useNavigate} from 'react-router-dom';import {ArrowLeft,ArrowUpRight,Phone,MessageCircle,MapPin,CheckCircle2,Calculator,LogIn,Plus,Trash2,Upload,Search,RotateCcw} from 'lucide-react';import {getVehicles,submitLead} from '../lib/api';import {demoVehicles,money,type Vehicle} from '../lib/data';import VehicleCard from '../components/VehicleCard';import HomeStatsEditor from '../components/HomeStatsEditor';import {supabase,isSupabaseConfigured} from '../lib/supabase';
const buyPhone='+919821818922',sellPhone='+919213219885';
function PageHero({eyebrow,title,sub}:{eyebrow:string;title:string;sub:string}){return <div className="page-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{sub}</p></div>}
const BODY_TYPES=['SUV','Sedan','Hatchback','MUV/MPV','Coupe','Luxury'];
const FUEL_TYPES=['Petrol','Diesel','CNG','Electric','Hybrid'];
const TRANSMISSIONS=['Manual','Automatic'];
function bodyTypeMatches(value:string,selected:string){const normalized=value.trim().toLowerCase().replace(/[\s/-]/g,'');if(selected==='MUV/MPV')return ['muv','mpv','muvmpv'].includes(normalized);if(selected==='Luxury')return normalized.startsWith('luxury');return normalized===selected.toLowerCase()}
function SelectField({label,value,onChange,children,disabled=false}:{label:string;value:string;onChange:(value:string)=>void;children:ReactNode;disabled?:boolean}){return <label className="inventory-field"><span>{label}</span><select value={value} onChange={event=>onChange(event.target.value)} disabled={disabled}>{children}</select></label>}
export function Inventory(){
  const[cars,setCars]=useState<Vehicle[]>([]);
  const[q,setQ]=useState('');
  const[brand,setBrand]=useState('All');
  const[model,setModel]=useState('All');
  const[bodyType,setBodyType]=useState('All');
  const[fuel,setFuel]=useState('All');
  const[transmission,setTransmission]=useState('All');
  const[minPrice,setMinPrice]=useState('');
  const[maxPrice,setMaxPrice]=useState('');
  const[year,setYear]=useState('All');
  const[sort,setSort]=useState('recent');
  const[params]=useSearchParams();
  const resultsRef=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    getVehicles().then(setCars);
    const typeParam=params.get('type');
    if(typeParam){
      const selected=typeParam.toLowerCase()==='luxury cars'?'Luxury':['muv','mpv'].includes(typeParam.toLowerCase())?'MUV/MPV':typeParam;
      if(BODY_TYPES.includes(selected))setBodyType(selected);
    }
  },[]);
  const brands=useMemo(()=>Array.from(new Set(cars.map(car=>car.brand))).sort((a,b)=>a.localeCompare(b)),[cars]);
  const models=useMemo(()=>Array.from(new Set(cars.filter(car=>brand==='All'||car.brand===brand).map(car=>car.model))).sort((a,b)=>a.localeCompare(b)),[cars,brand]);
  const years=useMemo(()=>Array.from(new Set(cars.map(car=>car.year))).sort((a,b)=>b-a),[cars]);
  const shown=useMemo(()=>{
    const query=q.trim().toLowerCase();
    const min=minPrice===''?null:Number(minPrice);
    const max=maxPrice===''?null:Number(maxPrice);
    const filtered=cars.filter(car=>
      (!query||`${car.brand} ${car.model} ${car.year}`.toLowerCase().includes(query))&&
      (brand==='All'||car.brand===brand)&&
      (model==='All'||car.model===model)&&
      (bodyType==='All'||bodyTypeMatches(car.body_type,bodyType))&&
      (fuel==='All'||car.fuel.toLowerCase()===fuel.toLowerCase())&&
      (transmission==='All'||car.transmission.toLowerCase()===transmission.toLowerCase())&&
      (min===null||car.price>=min)&&
      (max===null||car.price<=max)&&
      (year==='All'||car.year===Number(year))
    );
    if(sort==='low')return filtered.sort((a,b)=>a.price-b.price);
    if(sort==='high')return filtered.sort((a,b)=>b.price-a.price);
    if(sort==='newest')return filtered.sort((a,b)=>b.year-a.year);
    if(sort==='oldest')return filtered.sort((a,b)=>a.year-b.year);
    return filtered;
  },[cars,q,brand,model,bodyType,fuel,transmission,minPrice,maxPrice,year,sort]);
  function resetFilters(){
    setQ('');
    setBrand('All');
    setModel('All');
    setBodyType('All');
    setFuel('All');
    setTransmission('All');
    setMinPrice('');
    setMaxPrice('');
    setYear('All');
    setSort('recent');
  }
  return <>
    <PageHero eyebrow="THE CASHURCAR COLLECTION" title="Explore All Vehicles." sub="Find the right car for your lifestyle and budget."/>
    <section className="inventory section-wrap">
      <form className="inventory-filter-panel" onSubmit={event=>{event.preventDefault();resultsRef.current?.scrollIntoView({behavior:'smooth',block:'start'})}}>
        <div className="inventory-filter-heading">
          <span className="eyebrow">FIND YOUR PERFECT MATCH.</span>
          <h2>Find the Car That Fits Your Life.</h2>
          <p>Explore our exclusive collection of premium pre-owned vehicles.</p>
        </div>
        <div className="inventory-filter-grid">
          <label className="inventory-field inventory-search-field"><span>Search by brand, model or year</span><div className="inventory-search-input"><Search size={17}/><input type="search" value={q} onChange={event=>setQ(event.target.value)} placeholder="e.g. Hyundai Creta 2022"/></div></label>
          <SelectField label="Brand" value={brand} onChange={value=>{setBrand(value);setModel('All')}}><option value="All">All brands</option>{brands.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Model" value={model} onChange={setModel} disabled={models.length===0}><option value="All">All models</option>{models.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Body Type" value={bodyType} onChange={setBodyType}><option value="All">All body types</option>{BODY_TYPES.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Fuel Type" value={fuel} onChange={setFuel}><option value="All">All fuel types</option>{FUEL_TYPES.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Transmission" value={transmission} onChange={setTransmission}><option value="All">All transmissions</option>{TRANSMISSIONS.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <label className="inventory-field"><span>Minimum Price (₹)</span><input type="number" min="0" step="10000" inputMode="numeric" value={minPrice} onChange={event=>setMinPrice(event.target.value)} placeholder="No minimum"/></label>
          <label className="inventory-field"><span>Maximum Price (₹)</span><input type="number" min="0" step="10000" inputMode="numeric" value={maxPrice} onChange={event=>setMaxPrice(event.target.value)} placeholder="No maximum"/></label>
          <SelectField label="Manufacturing Year" value={year} onChange={setYear}><option value="All">All years</option>{years.map(value=><option key={value} value={value}>{value}</option>)}</SelectField>
          <SelectField label="Sort By" value={sort} onChange={setSort}><option value="recent">Recently Added</option><option value="low">Price Low to High</option><option value="high">Price High to Low</option><option value="newest">Newest Model Year</option><option value="oldest">Oldest Model Year</option></SelectField>
        </div>
        <div className="inventory-filter-actions"><button className="btn btn-red inventory-search-button" type="submit"><Search size={17}/>Search Cars<span>({shown.length})</span></button><button className="inventory-reset-button" type="button" onClick={resetFilters}><RotateCcw size={15}/>Reset Filters</button></div>
      </form>
      <section className="inventory-results" ref={resultsRef}>
        <div className="inventory-results-heading"><div><span className="eyebrow">AVAILABLE VEHICLES</span><h2>Explore Our Collection.</h2></div><p className="inventory-count">{shown.length} {shown.length===1?'vehicle':'vehicles'} {isSupabaseConfigured?'in current inventory':'in sample preview'}</p></div>
        {shown.length?<div className="vehicle-grid">{shown.map(car=><VehicleCard key={car.id} car={car}/>)}</div>:<div className="empty-state inventory-empty-state"><h3>No matching vehicles found.</h3><p>Try adjusting your filters to explore more of our collection.</p><button className="btn btn-dark" type="button" onClick={resetFilters}>Reset Filters</button></div>}
        {!isSupabaseConfigured&&<p className="demo-note">Sample preview only — these are not confirmed available cars. Connect Supabase and add verified inventory in the admin dashboard.</p>}
      </section>
    </section>
  </>;
}
export function CarDetail(){const{slug}=useParams();const[cars,setCars]=useState<Vehicle[]>(demoVehicles);const[photo,setPhoto]=useState('');const[show,setShow]=useState(false);useEffect(()=>{getVehicles().then(setCars)},[]);const car=cars.find(c=>c.slug===slug);if(!car)return <div className="empty-state section-wrap"><h2>Vehicle not found</h2><Link to="/buy-cars" className="text-link">Back to inventory</Link></div>;const msg=encodeURIComponent(`Hi CashUrCar, I am interested in the ${car.year} ${car.brand} ${car.model} listed at ${money(car.price)}. Please share more details.`);return <section className="detail-page section-wrap"><Link to="/buy-cars" className="back-link"><ArrowLeft size={16}/> Back to all cars</Link><div className="detail-layout"><div><div className="detail-photo"><img src={photo||car.image_url} alt={`${car.brand} ${car.model}`}/></div><div className="detail-thumbs"><button onClick={()=>setPhoto(car.image_url)}><img src={car.image_url} alt="Vehicle view"/></button></div><div className="detail-description"><h2>Vehicle Overview</h2><p>{car.description||`Explore this ${car.year} ${car.brand} ${car.model}. Contact CashUrCar to confirm availability, vehicle condition, documentation and arrange a viewing.`}</p><p className="demo-note">Vehicle details and availability must be confirmed with CashUrCar before purchase.</p></div></div><aside className="detail-aside"><span className="eyebrow">CASHURCAR COLLECTION</span><h1>{car.brand} {car.model}</h1><p className="detail-year">{car.year} · {car.body_type}</p><strong className="detail-price">{money(car.price)}</strong><div className="detail-specs"><span>Fuel<strong>{car.fuel}</strong></span><span>Transmission<strong>{car.transmission}</strong></span><span>Kilometres<strong>{car.km.toLocaleString('en-IN')} km</strong></span><span>Ownership<strong>{car.ownership||'Please enquire'}</strong></span></div><a className="btn btn-red full" href={`tel:${buyPhone}`}><Phone/> Call to Enquire</a><a className="btn btn-outline full" href={`https://wa.me/${buyPhone.slice(1)}?text=${msg}`} target="_blank" rel="noreferrer"><MessageCircle/> WhatsApp Enquiry</a><button className="btn btn-dark full" onClick={()=>setShow(!show)}>Schedule Test Drive</button>{show&&<LeadForm table="test_drive_bookings" button="Request Test Drive" extra={{vehicle_id:car.id,vehicle_name:`${car.brand} ${car.model}`}}/>}<p className="tiny-note">Asking price and availability are subject to confirmation.</p></aside></div></section>}
function LeadForm({table,button,extra={}}:{table:string;button:string;extra?:Record<string,unknown>}){const[form,setForm]=useState<Record<string,string>>({name:'',phone:'',email:'',message:''});const[busy,setBusy]=useState(false);const[done,setDone]=useState(false);const[error,setError]=useState('');const update=(k:string,v:string)=>setForm(p=>({...p,[k]:v}));async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError('');try{await submitLead(table,{...form,...extra});setDone(true)}catch(err){setError(err instanceof Error?err.message:'Could not submit. Please try again.')}finally{setBusy(false)}}if(done)return <div className="success-state"><CheckCircle2/><h3>Thank you!</h3><p>Your enquiry has been received. Our team will contact you.</p></div>;return <form className="lead-form" onSubmit={submit}><label>Your Name<input required value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Full name"/></label><label>Mobile Number<input required pattern="[0-9+() -]{8,18}" value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="Your phone number"/></label><label>Email Address<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@example.com"/></label><label>Message<textarea value={form.message} onChange={e=>update('message',e.target.value)} placeholder="Tell us how we can help" rows={3}/></label>{error&&<p className="form-error">{error}</p>}<button className="btn btn-red full" disabled={busy}>{busy?'Submitting…':button}</button></form>}
export function SellCar(){const[extra,setExtra]=useState<Record<string,string>>({brand:'',model:'',year:'',registration:'',km:'',fuel:'Petrol',transmission:'Manual',expected_price:'',location:'',condition:''});const[files,setFiles]=useState<FileList|null>(null);const[done,setDone]=useState(false);const[busy,setBusy]=useState(false);const[err,setErr]=useState('');const[base,setBase]=useState({name:'',phone:'',email:''});async function submit(e:FormEvent){e.preventDefault();setBusy(true);setErr('');try{let image_urls:string[]=[];if(isSupabaseConfigured&&supabase&&files){for(const f of Array.from(files)){const path=`seller-enquiries/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.-]/g,'-')}`;const{error}=await supabase.storage.from('lead-uploads').upload(path,f);if(error)throw error;image_urls.push(path)}}await submitLead('sell_enquiries',{...base,...extra,image_urls});setDone(true)}catch(e){setErr(e instanceof Error?e.message:'Submission failed')}finally{setBusy(false)}}return <><PageHero eyebrow="SELL WITH CONFIDENCE" title="Your Car Deserves a Better Deal." sub="Share a few details and our team will get in touch about the next steps."/><section className="form-section section-wrap"><div className="form-intro"><span className="eyebrow">A SIMPLE FOUR-STEP PROCESS</span><h2>Sell your car, simply.</h2><ol><li><b>01</b> Submit your details</li><li><b>02</b> Vehicle evaluation</li><li><b>03</b> Receive an offer</li><li><b>04</b> Complete documentation</li></ol><p>Our team will contact you to understand your vehicle and discuss a valuation. Any offer is subject to inspection and verification.</p></div><div className="form-panel"><h2>Get My Best Offer</h2>{done?<div className="success-state"><CheckCircle2/><h3>Details submitted.</h3><p>Thank you. CashUrCar will contact you soon.</p></div>:<form className="lead-form two-col" onSubmit={submit}><label>Name<input required value={base.name} onChange={e=>setBase({...base,name:e.target.value})}/></label><label>Mobile<input required value={base.phone} onChange={e=>setBase({...base,phone:e.target.value})}/></label><label>Email<input type="email" value={base.email} onChange={e=>setBase({...base,email:e.target.value})}/></label><label>Brand<input required value={extra.brand} onChange={e=>setExtra({...extra,brand:e.target.value})} placeholder="e.g. Hyundai"/></label><label>Model<input required value={extra.model} onChange={e=>setExtra({...extra,model:e.target.value})}/></label><label>Manufacturing Year<input type="number" min="1990" max="2027" value={extra.year} onChange={e=>setExtra({...extra,year:e.target.value})}/></label><label>Registration Number<input value={extra.registration} onChange={e=>setExtra({...extra,registration:e.target.value})}/></label><label>Kilometres Driven<input type="number" value={extra.km} onChange={e=>setExtra({...extra,km:e.target.value})}/></label><label>Fuel<select value={extra.fuel} onChange={e=>setExtra({...extra,fuel:e.target.value})}><option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option><option>Hybrid</option></select></label><label>Transmission<select value={extra.transmission} onChange={e=>setExtra({...extra,transmission:e.target.value})}><option>Manual</option><option>Automatic</option></select></label><label>Expected Price (₹)<input type="number" value={extra.expected_price} onChange={e=>setExtra({...extra,expected_price:e.target.value})}/></label><label>Current Location<input value={extra.location} onChange={e=>setExtra({...extra,location:e.target.value})}/></label><label>Vehicle Condition<input value={extra.condition} onChange={e=>setExtra({...extra,condition:e.target.value})} placeholder="Excellent / Good / Fair"/></label><label className="span-two">Additional Information<textarea value={extra.additional_info||''} onChange={e=>setExtra({...extra,additional_info:e.target.value})}/></label><label className="span-two upload-label"><Upload/> Vehicle photographs<input type="file" accept="image/*" multiple onChange={e=>setFiles(e.target.files)}/><small>{files?.length?`${files.length} file(s) selected`:'Select multiple images if available'}</small></label>{err&&<p className="form-error span-two">{err}</p>}<button className="btn btn-red span-two" disabled={busy}>{busy?'Submitting…':'Get My Best Offer'}</button></form>}</div></section></>}
export function Finance(){const[price,setPrice]=useState(1200000);const[down,setDown]=useState(200000);const[rate,setRate]=useState(10.5);const[years,setYears]=useState(5);const principal=Math.max(0,price-down);const n=years*12;const r=rate/1200;const emi=principal===0?0:r===0?principal/n:principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);const interest=emi*n-principal;return <><PageHero eyebrow="FINANCE YOUR NEXT DRIVE" title="Make Your Dream Car More Affordable." sub="Estimate your monthly payments and plan your budget with confidence."/><section className="finance-page section-wrap"><div className="calculator-panel"><div><span className="eyebrow">EMI CALCULATOR</span><h2>Plan your monthly payment.</h2><p>Adjust the values to see an estimated loan repayment.</p><label>Car Price <strong>{money(price)}</strong><input type="range" min="100000" max="10000000" step="25000" value={price} onChange={e=>setPrice(+e.target.value)}/></label><label>Down Payment <strong>{money(down)}</strong><input type="range" min="0" max={price} step="10000" value={Math.min(down,price)} onChange={e=>setDown(+e.target.value)}/></label><label>Annual Interest Rate <strong>{rate.toFixed(1)}%</strong><input type="range" min="5" max="20" step="0.1" value={rate} onChange={e=>setRate(+e.target.value)}/></label><label>Loan Tenure <strong>{years} years</strong><input type="range" min="1" max="7" step="1" value={years} onChange={e=>setYears(+e.target.value)}/></label><button className="text-link" onClick={()=>{setPrice(1200000);setDown(200000);setRate(10.5);setYears(5)}}>Reset calculator</button></div><div className="emi-result"><span>ESTIMATED MONTHLY EMI</span><strong>{money(Math.round(emi))}</strong><div className="emi-bar"><i style={{width:`${principal+interest>0?principal/(principal+interest)*100:0}%`}}/></div><div className="emi-breakdown"><p>Loan amount <b>{money(principal)}</b></p><p>Total interest <b>{money(Math.round(interest))}</b></p><p>Total repayment <b>{money(Math.round(principal+interest))}</b></p></div><p className="tiny-note">Illustrative estimate only. Actual rates, fees, eligibility and loan approval are determined by the lender.</p></div></div><div className="finance-enquiry"><div><span className="eyebrow">NEED HELP?</span><h2>Talk to our team about finance.</h2><p>Leave your details and CashUrCar can guide you through the next steps.</p></div><LeadForm table="finance_enquiries" button="Request Finance Assistance" extra={{car_price:price,down_payment:down,interest_rate:rate,tenure_years:years,estimated_emi:Math.round(emi)}}/></div></section></>}
export function About(){return <><PageHero eyebrow="OUR STORY" title="A Better Way to Move Forward." sub="At CashUrCar, we want buying or selling a pre-owned car to feel clear, convenient and considered."/><section className="about-story section-wrap"><img src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1400&q=85" alt="Premium car showroom"/><div><span className="eyebrow">THE CASHURCAR APPROACH</span><h2>Trust is part of every journey.</h2><p>CashUrCar helps customers explore pre-owned vehicles and connect with a team for vehicle information, test drives, finance guidance and ownership-transfer assistance.</p><p>We believe the right decision starts with transparent conversations and clear vehicle information. Visit our Rohini, Delhi location to speak with the team.</p><Link className="btn btn-red" to="/contact">Visit CashUrCar <ArrowUpRight/></Link></div></section><section className="about-values"><div className="section-wrap"><span className="eyebrow">WHAT MATTERS TO US</span><h2>Clear information. Helpful people. Better decisions.</h2><div className="value-grid"><div><b>01 / Transparency</b><p>Clear conversations about price, vehicle details and next steps.</p></div><div><b>02 / Guidance</b><p>Support through enquiries, test drives and documentation.</p></div><div><b>03 / Convenience</b><p>A straightforward way to explore, compare and enquire.</p></div></div></div></section></>}
export function Contact(){return <><PageHero eyebrow="WE'RE HERE TO HELP" title="Let's Talk Cars." sub="Speak with our team, plan a visit or send us your enquiry."/><section className="contact-layout section-wrap"><div className="contact-details"><span className="eyebrow">CASHURCAR · ROHINI</span><h2>Visit our dealership.</h2><p><MapPin/> A2/137, Near ICICI Bank, Pocket A-2, Sector 3, Sector 3A, Rohini, Delhi – 110085, India.</p><p><Phone/> Buy Cars: <a href={`tel:${buyPhone}`}>+91 98218 18922</a></p><p><Phone/> Sell Cars: <a href={`tel:${sellPhone}`}>+91 92132 19885</a></p><a className="btn btn-dark" href="https://maps.app.goo.gl/o4C2bZVzqAL8E1yx5" target="_blank" rel="noreferrer">Get Directions <ArrowUpRight/></a><div className="map-frame"><iframe title="CashUrCar location" src="https://www.google.com/maps?q=A2%2F137%2C%20Sector%203%2C%20Rohini%2C%20Delhi&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div><div className="form-panel"><h2>Send an Enquiry</h2><LeadForm table="contact_enquiries" button="Send Message"/></div></section></>}
export function Account(){const[mode,setMode]=useState<'login'|'signup'|'forgot'>('login');const[email,setEmail]=useState('');const[password,setPassword]=useState('');const[name,setName]=useState('');const[msg,setMsg]=useState('');const[busy,setBusy]=useState(false);const nav=useNavigate();async function submit(e:FormEvent){e.preventDefault();if(!supabase){setMsg('Connect Supabase to enable secure customer accounts. Admin access is never available in demo mode.');return}setBusy(true);setMsg('');try{if(mode==='signup'){const{error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});if(error)throw error;setMsg('Check your email to confirm your account.')}else if(mode==='forgot'){const{error}=await supabase.auth.resetPasswordForEmail(email);if(error)throw error;setMsg('Password reset email sent.')}else{const{data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;const{data:profile}=await supabase.from('profiles').select('role').eq('id',data.user.id).single();nav(profile?.role==='admin'?'/admin/dashboard':'/account/profile')}}catch(e){setMsg(e instanceof Error?e.message:'Authentication failed')}finally{setBusy(false)}}return <section className="account-page"><div className="account-card"><span className="eyebrow">CASHURCAR ACCOUNT</span><h1>{mode==='login'?'Welcome Back.':mode==='signup'?'Create Your Account.':'Reset Password.'}</h1><p>Save vehicles and keep track of your enquiries.</p><form className="lead-form" onSubmit={submit}>{mode==='signup'&&<label>Full Name<input required value={name} onChange={e=>setName(e.target.value)}/></label>}<label>Email Address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>{mode!=='forgot'&&<label>Password<input required type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)}/></label>}{msg&&<p className="form-message">{msg}</p>}<button className="btn btn-red full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Login':mode==='signup'?'Create Account':'Send Reset Link'}</button></form><div className="account-switch"><button onClick={()=>{setMode(mode==='login'?'signup':'login');setMsg('')}}>{mode==='login'?"New here? Create an account":'Back to login'}</button>{mode==='login'&&<button onClick={()=>setMode('forgot')}>Forgot password?</button>}</div></div></section>}
export function Admin(){
  const[user,setUser]=useState<any>(null);
  const[role,setRole]=useState<string|null>(null);
  const[roleLoaded,setRoleLoaded]=useState(false);
  const[cars,setCars]=useState<Vehicle[]>([]);
  const[leads,setLeads]=useState<any[]>([]);
  const[form,setForm]=useState<any>({brand:'',model:'',year:2022,price:0,fuel:'Petrol',transmission:'Manual',km:0,body_type:'SUV',image_url:'',slug:'',status:'available',featured:false});
  const[notice,setNotice]=useState('');
  const[busy,setBusy]=useState(false);
  useEffect(()=>{
    const client=supabase;
    if(client){
      client.auth.getUser().then(async({data})=>{
        setUser(data.user);
        if(data.user){
          const{data:profile}=await client.from('profiles').select('role').eq('id',data.user.id).single();
          setRole(profile?.role||'customer');
        }
        setRoleLoaded(true);
      });
      getVehicles().then(setCars);
      (async()=>{
        const{data}=await client.from('buy_enquiries').select('*').order('created_at',{ascending:false}).limit(50);
        setLeads(data||[]);
      })();
    }
  },[]);
  async function add(e:FormEvent){
    e.preventDefault();
    if(!supabase)return;
    setBusy(true);
    const slug=form.slug||`${form.brand}-${form.model}-${form.year}`.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const{error}=await supabase.from('vehicles').insert({...form,slug});
    setNotice(error?error.message:'Vehicle saved. Refresh to see updated inventory.');
    if(!error){
      setForm({brand:'',model:'',year:2022,price:0,fuel:'Petrol',transmission:'Manual',km:0,body_type:'SUV',image_url:'',slug:'',status:'available',featured:false});
      getVehicles().then(setCars);
    }
    setBusy(false);
  }
  async function remove(id:string){
    if(!supabase||!confirm('Delete this vehicle?'))return;
    const{error}=await supabase.from('vehicles').delete().eq('id',id);
    setNotice(error?.message||'Vehicle deleted');
    getVehicles().then(setCars);
  }
  async function logout(){await supabase?.auth.signOut();location.href='/account'}
  if(!isSupabaseConfigured)return <div className="section-wrap empty-state"><h1>Admin setup required</h1><p>Configure Supabase, run the SQL setup and promote an approved user to admin. Admin features stay disabled until then.</p><Link to="/account" className="btn btn-dark">Go to Account Login</Link></div>;
  if(!roleLoaded)return <div className="section-wrap empty-state"><h1>Checking access…</h1></div>;
  if(!user)return <div className="section-wrap empty-state"><h1>Admin login required</h1><p>Sign in with an authorized administrator account.</p><Link to="/account" className="btn btn-dark">Login</Link></div>;
  if(role!=='admin')return <div className="section-wrap empty-state"><h1>Access restricted</h1><p>This account does not have administrator permissions.</p><Link to="/" className="btn btn-dark">Back to website</Link></div>;
  return <section className="admin-page section-wrap">
    <div className="admin-head"><div><span className="eyebrow">DEALERSHIP MANAGEMENT</span><h1>Admin Dashboard</h1><p>{user.email}</p></div><button className="btn btn-outline" onClick={logout}>Log Out</button></div>
    {notice&&<p className="form-message">{notice}</p>}
    <div className="admin-stats"><div><span>Total vehicles</span><b>{cars.length}</b></div><div><span>Available vehicles</span><b>{cars.filter(c=>c.status==='available').length}</b></div><div><span>New buyer leads loaded</span><b>{leads.length}</b></div></div>
    <div className="admin-grid">
      <div className="form-panel"><h2><Plus/> Add Vehicle</h2><form className="lead-form two-col" onSubmit={add}>{[['brand','Brand'],['model','Model'],['year','Year'],['price','Price (₹)'],['km','Kilometres'],['image_url','Main image URL'],['slug','URL slug']].map(([k,l])=><label key={k}>{l}<input required={k!=='slug'} type={['year','price','km'].includes(k)?'number':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:['year','price','km'].includes(k)?+e.target.value:e.target.value})}/></label>)}<label>Fuel<select value={form.fuel} onChange={e=>setForm({...form,fuel:e.target.value})}><option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option><option>Hybrid</option></select></label><label>Transmission<select value={form.transmission} onChange={e=>setForm({...form,transmission:e.target.value})}><option>Manual</option><option>Automatic</option></select></label><label>Body Type<select value={form.body_type} onChange={e=>setForm({...form,body_type:e.target.value})}>{['SUV','Sedan','Hatchback','Luxury Cars','MUV'].map(x=><option>{x}</option>)}</select></label><label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>available</option><option>sold</option></select></label><label className="check-label"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Featured on homepage</label><button className="btn btn-red span-two" disabled={busy}>{busy?'Saving…':'Save Vehicle'}</button></form></div>
      <div className="form-panel"><h2>Inventory</h2>{cars.map(c=><div className="admin-row" key={c.id}><img src={c.image_url} alt=""/><div><b>{c.brand} {c.model}</b><small>{c.year} · {money(c.price)}</small></div><button onClick={()=>remove(c.id)} aria-label="Delete vehicle"><Trash2/></button></div>)}<h2 className="mt-24">Recent Buyer Enquiries</h2>{leads.length?leads.map(l=><div className="lead-row" key={l.id}><b>{l.name||'Customer'}</b><span>{l.phone}</span><small>{l.created_at?new Date(l.created_at).toLocaleDateString():''}</small></div>):<p className="muted">No buyer leads loaded.</p>}</div>
    </div>
    <HomeStatsEditor/>
  </section>;
}
