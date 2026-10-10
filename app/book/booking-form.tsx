"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Globe2, Video } from "lucide-react";

const slots = ["09:00","10:00","11:00","12:00","14:00","15:00","16:00"];
const zones = ["Europe/Budapest"];
function nextBusinessDays(){const days:Date[]=[];const cursor=new Date();cursor.setDate(cursor.getDate()+1);while(days.length<5){if(cursor.getDay()!==0&&cursor.getDay()!==6)days.push(new Date(cursor));cursor.setDate(cursor.getDate()+1)}return days}
function isoDate(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`}

export default function BookingForm(){
  const days=useMemo(nextBusinessDays,[]);const [date,setDate]=useState(isoDate(days[0]));const [time,setTime]=useState("");const [timezone,setTimezone]=useState("Europe/Budapest");const [booked,setBooked]=useState<string[]>([]);const [status,setStatus]=useState<"idle"|"sending"|"success">("idle");const [error,setError]=useState("");
  useEffect(()=>{setTime("");fetch(`/api/bookings?date=${date}`).then(r=>r.json()).then((data:unknown)=>{const payload=data as {booked?:unknown};setBooked(Array.isArray(payload.booked)?payload.booked.filter((item):item is string=>typeof item==="string"):[])}).catch(()=>setBooked([]))},[date]);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setError("");if(!time){setError("Choose an available time to continue.");return}setStatus("sending");const values=Object.fromEntries(new FormData(event.currentTarget));const response=await fetch("/api/bookings",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...values,date,time,timezone})});const data=await response.json().catch(()=>({})) as {error?:string};if(!response.ok){setError(data.error||"Something went wrong.");setStatus("idle");if(response.status===409)setBooked(v=>[...v,time]);return}setStatus("success")}
  return <main className="booking-page">
    <nav className="booking-nav"><Link href="/"><img src="/logo/evlv-logo-dark.png" alt="EVLV" /></Link><Link className="back-link" href="/"><ArrowLeft size={15}/>Back to hub</Link></nav>
    <section className="booking-layout">
      <aside className="booking-aside"><p className="eyebrow">EVLV Today Pep Talk</p><h1>Bring the question.</h1><p>Fifteen minutes with someone who does this for a living. Bring what you are trying to figure out: a symptom, something you read about peptides, or a protocol you do not fully understand.</p><p className="boundary-note">Our wellness team handles the conversation. If it needs a physician, we will say so clearly instead of guessing.</p><div className="detail"><Clock3 size={17}/><span>15 minutes</span></div><div className="detail"><Video size={17}/><span>Online video call</span></div><div className="detail"><Globe2 size={17}/><span>General wellness education</span></div></aside>
      <div className="booking-main">
        {status==="success"?<div className="confirmation"><span className="confirmation-icon"><Check size={28}/></span><p className="step-label">Booking confirmed</p><h2>You&apos;re on the calendar.</h2><p>We&apos;ve reserved <strong>{date} at {time}</strong> ({timezone}).<br/>The EVLV team will follow up using the email you provided.</p><Link href="/">Return to brand hub</Link></div>:<>
          <p className="step-label">Select a time</p><h2>When works for you?</h2>
          <div className="date-strip">{days.map(day=>{const value=isoDate(day);return <button type="button" className={`date-button ${date===value?"active":""}`} key={value} onClick={()=>setDate(value)}><span>{day.toLocaleDateString("en-US",{weekday:"short"})}</span><strong>{day.getDate()}</strong></button>})}</div>
          <div className="timezone-row"><Globe2 size={14}/><span>Time zone</span><select value={timezone} onChange={e=>setTimezone(e.target.value)}>{zones.map(zone=><option key={zone}>{zone}</option>)}</select></div>
          <div className="slot-grid">{slots.map(slot=><button type="button" className={`slot ${time===slot?"active":""}`} disabled={booked.includes(slot)} key={slot} onClick={()=>setTime(slot)}>{slot}</button>)}</div>
          <p className="slot-help">Availability is shown in Europe/Budapest time. Booked slots are unavailable.</p>
          <form className="booking-form" onSubmit={submit}><div className="field"><label htmlFor="name">Name *</label><input id="name" name="name" required autoComplete="name"/></div><div className="field"><label htmlFor="email">Email *</label><input id="email" name="email" type="email" required autoComplete="email"/></div><div className="field full"><label htmlFor="purpose">What would you like to discuss? *</label><select id="purpose" name="purpose" required defaultValue=""><option value="" disabled>Select a topic</option><option>Wellness optimisation</option><option>Peptide education</option><option>A protocol I do not understand</option><option>A symptom or recovery question</option><option>General wellness question</option></select></div><div className="field full"><label htmlFor="notes">Anything we should know?</label><textarea id="notes" name="notes" placeholder="Tell us what you are trying to understand."/></div>{error&&<p className="form-status error" role="alert">{error}</p>}<button className="submit-booking" disabled={status==="sending"}>{status==="sending"?"Confirming…":"Book my free Pep Talk"}<ArrowRight size={16}/></button></form>
        </>}
      </div>
    </section>
  </main>
}
