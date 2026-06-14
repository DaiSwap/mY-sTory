/* ============================================================
   Vietnam '26 — app.js (shared across all pages)
   ------------------------------------------------------------
   EDIT CONTENT in the PLACES array below.
   PASTE your Firebase config in firebaseConfig (see setup notes).
   ============================================================ */

/* ============================================================
   1) DATA  — edit place info here
   ============================================================ */
const PLACES = [
  { id:"hagiang", tier:1, lat:22.823, lng:104.984, region:"Far North · near China", name:"Ha Giang",
    crowd:2, crowdNote:"Backroads stay remote", act:5, actNote:"Biggest adventure payoff",
    desc:"The best <b>quiet + adventure</b> return in the country. The famous loop gets busy on a few photo-stops, but the villages stay genuinely untouched.",
    doing:["Ride the loop (Ma Pi Leng pass)","Boat the Nho Que river gorge","Trek between hill-tribe villages","Homestays & local markets"],
    when:"Big, physical, remote. With 5 of you, use easy-rider drivers or a private car if not everyone rides." },
  { id:"sapa", tier:3, lat:22.336, lng:103.844, region:"Far North · Hoang Lien Son", name:"Sapa",
    crowd:4, crowdNote:"Town has gone touristy", act:4, actNote:"Strong treks outside town",
    desc:"Was on the first plan. The town is commercial now, but the valley treks just outside still deliver terraced fields and quiet villages.",
    doing:["Trek Muong Hoa valley","Cable car to Fansipan peak","Cat Cat village","Y Ty = quieter, but far"],
    when:"Keep only if you want the high-mountain trek — Ha Giang or Pu Luong cover it with fewer people." },
  { id:"hanoi", tier:3, lat:21.028, lng:105.804, region:"North · capital & main hub", name:"Hanoi",
    crowd:5, crowdNote:"Big busy capital", act:2, actNote:"City & food",
    desc:"The start / end hub. Great for a day of food and old-quarter wandering, but it's a dense city, not a quiet stop.",
    doing:["Old Quarter & Hoan Kiem lake","Train Street","Street-food crawl","Launchpad for Ha Giang / Sapa / Ninh Binh"],
    when:"One day as a connector. Spend your real days in Ha Giang or Phong Nha." },
  { id:"puluong", tier:1, lat:20.487, lng:105.166, region:"North · near Ninh Binh", name:"Pu Luong",
    crowd:1, crowdNote:"Genuinely off-radar", act:4, actNote:"Treks & nature",
    desc:"The calm, almost crowd-free answer to Sapa. Gentle trails through rice terraces, villages and bamboo forest.",
    doing:["Treks to hidden waterfalls","Mountain biking","Bamboo rafting","Stilt-house eco homestays"],
    when:"Great for slowing down. Pairs naturally with Ninh Binh (≈3 hrs)." },
  { id:"ninhbinh", tier:2, lat:20.254, lng:105.975, region:"North · 'Halong on land'", name:"Ninh Binh",
    crowd:3, crowdNote:"Popular but easy to dodge", act:3, actNote:"Boats, caves, cycling",
    desc:"Worth keeping. Karst peaks rising from rice paddies and rivers. Go early or stay over to beat the Hanoi day-trippers.",
    doing:["Bamboo-boat through river caves (Trang An)","Cycle the paddy backroads","Climb Mua Cave viewpoint","Hoa Lu ancient capital"],
    when:"Trang An beats Tam Coc for scenery and less hassle. Go at opening or late afternoon." },
  { id:"catba", tier:2, lat:20.728, lng:107.048, region:"North coast · near Ha Long", name:"Cat Ba / Lan Ha Bay",
    crowd:3, crowdNote:"Quieter than Ha Long", act:4, actNote:"Kayak, climb, hike",
    desc:"On the first plan — good call. Same limestone seascape as Ha Long with far fewer boats, plus island hiking and climbing.",
    doing:["Kayak the Lan Ha lagoons","Rock climbing (Cat Ba is a hub)","Hike Cat Ba national park","Swim & overnight boat"],
    when:"Choose a Lan Ha route over the busy Ha Long cruises — same views, fewer crowds." },
  { id:"phongnha", tier:1, lat:17.591, lng:106.283, region:"Central · UNESCO park", name:"Phong Nha–Ke Bang",
    crowd:2, crowdNote:"Still little-known", act:5, actNote:"Real adventure",
    desc:"A perfect fit for what we want. 885 km² of jungle, caves and underground rivers — adventure-first, not photo-first.",
    doing:["Dark Cave: zipline + mud bath + kayak","Paradise Cave boardwalks","Phong Nha cave by river boat","Jungle hikes & multi-day expeditions"],
    when:"Avoid Oct–Dec (rainy, caves close). April is good. A clear keeper." },
  { id:"hue", tier:3, lat:16.463, lng:107.590, region:"Central · imperial city", name:"Hue",
    crowd:3, crowdNote:"Touristed but spread out", act:2, actNote:"History & food",
    desc:"The upsell in those WhatsApp images — not on the current plan. The real draw is the Hai Van Pass drive to Da Nang.",
    doing:["Drive the Hai Van Pass (the highlight)","Imperial Citadel & royal tombs","Perfume River boat","Lang Co Bay, Lap An lagoon"],
    when:"Add only for the scenic pass + history. Light on active things to do." },
  { id:"danang", tier:3, lat:16.054, lng:108.202, region:"Central · big coastal city", name:"Da Nang / Ba Na Hills",
    crowd:5, crowdNote:"Heavily commercial", act:3, actNote:"Mostly built attractions",
    desc:"On the plan, but clashes most with 'non-commercial'. Ba Na Hills & the Golden Bridge are theme-park busy.",
    doing:["Golden Bridge / Ba Na Hills (busy)","My Khe beach","Marble Mountains","Mainly an arrival hub"],
    when:"Use as a gateway. Quy Nhon is the quieter coastal swap." },
  { id:"hoian", tier:3, lat:15.880, lng:108.338, region:"Central · old trading town", name:"Hoi An",
    crowd:5, crowdNote:"Lovely but very busy", act:2, actNote:"Atmosphere over activity",
    desc:"On the plan. A genuinely beautiful lantern-lit old town — and one of the most touristed spots in Vietnam.",
    doing:["Lantern-lit old town at night","Lantern boat ride","Tailor-made clothes","Coconut-jungle basket boats","An Bang beach"],
    when:"Keep it short; dawn or late evening dodges the crowds." },
  { id:"quynhon", tier:2, lat:13.782, lng:109.219, region:"Central coast · alternative", name:"Quy Nhon",
    crowd:2, crowdNote:"Kept its soul vs Da Nang", act:3, actNote:"Beaches & coast",
    desc:"Not on the plan — worth a look. A low-key coastal town that stayed authentic while Da Nang boomed.",
    doing:["Quiet beaches (Ky Co, Eo Gio)","Coastal scooter rides","Cham towers","Fresh seafood & local life"],
    when:"A real swap for a relaxed, non-commercial coast instead of Da Nang." }
];

/* ============================================================
   2) FIREBASE / VOTING LAYER
   ------------------------------------------------------------
   SETUP (one time, ~3 min):
   1. console.firebase.google.com → Add project (free, no billing).
   2. Build → Firestore Database → Create database → Start, pick a region.
   3. Project settings (gear) → General → Your apps → Web (</>) →
      register an app → COPY the firebaseConfig object.
   4. Paste it below, replacing the placeholder values.
   5. Firestore → Rules → paste the rules from the chat → Publish.
   Until you do this, voting still works (saved on each person's
   own device); it becomes live + shared once the config is in.
   ============================================================ */
const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "PASTE.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE.appspot.com",
  messagingSenderId: "PASTE",
  appId: "PASTE"
};

const FB_READY = typeof firebase !== "undefined" && firebaseConfig.apiKey && firebaseConfig.apiKey !== "PASTE_YOUR_API_KEY";
let _db = null;
if (FB_READY) { try { firebase.initializeApp(firebaseConfig); _db = firebase.firestore(); } catch(e){ console.warn("Firebase init failed", e); } }

const TripVotes = {
  live: !!_db,
  name(){ return localStorage.getItem("tripName") || ""; },
  setName(n){ localStorage.setItem("tripName", (n||"").trim()); },
  _lk:"tripVotes_local",
  _getLocal(){ try{ return JSON.parse(localStorage.getItem(this._lk)) || {}; }catch{ return {}; } },
  _setLocal(o){ localStorage.setItem(this._lk, JSON.stringify(o)); },
  async cast(placeId, vote){
    const name = this.name(); if(!name) return;
    if(_db){
      const ref = _db.collection("votes").doc(name.toLowerCase()+"__"+placeId);
      if(vote) await ref.set({ name, placeId, vote, ts: Date.now() });
      else await ref.delete();
    } else {
      const o = this._getLocal();
      if(vote) o[placeId] = vote; else delete o[placeId];
      this._setLocal(o);
      this._emitLocal();
    }
  },
  subscribe(cb){
    this._cb = cb;
    if(_db){
      return _db.collection("votes").onSnapshot(snap=>{
        const arr=[]; snap.forEach(d=>arr.push(d.data())); cb(arr);
      }, err=>console.warn("votes subscribe error", err));
    } else {
      this._emitLocal();
      window.addEventListener("storage", e=>{ if(e.key===this._lk) this._emitLocal(); });
      return ()=>{};
    }
  },
  _emitLocal(){
    if(!this._cb) return;
    const name = this.name() || "You";
    const o = this._getLocal();
    this._cb(Object.entries(o).map(([placeId,vote])=>({ name, placeId, vote })));
  }
};

/* ============================================================
   3) SHARED STATE + HELPERS
   ============================================================ */
const byId = id => PLACES.find(p=>p.id===id);
const tierTxt = t => t===1 ? "Tier 1 · quiet + activity-rich" : t===2 ? "Tier 2 · good, one tradeoff" : "Tier 3 · scenic but commercial";
const tierCls = t => "tier-"+t;
function segs(n, cls){ let s=""; for(let i=1;i<=5;i++) s+=`<div class="seg ${i<=n?cls:''}"></div>`; return s; }

let ALL_VOTES = [];                 // every vote from everyone
function myVotes(){
  const me = (TripVotes.name()||"You").toLowerCase();
  const m = {};
  ALL_VOTES.forEach(v=>{ if((v.name||"").toLowerCase()===me) m[v.placeId]=v.vote; });
  return m;
}

/* ============================================================
   4) SHARED UI  (nav, name modal, detail sheet)
   ============================================================ */
function injectChrome(){
  const page = document.body.dataset.page || "";
  const link = (href,label,key)=>`<a href="${href}" class="${page===key?'active':''}">${label}</a>`;
  const nav = document.createElement("div");
  nav.className="nav";
  nav.innerHTML = `
    <a class="brand" href="index.html">Vietnam <span>'26</span></a>
    <button class="burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="links" id="navlinks">
      ${link("index.html","Home","home")}
      ${link("map.html","Map","map")}
      ${link("places.html","Places","places")}
      ${link("travel.html","Travel","travel")}
      ${link("results.html","Results","results")}
    </div>
    <div class="spacer"></div>
    <div class="me">
      <span class="tally"><span class="ty">✓ <b id="t-yes">0</b></span><span class="tm">~ <b id="t-maybe">0</b></span><span class="ts">✕ <b id="t-skip">0</b></span></span>
      <button class="who" id="whoBtn"></button>
    </div>`;
  document.body.prepend(nav);

  document.getElementById("burger").addEventListener("click",()=>{
    document.getElementById("navlinks").classList.toggle("open");
  });
  document.getElementById("whoBtn").addEventListener("click",()=>openName(true));
  refreshWho();

  // name modal
  const mw = document.createElement("div");
  mw.className="modal-wrap"; mw.id="nameModal";
  mw.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="nm-t">
      <h3 id="nm-t">What's your first name?</h3>
      <p>So your family can see who voted for what. Stored only on this device.</p>
      <input id="nameInput" type="text" placeholder="e.g. Pranav" maxlength="24" autocomplete="given-name">
      <div class="row">
        <button class="m-cancel" id="nameCancel">Cancel</button>
        <button class="m-ok" id="nameOk">Save</button>
      </div>
    </div>`;
  document.body.appendChild(mw);
  document.getElementById("nameCancel").addEventListener("click",()=>closeName());
  document.getElementById("nameOk").addEventListener("click",()=>saveName());
  document.getElementById("nameInput").addEventListener("keydown",e=>{ if(e.key==="Enter") saveName(); });
  mw.addEventListener("click",e=>{ if(e.target===mw) closeName(); });

  // detail sheet
  const scrim = document.createElement("div"); scrim.className="scrim"; scrim.id="scrim";
  const sheet = document.createElement("aside"); sheet.className="sheet"; sheet.id="sheet"; sheet.setAttribute("aria-hidden","true");
  sheet.innerHTML = `<div id="sheet-body"></div>`;
  document.body.appendChild(scrim); document.body.appendChild(sheet);
  scrim.addEventListener("click",closeSheet);
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"){ closeSheet(); closeName(); } });
}

function refreshWho(){
  const b=document.getElementById("whoBtn"); if(!b) return;
  const n=TripVotes.name();
  b.textContent = n ? n : "Set name";
}
let _pendingVote = null; // {placeId, vote} applied after name set
function openName(edit){
  const mw=document.getElementById("nameModal");
  document.getElementById("nameInput").value = edit ? TripVotes.name() : "";
  mw.classList.add("on");
  setTimeout(()=>document.getElementById("nameInput").focus(),60);
}
function closeName(){ document.getElementById("nameModal").classList.remove("on"); _pendingVote=null; }
function saveName(){
  const v=document.getElementById("nameInput").value.trim();
  if(!v) return;
  TripVotes.setName(v); refreshWho();
  document.getElementById("nameModal").classList.remove("on");
  if(_pendingVote){ const {placeId,vote}=_pendingVote; _pendingVote=null; doVote(placeId,vote); }
  // re-derive my votes view
  applyVoteUI();
}

/* voting entry point used by all controls */
function requestVote(placeId, vote){
  if(!TripVotes.name()){ _pendingVote={placeId,vote}; openName(false); return; }
  doVote(placeId, vote);
}
function doVote(placeId, vote){
  const current = myVotes()[placeId];
  const next = current===vote ? null : vote;   // tap again to clear
  TripVotes.cast(placeId, next);
  // optimistic local update for snappy UI (Firebase snapshot will reconcile)
  if(!TripVotes.live){ /* local already emits */ }
  else {
    const me=(TripVotes.name()).toLowerCase();
    ALL_VOTES = ALL_VOTES.filter(v=>!((v.name||"").toLowerCase()===me && v.placeId===placeId));
    if(next) ALL_VOTES.push({name:TripVotes.name(),placeId,vote:next});
    applyVoteUI();
  }
}

/* detail sheet */
function openSheet(id){
  const d=byId(id);
  document.querySelectorAll(".leaflet-marker-icon").forEach(el=>el.classList.remove("active"));
  if(window._markers && window._markers[id]){ const el=window._markers[id].getElement(); if(el) el.classList.add("active"); }
  const mv = myVotes()[id];
  const vbtn = v => `<button data-v="${v}" class="${mv===v?'sel-'+v:''}">${v[0].toUpperCase()+v.slice(1)}</button>`;
  document.getElementById("sheet-body").innerHTML = `
    <button class="sheet-close" id="sheet-close" aria-label="Close">×</button>
    <span class="s-tier ${tierCls(d.tier)}">${tierTxt(d.tier)}</span>
    <div class="s-name">${d.name}</div>
    <div class="s-reg">${d.region}</div>
    <div class="s-meters">
      <div><div class="m-lab">Crowd / commercial</div><div class="track">${segs(d.crowd,'crowd')}</div><div class="rv">${d.crowdNote}</div></div>
      <div><div class="m-lab">Things to do</div><div class="track">${segs(d.act,'act')}</div><div class="rv">${d.actNote}</div></div>
    </div>
    <p class="s-desc">${d.desc}</p>
    <div class="s-do"><h4>What you'd actually do</h4><ul>${d.doing.map(x=>`<li>${x}</li>`).join("")}</ul></div>
    <div class="s-when">${d.when}</div>
    <div class="s-vlabel">Your vote</div>
    <div class="vote" data-id="${d.id}">${vbtn("yes")}${vbtn("maybe")}${vbtn("skip")}</div>`;
  document.getElementById("sheet-close").addEventListener("click",closeSheet);
  document.querySelectorAll(`#sheet-body .vote button`).forEach(b=>b.addEventListener("click",()=>requestVote(d.id,b.dataset.v)));
  document.getElementById("sheet").classList.add("on");
  document.getElementById("scrim").classList.add("on");
  document.getElementById("sheet").setAttribute("aria-hidden","false");
}
function closeSheet(){
  const s=document.getElementById("sheet"); if(!s) return;
  s.classList.remove("on"); document.getElementById("scrim").classList.remove("on"); s.setAttribute("aria-hidden","true");
  document.querySelectorAll(".leaflet-marker-icon").forEach(el=>el.classList.remove("active"));
}

/* ============================================================
   5) APPLY VOTE UI  (called on every snapshot + local change)
   ============================================================ */
function applyVoteUI(){
  const mv = myVotes();
  // nav tally
  let y=0,m=0,s=0; Object.values(mv).forEach(v=>{ if(v==="yes")y++; else if(v==="maybe")m++; else if(v==="skip")s++; });
  const setT=(id,n)=>{ const el=document.getElementById(id); if(el) el.textContent=n; };
  setT("t-yes",y); setT("t-maybe",m); setT("t-skip",s);
  // markers
  if(window._markers){
    Object.entries(window._markers).forEach(([id,mk])=>{
      const el=mk.getElement(); if(!el) return;
      el.classList.remove("v-yes","v-maybe","v-skip");
      if(mv[id]) el.classList.add("v-"+mv[id]);
    });
  }
  // place cards + open sheet
  document.querySelectorAll(".vote[data-id]").forEach(group=>{
    const id=group.dataset.id;
    group.querySelectorAll("button").forEach(b=>{
      b.classList.remove("sel-yes","sel-maybe","sel-skip");
      if(mv[id]===b.dataset.v) b.classList.add("sel-"+b.dataset.v);
    });
  });
  // results page
  if(document.body.dataset.page==="results") renderResults();
}

/* ============================================================
   6) PAGE INITS
   ============================================================ */
function initMap(){
  if(typeof L==="undefined"){ return; }
  const map = L.map("map",{ zoomControl:false, scrollWheelZoom:false, minZoom:5, maxZoom:13 });
  L.control.zoom({position:"topright"}).addTo(map);
  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{attribution:"Tiles © Esri",maxZoom:18});
  const labels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",{maxZoom:18,opacity:0.9});
  const light = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{attribution:"© OpenStreetMap, © CARTO",subdomains:"abcd",maxZoom:19});
  sat.addTo(map); labels.addTo(map);

  window._markers={}; const pts=[];
  PLACES.forEach(d=>{
    const icon=L.divIcon({ className:"", html:`<div class="mk"><span class="mk-dot"></span><span class="mk-name">${d.name}</span></div>`, iconSize:[15,15], iconAnchor:[7,7] });
    const mk=L.marker([d.lat,d.lng],{icon}).addTo(map);
    mk.on("click",()=>openSheet(d.id));
    mk.on("mouseover",()=>{ const e=mk.getElement(); if(e)e.style.zIndex=1000; });
    mk.on("mouseout",()=>{ const e=mk.getElement(); if(e)e.style.zIndex=""; });
    window._markers[d.id]=mk; pts.push([d.lat,d.lng]);
  });
  map.fitBounds(pts,{padding:[60,60]});
  setTimeout(()=>map.invalidateSize(),250);

  const bSat=document.getElementById("b-sat"), bLight=document.getElementById("b-light");
  bSat.addEventListener("click",()=>{ map.addLayer(sat); map.addLayer(labels); map.removeLayer(light); bSat.classList.add("on"); bLight.classList.remove("on"); });
  bLight.addEventListener("click",()=>{ map.addLayer(light); map.removeLayer(sat); map.removeLayer(labels); bLight.classList.add("on"); bSat.classList.remove("on"); });

  applyVoteUI();
}

function initPlaces(){
  buildChart();
  const grid=document.getElementById("grid");
  PLACES.forEach((d,i)=>{
    const c=document.createElement("div");
    c.className="card reveal"; c.style.transitionDelay=(i%3*0.05)+"s";
    c.innerHTML=`
      <div class="c-head"><span class="c-tier ${tierCls(d.tier)}">Tier ${d.tier}</span></div>
      <div class="c-name">${d.name}</div>
      <div class="c-reg">${d.region}</div>
      <div class="meters">
        <div><div class="m-lab">Crowd <span>${d.crowdNote}</span></div><div class="track">${segs(d.crowd,'crowd')}</div></div>
        <div><div class="m-lab">To do <span>${d.actNote}</span></div><div class="track">${segs(d.act,'act')}</div></div>
      </div>
      <div class="c-desc">${d.desc}</div>
      <div class="vote" data-id="${d.id}"><button data-v="yes">Yes</button><button data-v="maybe">Maybe</button><button data-v="skip">Skip</button></div>
      <button class="c-more">See details ›</button>`;
    c.querySelector(".c-more").addEventListener("click",()=>openSheet(d.id));
    c.querySelectorAll(".vote button").forEach(b=>b.addEventListener("click",()=>requestVote(d.id,b.dataset.v)));
    grid.appendChild(c);
  });
  observeReveals();
  applyVoteUI();
}

/* Crowd × Activity scatter (hand-rolled SVG) */
function buildChart(){
  const host=document.getElementById("chart"); if(!host) return;
  const W=720,H=460, pad=54;
  const x = a => pad + ( (a-1)/4 )*(W-pad*2);          // activity 1..5 → left..right
  const y = c => (H-pad) - ( (5-c)/4 )*(H-pad*2);       // quietness (5-crowd) 0..4 → bottom..top
  let pts="";
  PLACES.forEach(d=>{
    const px=x(d.act), py=y(d.crowd);
    const col = d.tier===1?"var(--yes)":d.tier===2?"var(--maybe)":"var(--skip)";
    const labLeft = px > W-150;
    pts += `<g class="pt-g">
      <circle class="pt" cx="${px}" cy="${py}" r="8" fill="${col}" data-id="${d.id}"></circle>
      <text class="ptlab" x="${labLeft?px-12:px+12}" y="${py+3.5}" text-anchor="${labLeft?'end':'start'}">${d.name}</text>
    </g>`;
  });
  host.innerHTML = `
    <svg class="scatter" viewBox="0 0 ${W} ${H}" role="img" aria-label="Crowd versus activity chart">
      <rect class="sweet" x="${pad+(W-pad*2)/2}" y="${pad}" width="${(W-pad*2)/2}" height="${(H-pad*2)/2}" rx="10"></rect>
      <text class="sweetlab" x="${W-pad-6}" y="${pad+18}" text-anchor="end">Sweet spot</text>
      <line class="axis" x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}"></line>
      <line class="axis" x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}"></line>
      <line class="quad" x1="${pad+(W-pad*2)/2}" y1="${pad}" x2="${pad+(W-pad*2)/2}" y2="${H-pad}"></line>
      <line class="quad" x1="${pad}" y1="${pad+(H-pad*2)/2}" x2="${W-pad}" y2="${pad+(H-pad*2)/2}"></line>
      <text class="axlab" x="${W-pad}" y="${H-pad+26}" text-anchor="end">More to do →</text>
      <text class="axlab" x="${pad-14}" y="${pad-12}" transform="rotate(0)" text-anchor="start">↑ Quieter</text>
      ${pts}
    </svg>`;
  host.querySelectorAll(".pt").forEach(c=>c.addEventListener("click",()=>openSheet(c.dataset.id)));
}

function initResults(){ renderResults(); }
function renderResults(){
  const host=document.getElementById("results"); if(!host) return;
  const voters=[...new Set(ALL_VOTES.map(v=>v.name).filter(Boolean))];
  document.getElementById("voterCount").textContent = voters.length;
  // banner if not live
  const banner=document.getElementById("liveBanner");
  if(banner) banner.style.display = TripVotes.live ? "none" : "block";

  if(ALL_VOTES.length===0){
    host.innerHTML = `<div class="empty">No votes yet. Open the <a href="map.html" style="color:var(--accent);font-weight:600">map</a> or <a href="places.html" style="color:var(--accent);font-weight:600">places</a> and start voting.</div>`;
    return;
  }
  const rows = PLACES.map(d=>{
    const vs = ALL_VOTES.filter(v=>v.placeId===d.id);
    const yes=vs.filter(v=>v.vote==="yes"), maybe=vs.filter(v=>v.vote==="maybe"), skip=vs.filter(v=>v.vote==="skip");
    return { d, yes, maybe, skip, score: yes.length*2 + maybe.length };
  }).sort((a,b)=> b.score-a.score || b.yes.length-a.yes.length);

  host.innerHTML = rows.map((r,i)=>{
    const total=r.yes.length+r.maybe.length+r.skip.length;
    const pct=n=> total? (n/total*100):0;
    const chips=(arr,cls,sym)=>arr.map(v=>`<span class="chip ${cls}">${sym} ${v.name}</span>`).join("");
    const bar = total ? `<div class="stack">
        <div class="sy" style="width:${pct(r.yes.length)}%"></div>
        <div class="sm" style="width:${pct(r.maybe.length)}%"></div>
        <div class="ss" style="width:${pct(r.skip.length)}%"></div>
      </div>` : `<div class="stack"></div>`;
    return `<div class="res-row">
      <div class="top">
        <div><span class="rk">#${i+1}</span><span class="nm" data-id="${r.d.id}">${r.d.name}</span></div>
        <div class="score">✓ ${r.yes.length} · ~ ${r.maybe.length} · ✕ ${r.skip.length}</div>
      </div>
      ${bar}
      ${total? `<div class="chips">${chips(r.yes,'cy','✓')}${chips(r.maybe,'cm','~')}${chips(r.skip,'cs','✕')}</div>`:""}
    </div>`;
  }).join("");
  host.querySelectorAll(".nm").forEach(n=>n.addEventListener("click",()=>openSheet(n.dataset.id)));
}

/* ============================================================
   7) reveal observer + BOOT
   ============================================================ */
function observeReveals(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} }),{threshold:0.12});
  document.querySelectorAll(".reveal").forEach(el=>io.observe(el));
}

document.addEventListener("DOMContentLoaded",()=>{
  injectChrome();
  observeReveals();
  // live subscription drives all vote UI
  TripVotes.subscribe(arr=>{ ALL_VOTES=arr; applyVoteUI(); });

  const page=document.body.dataset.page;
  if(page==="map") initMap();
  else if(page==="places") initPlaces();
  else if(page==="results") initResults();
});
