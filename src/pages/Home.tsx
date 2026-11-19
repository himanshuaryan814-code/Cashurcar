import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,ArrowUpRight,Wallet,ShieldCheck,ClipboardCheck,FileCheck,Youtube} from 'lucide-react';
import {getHomeStats,getVehicles} from '../lib/api';
import {defaultHomeStats} from '../lib/homeStats';
import type {Vehicle} from '../lib/data';
import VehicleCard from '../components/VehicleCard';
import StatsCarousel from '../components/StatsCarousel';

const YOUTUBE_CHANNEL_URL='https://www.youtube.com/@YOUR_CHANNEL';
const HERO_VIDEO_URL='https://www.youtube.com/embed/bajN2W7oPCU?autoplay=1&mute=1&loop=1&playlist=bajN2W7oPCU&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1';

function HeroVideo(){const[loaded,setLoaded]=useState(false);const[failed,setFailed]=useState(false);return <div className="hero-video">
  <img className="hero-poster" src="https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=2200&q=90" alt="" fetchPriority="high"/>
  <iframe className={`hero-youtube${loaded?' is-loaded':''}${failed?' has-error':''}`} src={HERO_VIDEO_URL} title="CashUrCar automotive video" allow="autoplay; encrypted-media; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>setLoaded(true)} onError={()=>setFailed(true)} allowFullScreen/>
</div>}

function PremiumHero(){return <section className="hero">
  <HeroVideo/>
  <div className="hero-overlay"/>
  <div className="hero-content">
    <span className="eyebrow light">WELCOME TO CASHURCAR</span>
    <h1>Find Your Perfect Drive.</h1>
    <p>Discover exceptional pre-owned cars, experience premium quality, and drive home your dream car with CashUrCar.</p>
    <div className="hero-actions">
      <Link className="btn btn-red" to="/buy-cars">Explore Cars<ArrowUpRight size={17}/></Link>
      <Link className="btn btn-outline-white" to="/sell-your-car">Sell Your Car<ArrowUpRight size={17}/></Link>
    </div>
    <a className="hero-youtube-link" href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer">
      <span className="hero-video-badge"><Youtube size={15}/> WATCH OUR LATEST VIDEOS</span>
      <span className="hero-channel-link">Visit Our YouTube Channel <ArrowUpRight size={14}/></span>
    </a>
  </div>
  <div className="hero-caption">CASHURCAR · DREAM IT. DRIVE IT.</div>
</section>}

export default function Home(){
  const[cars,setCars]=useState<Vehicle[]>([]);
  const[homeStats,setHomeStats]=useState(defaultHomeStats);
  useEffect(()=>{
    getVehicles().then(setCars);
    getHomeStats().then(setHomeStats).catch(error=>console.error('Could not load homepage statistics:',error));
  },[]);
  return <>
    <PremiumHero/>
    <section className="difference"><div className="section-wrap"><div className="center-heading"><span className="eyebrow">THE CASHURCAR DIFFERENCE</span><h2>Why Choose Us</h2><p>Exceptional cars. Transparent deals. A better driving experience.</p></div><StatsCarousel stats={homeStats.items}/><p className="stats-note">Your confidence matters at every step of the journey.</p></div></section>
    <section className="section-wrap collection"><div className="section-title-row"><div><span className="eyebrow">HANDPICKED FOR YOU</span><h2>Explore Our Collection.</h2><p>Discover exceptional pre-owned vehicles for every lifestyle.</p></div><Link className="text-link" to="/buy-cars">View All Vehicles <ArrowRight size={17}/></Link></div><div className="vehicle-grid">{cars.slice(0,3).map(c=><VehicleCard key={c.id} car={c}/>)}</div>{cars.length===0&&<p className="muted">Inventory is being updated. Please contact our team for current availability.</p>}</section>
    <section className="campaign" style={{backgroundImage:'linear-gradient(90deg,rgba(0,0,0,.65),rgba(0,0,0,.04)),url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=85)'}}><div><span className="eyebrow light">THE DRIVE YOU DESERVE</span><h2>A Better Way to Find<br/>Your Next Car.</h2><Link className="btn btn-white" to="/buy-cars">Explore the Collection <ArrowUpRight size={17}/></Link></div></section>
    <section className="inspection section-wrap"><div className="inspection-images"><img className="inspection-main" src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85" alt="Automotive technician inspecting a vehicle" loading="lazy"/><img src="https://images.unsplash.com/photo-1632823471565-1ecdf5c6b7e4?auto=format&fit=crop&w=800&q=85" alt="Vehicle detailing" loading="lazy"/><img src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=85" alt="Car interior" loading="lazy"/></div><div className="inspection-copy"><span className="eyebrow">CARE IN EVERY DETAIL</span><h2>Quality You Can See.<br/>Confidence You Can Feel.</h2><p>We believe buying a pre-owned car should feel clear and considered. Our team can guide you through vehicle details, documentation and the next steps.</p><Link className="text-link" to="/about">Learn About CashUrCar <ArrowRight size={17}/></Link></div></section>
    <section className="sell-band"><div className="sell-photo"/><div className="sell-copy"><span className="eyebrow light">READY FOR YOUR NEXT CHAPTER?</span><h2>Thinking of Selling<br/>Your Car?</h2><p>Get a competitive valuation with a simple, transparent selling process.</p><ul><li><ShieldCheck/> Professional vehicle evaluation</li><li><ClipboardCheck/> Transparent offers</li><li><FileCheck/> RC transfer assistance</li></ul><Link className="btn btn-red" to="/sell-your-car">Get My Valuation <ArrowUpRight size={17}/></Link></div></section>
    <section className="finance-strip section-wrap"><div><span className="eyebrow">FINANCE YOUR NEXT DRIVE</span><h2>Make Your Dream Car<br/>More Affordable.</h2><p>Estimate monthly payments and plan your budget before you visit.</p><Link className="btn btn-dark" to="/finance">Calculate Your EMI <ArrowUpRight size={17}/></Link></div><div className="finance-art"><div className="finance-art-card"><span>YOUR MONTHLY DRIVE</span><strong>EMI</strong><small>Calculate a payment estimate in seconds.</small><Wallet size={48}/></div></div></section>
    <section className="social-section"><div className="section-wrap social-inner"><div><span className="eyebrow">FOLLOW OUR JOURNEY</span><h2>Explore Life at CashUrCar.</h2><p>Vehicle walkarounds, dealership updates and stories from the road.</p></div><div className="social-links"><a href="https://www.instagram.com/cashurcar_/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight/></a><a href="https://www.youtube.com/@cashurcarr" target="_blank" rel="noreferrer">YouTube <ArrowUpRight/></a><a href="https://www.facebook.com/CashUrCaar/" target="_blank" rel="noreferrer">Facebook <ArrowUpRight/></a></div></div></section>
    <section className="final-cta" style={{backgroundImage:'linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.62)),url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=85)'}}><span className="eyebrow light">CASHURCAR · DREAM IT. DRIVE IT.</span><h2>Your Next Car Is Waiting.</h2><p>Find your perfect pre-owned car with CashUrCar.</p><div><Link className="btn btn-red" to="/buy-cars">Explore Vehicles</Link><Link className="btn btn-outline-white" to="/contact">Contact Us</Link></div></section>
    <section className="homepage-location"><div className="section-wrap"><div className="center-heading"><span className="eyebrow">VISIT OUR LOCATION</span><h2>Find Us on the Map</h2><p>Visit CashUrCar and explore our location. Get directions and plan your visit.</p></div><div className="homepage-map-frame"><iframe title="CashUrCar location on Google Maps" src="https://www.google.com/maps?q=28.6976731,77.1063925&z=17&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/></div><div className="homepage-map-actions"><a className="btn btn-red" href="https://www.google.com/maps/dir/?api=1&destination=28.6976731,77.1063925" target="_blank" rel="noreferrer">GET DIRECTIONS <ArrowUpRight size={17}/></a></div></div></section>
  </>;
}
