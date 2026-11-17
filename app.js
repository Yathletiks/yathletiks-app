(function(){
"use strict";
var SB_URL="https://ipwmzztqauktwxwrllyc.supabase.co";
var SB_KEY="sb_publishable_Cy2zlgfbCXxp3p27fZ-fbA_SyA66CdS";
var SB_ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd216enRxYXVrdHd4d3JsbHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0OTUwOTUsImV4cCI6MjExMDA3MTA5NX0.v2OfDuk7NGrKIKPDFFPhZQcTsJFfmebkl-S9D2_N7cE";
var COACH_TEL="06 33 88 70 24";
var MEALS=["Petit-déjeuner","Déjeuner","Collation","Dîner","Petit repas du soir"];
var DKEYS=["dim","lun","mar","mer","jeu","ven","sam"];

/* ---------- utilitaires ---------- */
var $main=document.getElementById("main"),$cta=document.getElementById("cta"),$tabs=document.getElementById("tabs"),$bottom=document.getElementById("bottom"),$status=document.getElementById("status");
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function num(v){var n=parseFloat(String(v==null?"":v).replace(",","."));return isFinite(n)?n:0;}
function r0(n){return Math.round(n||0);}
function r1(n){return Math.round((n||0)*10)/10;}
function iso(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2);}
function fromIso(s){var p=String(s).split("-");return new Date(+p[0],+p[1]-1,+p[2]);}
function frDate(s,o){return fromIso(s).toLocaleDateString("fr-FR",o||{day:"numeric",month:"long"});}
function uid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36);}
var store={
  get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}},
  del:function(k){try{localStorage.removeItem(k);}catch(e){}}
};
function rpc(fn,args){
  return fetch(SB_URL+"/rest/v1/rpc/"+fn,{method:"POST",headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,"Content-Type":"application/json"},body:JSON.stringify(args)})
  .then(function(r){return r.text().then(function(t){var j=null;try{j=t?JSON.parse(t):null;}catch(e){}if(!r.ok){var er=new Error((j&&j.message)||("Erreur "+r.status));er.status=r.status;throw er;}return j;});});
}
function setStatus(t,bad){$status.textContent=t||"";$status.className="status"+(bad?" bad":"");}
function copyText(txt,done){
  var ok=function(){done(true);},ko=function(){done(false);};
  try{navigator.clipboard.writeText(txt).then(ok,ko);}catch(e){ko();}
}
var CHK='<svg class="check" role="img" aria-label="Fait" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg>';
var LOCK='<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
var CHEV='<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"></path></svg>';
var BACK='<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"></path></svg>';
var PLAY='<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"></path></svg>';
function backHead(act,label,title,sub,extra){return '<div class="back"><button class="icon-btn" type="button" data-act="'+act+'"'+(extra||"")+' aria-label="'+esc(label)+'">'+BACK+'</button><div class="grow"><h1>'+esc(title)+'</h1>'+(sub?'<p class="muted small">'+esc(sub)+'</p>':'')+'</div></div>';}

/* ---------- notifications ---------- */
var VAPID="BA1xsYy1oWnITiIvpUN6hdmcC1x09g2zTxg-bVnUuZZrDfDPIDYxkJGc1fe27ksujZu3N21KxYrXW9A9qjs1cvo";
var PUSH={on:null,msg:""};
function pushSupported(){return "serviceWorker" in navigator&&"PushManager" in window&&"Notification" in window;}
function isIOS(){return /iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);}
function b64u(s){var p=(s+"===".slice((s.length+3)%4)).replace(/-/g,"+").replace(/_/g,"/"),r=atob(p),a=new Uint8Array(r.length);for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a;}
function getSub(){if(!pushSupported())return Promise.resolve(null);return navigator.serviceWorker.getRegistration().then(function(r){return r?r.pushManager.getSubscription():null;}).catch(function(){return null;});}
function subscribePush(){
  return Notification.requestPermission().then(function(p){if(p!=="granted")throw new Error("denied");return navigator.serviceWorker.register("sw.js");})
  .then(function(){return navigator.serviceWorker.ready;})
  .then(function(r){return r.pushManager.getSubscription().then(function(s){return s||r.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64u(VAPID)});});})
  .then(function(s){var k=s.toJSON();return {endpoint:k.endpoint,p256dh:k.keys.p256dh,auth:k.keys.auth};});
}
function unsubscribePush(){return getSub().then(function(s){if(!s)return null;var ep=s.endpoint;return s.unsubscribe().then(function(){return ep;},function(){return ep;});});}
function pushCall(body,jwt){return fetch(SB_URL+"/functions/v1/push",{method:"POST",headers:{apikey:SB_ANON,Authorization:"Bearer "+(jwt||SB_ANON),"Content-Type":"application/json"},body:JSON.stringify(body)}).catch(function(){});}
function pushIntro(who){
  if(pushSupported()){if(Notification.permission==="denied")return '<p class="note">Les notifications sont bloquées pour cette app. Réautorise-les dans les réglages de ton '+(isIOS()?"iPhone":"navigateur")+', puis reviens ici.</p>';return "";}
  if(isIOS())return '<p class="note">Sur iPhone, les notifications marchent seulement quand l\'app est sur l\'écran d\'accueil. Dans Safari : Partager, puis « Sur l\'écran d\'accueil ». Ouvre ensuite l\'app depuis son icône et reviens ici.</p>';
  return '<p class="note">Ce navigateur ne permet pas les notifications.</p>';
}

/* ---------- thème ---------- */
var theme=store.get("ya-theme","dark");
function applyTheme(){document.documentElement.classList.toggle("ya-light",theme==="light");var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",theme==="light"?"#DCE6FF":"#0B0B0B");}
document.getElementById("theme").addEventListener("click",function(){theme=theme==="light"?"dark":"light";store.set("ya-theme",theme);applyTheme();});
applyTheme();

/* ---------- lecture d'une séance (commun client / coach) ---------- */
function unit(x){return x.t==="iso"?"sec":"reps";}
function nSets(x,week){return x.sets+(x.w3&&week===3?1:0);}
function bilanLines(cyc,s,L,week,dateStr){
  var e=(L&&L.data&&L.data.end)||{},ex=(L&&L.data&&L.data.ex)||{},t=[];
  function v(x){return x==null||x===""?"__":x;}
  t.push((cyc.label||cyc.name).toUpperCase()+" · "+s.day.toUpperCase()+" · "+s.title+" · "+s.sub);
  t.push("Semaine : "+week+(dateStr?"   Date : "+dateStr:""));
  s.blocks.forEach(function(b){
    t.push("");t.push(b.name.toUpperCase());
    b.items.forEach(function(x){
      var d=ex[x.id]||{},i,st;
      t.push((x.code?x.code+" ":"")+x.name+" | "+x.presc);
      if(x.t==="load"||x.t==="iso"){for(i=0;i<nSets(x,week);i++){st=(d.s&&d.s[i])||{};t.push("S"+(i+1)+" : "+v(st.kg)+" kg × "+v(st.r)+" "+unit(x));}}
      else if(x.t==="dist"){for(i=0;i<x.sets;i++){st=(d.s&&d.s[i])||{};t.push("S"+(i+1)+" : distance "+v(st.m)+" m");}}
      else if(x.t==="box")t.push("Hauteur de box : "+v(d.h)+" cm · Ressenti : "+v(d.feel));
      else t.push("Fait : "+v(d.done)+" · Ressenti : "+v(d.feel));
    });
  });
  t.push("");t.push("FIN DE SÉANCE");
  t.push("Difficulté de la séance : "+v(e.diff)+" /10");
  t.push("Énergie : "+v(e.nrj)+" /10");
  t.push("Stress : "+v(e.stress)+" /10");
  t.push("Sommeil la nuit d'avant : "+v(e.sh)+" h, qualité "+v(e.sq)+" /10");
  t.push("Poids du matin : "+v(e.kg)+" kg");
  t.push("Courbatures / douleur : "+v(e.pain));
  t.push("Mobilité à la maison faite cette semaine : "+v(e.mob)+" fois");
  t.push("Commentaire : "+v(e.com));
  return t;
}
var XK=[["sug","Sucres"],["sat","Graisses saturées"],["fib","Fibres"],["salt","Sel"]];
function xOf(o){o=o||{};var x=o.extra||o;return {sug:num(x.sug),sat:num(x.sat),fib:num(x.fib),salt:num(x.salt)};}
function xLine(x,q){return XK.map(function(k){return k[1]+" "+(k[0]==="salt"?Math.round(x[k[0]]*q*100)/100:r1(x[k[0]]*q))+" g";}).join(" · ");}
function foodTotals(entries){var t={k:0,p:0,g:0,l:0,n:0,sug:0,sat:0,fib:0,salt:0,nx:0};(entries||[]).forEach(function(x){t.k+=num(x.k);t.p+=num(x.p);t.g+=num(x.g);t.l+=num(x.l);t.n++;if(x.x){t.sug+=num(x.x.sug);t.sat+=num(x.x.sat);t.fib+=num(x.x.fib);t.salt+=num(x.x.salt);t.nx++;}});return t;}
function pct(a,b){return b>0?Math.max(0,Math.min(100,Math.round(a/b*100))):0;}
function totalsCard(t,G,label){
  var h='<div class="card">';
  if(G.kcal){var rest=r0(G.kcal-t.k);
    h+='<div class="row" style="align-items:flex-end"><div class="grow"><span class="eyebrow muted">'+esc(label||"Mangé")+'</span><span class="kcal">'+r0(t.k)+' <span class="small muted">/ '+G.kcal+' kcal</span></span></div><span class="small" style="font-weight:700;text-align:right">'+(rest>=0?"Reste "+rest+" kcal":"+"+(-rest)+" kcal")+'</span></div><div class="bar'+(rest<0?" over":"")+'"><i style="width:'+pct(t.k,G.kcal)+'%"></i></div>';
  }else h+='<div class="grow"><span class="eyebrow muted">'+esc(label||"Mangé")+'</span><span class="kcal">'+r0(t.k)+' <span class="small muted">kcal</span></span></div>';
  h+='<div class="macro">';
  [["Protéines","p","prot"],["Glucides","g","carb"],["Lipides","l","fat"]].forEach(function(m){var goal=G[m[2]];h+='<div><span>'+m[0]+'</span><b>'+r0(t[m[1]])+(goal?" / "+goal:"")+' g</b>'+(goal?'<div class="bar'+(t[m[1]]>goal?" over":"")+'"><i style="width:'+pct(t[m[1]],goal)+'%"></i></div>':'')+'</div>';});
  h+='</div>';
  if(t.nx)h+='<p class="muted small">'+xLine(t,1)+(t.nx<t.n?' <span>(sans les repas du plan)</span>':'')+'</p>';
  return h+'</div>';
}

function msgList(msgs,me,label){
  if(!msgs.length)return '<p class="note">Aucun message pour l\'instant.</p>';
  var h='<div class="msgs">',last="";
  msgs.forEach(function(m){var d=new Date(m.created_at),day=d.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
    if(day!==last){h+='<p class="muted small" style="text-align:center">'+esc(day)+'</p>';last=day;}
    h+='<div class="bub'+(m.sender===me?" me":"")+'">'+(m.ref?'<span class="ref">'+esc(label(m.ref))+'</span>':'')+esc(m.body)+'<span class="meta">'+(m.sender===me?"Toi":(m.sender==="coach"?"Yanis":"Client"))+' · '+d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})+'</span></div>';});
  return h+'</div>';
}
function refLabel(ref,cs){var p=String(ref).split("-"),c=(cs||[]).filter(function(x){return x.n===+p[0];})[0],s=c&&(c.sessions||[]).filter(function(x){return x.id===p.slice(2).join("-");})[0];return "Séance : "+(s?s.day+" · ":"")+"semaine "+p[1]+(c?" · "+c.name:"");}
function pauseSec(t){var m=String(t||"").match(/(\d+)(?:\s*(?:à|-)\s*\d+)?\s*(min|sec|s)\b/i);if(!m)return 0;return +m[1]*(/^min/i.test(m[2])?60:1);}
function mmss(s){s=Math.max(0,Math.ceil(s));return Math.floor(s/60)+":"+("0"+(s%60)).slice(-2);}
var rest={end:0,iv:null,ctx:null,hide:null};
function stopRest(){clearInterval(rest.iv);clearTimeout(rest.hide);rest.iv=null;if(rest.ctx){try{rest.ctx.close();}catch(e){}rest.ctx=null;}document.getElementById("timer").hidden=true;}
function startRest(sec){
  stopRest();var box=document.getElementById("timer"),txt=document.getElementById("timer-t");
  rest.end=Date.now()+sec*1000;box.hidden=false;box.classList.remove("done");
  try{var AC=window.AudioContext||window.webkitAudioContext;if(AC){rest.ctx=new AC();[0,0.35].forEach(function(o){var os=rest.ctx.createOscillator(),g=rest.ctx.createGain();os.frequency.value=880;g.gain.value=0.25;os.connect(g);g.connect(rest.ctx.destination);os.start(rest.ctx.currentTime+sec+o);os.stop(rest.ctx.currentTime+sec+o+0.22);});}}catch(e){}
  var arc=document.getElementById("timer-arc"),CIRC=213.6;
  var tick=function(){var left=(rest.end-Date.now())/1000;if(left>0){txt.textContent=mmss(left);arc.style.strokeDashoffset=String(CIRC*(1-left/sec));return;}
    clearInterval(rest.iv);rest.iv=null;txt.textContent="Fini";arc.style.strokeDashoffset=String(CIRC);box.classList.add("done");try{if(navigator.vibrate)navigator.vibrate([200,100,200]);}catch(e){}rest.hide=setTimeout(stopRest,8000);};
  tick();rest.iv=setInterval(tick,250);
}
document.getElementById("timer").addEventListener("click",stopRest);

/* =====================================================================
   ESPACE CLIENT
   ===================================================================== */
var TOKEN=null,D=null,dirty={},flushTimer=null,flushing=false,scanner=null;
var ui={tab:"home",view:"home",cycle:1,week:1,sid:null,ntab:"journal",nview:"journal",date:iso(new Date()),item:null,results:null,q:"",msg:"",copy:""};
function cacheKey(){return "ya-cache-"+TOKEN.slice(0,10);}
function persist(){if(TOKEN&&D)store.set(cacheKey(),{D:D,dirty:dirty,ui:{cycle:ui.cycle,week:ui.week}});}
function normalize(S){
  var logs={};(S.logs||[]).forEach(function(l){logs[l.cycle+"-"+l.week+"-"+l.session_id]={data:l.data||{},done:!!l.done,done_at:l.done_at};});
  return {client:S.client||{},program:S.program||{},nutrition:S.nutrition||{},logs:logs,food:S.food||{},foods:S.foods||[],body:S.body||{},messages:S.messages||[]};
}
function cycles(){return (D.program.cycles||[]);}
function cyc(){var c=cycles();for(var i=0;i<c.length;i++)if(c[i].n===ui.cycle)return c[i];return c[0]||{n:1,name:"Cycle 1",sessions:[],nweeks:3};}
function openCycles(){return cycles().filter(function(c){return !c.locked&&c.sessions&&c.sessions.length;});}
function sess(id){var s=cyc().sessions||[];for(var i=0;i<s.length;i++)if(s[i].id===id)return s[i];}
function lk(w,sid){return ui.cycle+"-"+w+"-"+sid;}
function peek(w,sid){return D.logs[lk(w,sid)];}
function cur(){var k=lk(ui.week,ui.sid);var L=D.logs[k]||(D.logs[k]={data:{},done:false});if(!L.data.ex)L.data.ex={};if(!L.data.end)L.data.end={};return L;}
function touchLog(){dirty["L|"+lk(ui.week,ui.sid)]=1;schedule();}
function touchFood(){dirty["F|"+ui.date]=1;schedule();}
function schedule(){persist();setStatus("Enregistrement…");clearTimeout(flushTimer);flushTimer=setTimeout(flush,900);}
function flush(){
  if(flushing){clearTimeout(flushTimer);flushTimer=setTimeout(flush,600);return;}
  var keys=Object.keys(dirty);if(!keys.length){setStatus("Enregistré");return;}
  flushing=true;
  var chain=Promise.resolve();
  keys.forEach(function(k){
    chain=chain.then(function(){
      var p=k.split("|"),job;
      if(p[0]==="L"){var q=p[1].split("-"),L=D.logs[p[1]];if(!L){delete dirty[k];return;}
        var snap=JSON.stringify(L.data);
        job=rpc("client_save_log",{p_token:TOKEN,p_cycle:+q[0],p_week:+q[1],p_session:q.slice(2).join("-"),p_data:L.data,p_done:!!L.done}).then(function(res){
          if(JSON.stringify(L.data)===snap)delete dirty[k];
          if(evt[k]){pushCall({kind:"client",token:TOKEN,event:evt[k],ref:p[1]});delete evt[k];}
          if(res&&res.unlocked&&res.unlocked>D.client.unlocked){D.client.unlocked=res.unlocked;reload();}
        });
      }else if(p[0]==="B"){var bd=D.body[p[1]]||{},snap3=JSON.stringify(bd);
        job=rpc("client_save_body",{p_token:TOKEN,p_day:p[1],p_data:bd}).then(function(){if(JSON.stringify(D.body[p[1]]||{})===snap3)delete dirty[k];});
      }else{var e=D.food[p[1]]||[],snap2=JSON.stringify(e);
        job=rpc("client_save_food",{p_token:TOKEN,p_day:p[1],p_entries:e}).then(function(){if(JSON.stringify(D.food[p[1]]||[])===snap2)delete dirty[k];});
      }
      return job;
    });
  });
  chain.then(function(){flushing=false;persist();if(Object.keys(dirty).length){schedule();}else setStatus("Enregistré");})
  .catch(function(){flushing=false;persist();setStatus("Hors ligne · nouvel essai",true);clearTimeout(flushTimer);flushTimer=setTimeout(flush,8000);});
}
function reload(){return rpc("client_bootstrap",{p_token:TOKEN}).then(function(S){if(!S)return;var N=normalize(S);Object.keys(dirty).forEach(function(k){var p=k.split("|");if(p[0]==="L"&&D.logs[p[1]])N.logs[p[1]]=D.logs[p[1]];if(p[0]==="F"&&D.food[p[1]])N.food[p[1]]=D.food[p[1]];if(p[0]==="B"){if(D.body&&D.body[p[1]])N.body[p[1]]=D.body[p[1]];else delete N.body[p[1]];}});D=N;persist();render(true);});}

function bootClient(tok){
  TOKEN=tok;
  var c=store.get(cacheKey(),null);
  if(c&&c.D){D=c.D;if(!D.body)D.body={};if(!D.messages)D.messages=[];dirty=c.dirty||{};if(c.ui){ui.cycle=c.ui.cycle||1;ui.week=c.ui.week||1;}startClient();}
  rpc("client_bootstrap",{p_token:tok}).then(function(S){
    if(!S){store.del("ya-token");store.del(cacheKey());TOKEN=null;D=null;showLogin("Ce code n'est pas reconnu. Vérifie-le ou demande ton lien à Yanis.");return;}
    store.set("ya-token",tok);
    var N=normalize(S),had=!!D;
    if(had)Object.keys(dirty).forEach(function(k){var p=k.split("|");if(p[0]==="L"&&D.logs[p[1]])N.logs[p[1]]=D.logs[p[1]];if(p[0]==="F"&&D.food[p[1]])N.food[p[1]]=D.food[p[1]];if(p[0]==="B"){if(D.body&&D.body[p[1]])N.body[p[1]]=D.body[p[1]];else delete N.body[p[1]];}});
    D=N;persist();
    if(!had)startClient();else{fixCycle();if(ui.view==="home"&&ui.tab==="prog"||ui.tab!=="prog")render(true);}
    if(Object.keys(dirty).length)flush();else setStatus("");
  }).catch(function(){if(!D)showLogin("Connexion impossible. Vérifie ta connexion internet et réessaie.",tok);else setStatus("Hors ligne",true);});
}
function fixCycle(){var o=openCycles();if(!o.length){ui.cycle=(cycles()[0]||{n:1}).n;return;}var ok=o.some(function(c){return c.n===ui.cycle;});if(!ok)ui.cycle=o[o.length-1].n;if(ui.week<1||ui.week>(cyc().nweeks||3))ui.week=1;if(!weekOpen(ui.week))ui.week=currentWeek();}
function startClient(){
  fixCycle();document.body.classList.remove("coach");
  $bottom.hidden=false;
  $tabs.innerHTML='<button type="button" data-tab="home"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7v9h-5v-6h-6v6H4z"></path></svg>Accueil</button><button type="button" data-tab="prog"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"></path></svg>Séances</button><button type="button" data-tab="nutri"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 3c-2 2-2.5 5-2.5 8H17v10"></path></svg>Nutrition</button><button type="button" data-tab="suivi"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8M15 7h6v6"></path></svg>Progrès</button><button type="button" data-tab="msg"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"></path></svg>Messages<span class="badge" id="msgbadge" hidden></span></button>';
  render();
  getSub().then(function(s){PUSH.on=!!s;if(s&&TOKEN){var k=s.toJSON();savePrefs({endpoint:k.endpoint,p256dh:k.keys.p256dh,auth:k.keys.auth},null).catch(function(){});}if(MODE==="client"&&ui.tab==="home")render(true);});
  if(!pollTimer)pollTimer=setInterval(pollMessages,30000);
}
var pollTimer=null;
function unread(){return D?D.messages.filter(function(m){return m.sender==="coach"&&!m.read_at;}).length:0;}
function updateBadge(){var b=document.getElementById("msgbadge");if(!b)return;var n=unread();b.hidden=!n;b.textContent=n?String(n):"";if(n)b.setAttribute("aria-label",n+" message"+(n>1?"s":"")+" non lu"+(n>1?"s":""));}
function markRead(){if(!unread())return;var now=new Date().toISOString();D.messages.forEach(function(m){if(m.sender==="coach"&&!m.read_at)m.read_at=now;});persist();updateBadge();rpc("client_read_messages",{p_token:TOKEN}).catch(function(){});}
function pollMessages(){
  if(MODE!=="client"||!TOKEN||!D||document.visibilityState!=="visible")return;
  rpc("client_messages",{p_token:TOKEN}).then(function(a){if(!a||!D)return;var o=D.messages,ch=a.length!==o.length||(a.length&&a[a.length-1].id!==o[o.length-1].id);if(!ch)return;
    D.messages=a;persist();updateBadge();
    if(ui.tab==="msg"){var t=document.getElementById("m-body"),draft=t?t.value:"";render(true);t=document.getElementById("m-body");if(t)t.value=draft;}
    else if(ui.tab==="home"||(ui.tab==="prog"&&ui.view==="home"))render(true);}).catch(function(){});
}
function vMsg(){
  var h='<div><h1 style="font-size:24px">Messages</h1><p class="muted small">Ta conversation avec Yanis</p></div>';
  h+=msgList(D.messages,"client",function(r){return refLabel(r,cycles());});
  h+='<form class="card" id="msgform"><div class="field"><label for="m-body">Ton message</label><textarea id="m-body" maxlength="2000" placeholder="Écris à Yanis…"></textarea></div><button class="btn acc full" type="submit">Envoyer</button><p class="msg bad" id="m-msg" role="status"></p></form>';
  return h;
}
function lastMeasure(){var ds=Object.keys(D.body||{}).filter(function(d){var b=D.body[d];return ["taille","hanches","poitrine","bras","cuisse"].some(function(k){return num(b[k])>0;});}).sort();return ds.length?ds[ds.length-1]:null;}
function daysSince(d){var a=fromIso(d),b=fromIso(iso(new Date()));return Math.round((b-a)/86400000);}
function measureCard(){var l=lastMeasure();if(l&&daysSince(l)<7)return "";return '<button class="navrow" type="button" data-act="gomes"><span class="grow"><span class="title">'+(l?"Mensurations de la semaine":"Tes premières mensurations")+'</span><span class="muted small">'+(l?"Les dernières datent du "+esc(frDate(l))+". À reprendre cette semaine.":"Tour de taille, hanches, poitrine, bras, cuisse. Une fois par semaine.")+'</span></span>'+CHEV+'</button>';}
function avg7(){var t=new Date(),s=0,n=0;for(var i=0;i<7;i++){var d=new Date(t);d.setDate(t.getDate()-i);var b=D.body[iso(d)];if(b&&num(b.kg)>0){s+=num(b.kg);n++;}}return n?{v:s/n,n:n}:null;}
function weighCard(){
  var today=iso(new Date()),b=D.body[today],kg=b&&num(b.kg)>0?num(b.kg):0,a=avg7();
  if(kg&&!ui.wEdit)return '<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Poids du matin : '+fr(kg)+' kg</span><span class="muted small">'+(a&&a.n>1?"Moyenne sur 7 jours : "+fr(a.v)+" kg ("+a.n+" pesées)":"Reviens demain matin pour ta prochaine pesée.")+'</span></div><button class="btn ghost sm" type="button" data-act="wedit">Modifier</button></div></div>';
  return '<form class="card" id="wform"><div class="grow"><span class="title">Ton poids du matin</span><span class="muted small">Au réveil, à jeun, après être passé aux toilettes.</span></div><div class="row"><div class="field" style="flex:1"><label for="w-kg">Poids (kg)</label><input type="text" inputmode="decimal" id="w-kg" value="'+(kg?esc(fr(kg)):"")+'" placeholder="Ex. 82,4"></div><button class="btn acc" type="submit" style="align-self:flex-end">Enregistrer</button></div><p class="msg bad" id="w-msg" role="status"></p></form>';
}
function weekSummary(){
  var S=cyc().sessions||[],nd=S.filter(function(s){var L=peek(ui.week,s.id);return L&&L.done&&!(L.data&&L.data.skipped);}).length,G=goals();
  var d=new Date(),mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));var sum=0,n=0;
  for(var j=0;j<7;j++){var dd=new Date(mon);dd.setDate(mon.getDate()+j);var t=foodTotals(D.food[iso(dd)]);if(t.n){sum+=t.k;n++;}}
  var wp=bodySeries(D.body,D.logs).filter(function(s){return num(s.data.kg)>0;}),lw=wp.length?num(wp[wp.length-1].data.kg):0,pw=wp.length>1?num(wp[wp.length-2].data.kg):0,dw=lw&&pw?lw-pw:0;
  var h='<section class="sec"><h3>Ta semaine</h3><div class="tiles">';
  h+='<div class="tile"><span class="eyebrow muted">Séances</span><b>'+(S.length?nd+" / "+S.length:"–")+'</b><span class="muted small">semaine '+ui.week+'</span></div>';
  h+='<div class="tile"><span class="eyebrow muted">Calories</span><b>'+(n?r0(sum/n):"–")+'</b><span class="muted small">'+(n?"kcal en moyenne"+(G.kcal?" / "+G.kcal:""):"rien de noté")+'</span></div>';
  h+='<div class="tile"><span class="eyebrow muted">Poids</span><b>'+(lw?fr(lw)+" kg":"–")+'</b><span class="small '+(dw?goalClass(dw,D.client.weight_goal||"perdre"):"muted")+'">'+(lw?(dw?(dw>0?"▲ +":"▼ −")+fr(Math.abs(dw))+" kg":(pw?"stable":"1re pesée")):"pas de pesée")+'</span></div>';
  return h+'</div></section>';
}

/* ----- programme ----- */
function weekOpen(w){var S=cyc().sessions||[];for(var k=1;k<w;k++)for(var i=0;i<S.length;i++){var L=D.logs[ui.cycle+"-"+k+"-"+S[i].id];if(!(L&&L.done))return false;}return true;}
function currentWeek(){var n=cyc().nweeks||3;for(var w=n;w>=1;w--)if(weekOpen(w))return w;return 1;}
var LOCKS='<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:-1px"><rect x="5" y="11" width="14" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg>';
function weekSeg(){var n=cyc().nweeks||3,h='<div class="seg" role="group" aria-label="Semaine du cycle">';for(var w=1;w<=n;w++)h+='<button type="button" data-act="week" data-w="'+w+'" aria-pressed="'+(ui.week===w)+'"'+(weekOpen(w)?"":' aria-label="Semaine '+w+', verrouillée"')+'>'+(weekOpen(w)?"":LOCKS)+(n>3?'Sem. ':'Semaine ')+w+'</button>';return h+'</div>';}
function vHome(){
  var C=cyc(),S=C.sessions||[],o=openCycles(),h='<div><h1 style="font-size:24px">Tes séances</h1><p class="muted small">'+esc(D.program.title||"Ton programme")+'</p></div>';
  if(o.length>1){h+='<div class="seg" role="group" aria-label="Cycle">';o.forEach(function(c){h+='<button type="button" data-act="cycle" data-n="'+c.n+'" aria-pressed="'+(c.n===ui.cycle)+'">'+esc(c.name)+'</button>';});h+='</div>';}
  if(!S.length){h+='<p class="note">Ton programme arrive bientôt. Yanis est en train de le préparer.</p>';}
  else{
    h+=weekSeg();
    var dow=new Date().getDay(),today=null,next=null,i,isDone=function(s){var L=peek(ui.week,s.id);return !!(L&&L.done);},isSkip=function(s){var L=peek(ui.week,s.id);return !!(L&&L.done&&L.data&&L.data.skipped);},open=weekOpen(ui.week);
    if(!open)h+='<div class="card dash"><div class="row"><span class="muted">'+LOCK+'</span><div class="grow"><span class="title">Semaine '+ui.week+' verrouillée</span><span class="muted small">Termine d\'abord la semaine '+currentWeek()+'. En attendant, tu peux regarder les séances en aperçu.</span></div></div><button class="btn acc full sm" type="button" data-act="week" data-w="'+currentWeek()+'">Revenir à la semaine '+currentWeek()+'</button></div>';
    for(i=0;i<S.length;i++)if(S[i].dow===dow)today=S[i];
    if(today&&!isDone(today))next=today;
    if(!next)for(i=0;i<S.length;i++)if(!isDone(S[i])){next=S[i];break;}
    var nd=S.filter(function(s){return isDone(s)&&!isSkip(s);}).length,nwk=C.nweeks||3;
    if(open&&today&&isDone(today)&&!isSkip(today))h+='<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Séance du jour faite</span><span class="muted small">'+esc(today.day)+' · '+esc(today.title)+' · bilan envoyé à Yanis</span></div></div><button class="btn ghost sm full" type="button" data-act="open" data-sid="'+today.id+'">Revoir ma séance</button></div>';
    if(next){var n=0;next.blocks.forEach(function(b){n+=b.items.length;});
      h+='<div class="hero"><span class="eyebrow">'+esc(C.name)+' · Semaine '+ui.week+' · '+(!open?"Aperçu":(next===today?"Aujourd'hui":"Prochaine séance"))+'</span><h2>'+esc(next.day)+' · '+esc(next.title)+'</h2><p class="small">'+esc(next.sub)+' · '+n+' exercices</p><button class="btn inv" type="button" data-act="open" data-sid="'+next.id+'" style="margin-top:6px">'+(!open?"Voir la séance en aperçu":(peek(ui.week,next.id)?"Reprendre la séance":"Commencer la séance"))+'</button></div>';
    }else h+='<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Semaine '+ui.week+' terminée</span><span class="muted small">'+(nd===S.length?"Toutes tes séances de la semaine sont faites. Bravo.":nd+" séance"+(nd>1?"s":"")+" faite"+(nd>1?"s":"")+" sur "+S.length+". La semaine suivante est ouverte.")+'</span></div></div>'+(ui.week<nwk?'<button class="btn acc full" type="button" data-act="week" data-w="'+(ui.week+1)+'">Passer à la semaine '+(ui.week+1)+'</button>':'<p class="muted small">Tu as terminé ce cycle. Yanis te débloque la suite.</p>')+'</div>';
    h+='<section class="sec"><h3>Tes séances · semaine '+ui.week+' · '+nd+' sur '+S.length+' faite'+(nd>1?"s":"")+'</h3>';
    S.forEach(function(s){var L=peek(ui.week,s.id),sk=isSkip(s),dn=L&&L.done&&!sk;h+='<button class="navrow" type="button" data-act="open" data-sid="'+s.id+'"><span class="grow"><span class="title">'+esc(s.day)+' · '+esc(s.title)+'</span><span class="small '+(dn?"oktxt":"muted")+'">'+(sk?"Non faite":!open?"Aperçu · "+esc(s.sub):dn?"Faite"+(L.done_at?" le "+new Date(L.done_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long"}):""):(L?"Commencée, à terminer":esc(s.sub)))+'</span></span>'+(dn?CHK:(!open?'<span class="muted">'+LOCK+'</span>':CHEV))+'</button>';});
    h+='</section>';
  }
  if((D.program.guide||[]).length)h+='<section class="sec"><h3>À lire avant de commencer</h3><button class="navrow" type="button" data-act="guide"><span class="muted" style="flex:none"><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"></path><path d="M4 21a2 2 0 0 0 2 2h13v-4"></path></svg></span><span class="grow"><span class="title">Guide du programme</span><span class="muted small">Échauffement, variables, progression, mobilité</span></span>'+CHEV+'</button></section>';
  var locked=cycles().filter(function(c){return c.locked||!(c.sessions&&c.sessions.length);}).filter(function(c){return c.n!==ui.cycle||c.locked;});
  if(locked.length){h+='<section class="sec"><h3>La suite</h3>';
    locked.forEach(function(c){h+='<div class="card dash"><div class="row"><span class="muted">'+LOCK+'</span><div class="grow"><span class="title">'+esc(c.name)+(c.weeks?" · "+esc(c.weeks):"")+'</span><span class="muted small">'+(c.locked?"À débloquer avec le coach":"Contenu en préparation")+'</span></div></div></div>';});
    h+='<p class="muted small">Pour débloquer le cycle suivant, contacte Yanis : <span class="sel">'+COACH_TEL+'</span></p></section>';}
  return h;
}

/* ----- accueil ----- */
var TICK='<svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"></path></svg>';
function trow(ok,title,sub,btn){return '<div class="trow"><span class="dot'+(ok?" ok":"")+'">'+(ok?TICK:"")+'</span><span class="grow"><b>'+title+'</b><span class="muted small">'+sub+'</span></span>'+(btn||"")+'</div>';}
function vAccueil(){
  var C=cyc(),S=C.sessions||[],w=currentWeek(),dow=new Date().getDay(),td=iso(new Date()),G=goals(),i,t=null,nx=null;
  var LG=function(s){return D.logs[lk(w,s.id)];},dn=function(s){var L=LG(s);return !!(L&&L.done);};
  for(i=0;i<S.length;i++)if(S[i].dow===dow)t=S[i];
  for(i=0;i<S.length;i++)if(!dn(S[i])){nx=S[i];break;}
  var dl=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});dl=dl.charAt(0).toUpperCase()+dl.slice(1);
  var h='<div class="hello"><div class="grow"><span class="muted small">'+esc(dl)+'</span><h1>Bonjour '+esc(D.client.name)+'</h1></div><button class="icon-btn" type="button" data-act="gonotif" aria-label="Réglages des notifications"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"></path><path d="M10 20a2 2 0 0 0 4 0"></path></svg></button></div>';
  h+='<div class="card todo"><h2>À faire aujourd\'hui</h2>';
  var ob=function(s,lab,cls){return '<button class="btn '+cls+' sm" type="button" data-act="open" data-sid="'+s.id+'" data-w="'+w+'">'+lab+'</button>';},nex=function(s){var n=0;s.blocks.forEach(function(b){n+=b.items.length;});return n;};
  if(!S.length)h+=trow(false,"Ton programme arrive bientôt","Yanis est en train de le préparer.");
  else if(t&&!dn(t))h+=trow(false,esc(t.title),esc(C.name)+" · semaine "+w+" · "+nex(t)+" exercices",ob(t,LG(t)?"Reprendre":"Commencer","acc"));
  else if(t){var sk=LG(t).data&&LG(t).data.skipped;h+=trow(!sk,esc(t.title),sk?"Marquée non faite":"Séance faite · bilan envoyé à Yanis",ob(t,"Revoir","ghost"));}
  else if(nx&&flexDays())h+=trow(false,esc(nx.day)+" · "+esc(nx.title),esc(C.name)+" · semaine "+w+" · "+nex(nx)+" exercices",ob(nx,LG(nx)?"Reprendre":"Commencer","acc"));
  else if(nx)h+=trow(false,"Pas de séance prévue aujourd'hui","Prochaine : "+esc(nx.day)+" · "+esc(nx.title),ob(nx,"Voir","ghost"));
  else h+=trow(true,"Semaine "+w+" terminée","Toutes tes séances de la semaine sont notées.");
  var kg=num((D.body[td]||{}).kg);
  h+=trow(kg>0,"Poids du matin",kg>0?fr(kg)+" kg":"Au réveil, à jeun",kg>0?"":'<button class="btn ghost sm" type="button" data-act="gonutri">Noter</button>');
  var ft=foodTotals(D.food[td]);
  h+=trow(G.kcal>0&&ft.k>=G.kcal*0.9,"Journal alimentaire",r0(ft.k)+(G.kcal?" sur "+G.kcal:"")+" kcal",'<button class="btn ghost sm" type="button" data-act="gonutri">Ajouter</button>');
  var lm=lastMeasure();if(!lm||daysSince(lm)>=7)h+=trow(false,"Mensurations de la semaine",lm?"Les dernières datent du "+esc(frDate(lm)):"Taille, hanches, poitrine, bras, cuisse",'<button class="btn ghost sm" type="button" data-act="gomes">Noter</button>');
  h+='</div>';
  var kw=ui.week;ui.week=w;h+=weekSummary();ui.week=kw;
  var wp=bodySeries(D.body,D.logs).filter(function(s){return num(s.data.kg)>0;}).map(function(s){return {day:s.day,v:num(s.data.kg)};});
  if(wp.length){var a0=wp[0],b0=wp[wp.length-1],dd=b0.v-a0.v,av=avg7();
    h+='<div class="card"><div class="row"><h2 class="grow" style="font-size:15px">Poids</h2>'+(wp.length>1?'<span class="small '+goalClass(dd,D.client.weight_goal||"perdre")+'">'+(dd===0?"Stable":(dd>0?"▲ +":"▼ −")+fr(Math.abs(dd))+" kg")+' depuis le '+esc(frDate(a0.day,{day:"numeric",month:"short"}))+'</span>':'')+'</div><div class="row" style="align-items:flex-end"><span class="kcal" style="font-size:26px">'+fr(b0.v)+' kg</span><span class="grow muted small" style="text-align:right">'+(av&&av.n>1?"Moyenne 7 jours : "+fr(av.v)+" kg":"")+(wp.length>1?(av&&av.n>1?"<br>":"")+"Départ : "+fr(a0.v)+" kg":"")+'</span></div>'+weightChart(wp)+'</div>';}
  var cms=D.messages.filter(function(m){return m.sender==="coach";}),lmsg=cms[cms.length-1],un=unread();
  h+='<button class="navrow'+(un?" okcard":"")+'" type="button" data-act="gomsg"><span class="avatar" aria-hidden="true">Y</span><span class="grow"><span class="title">'+(lmsg?"Message de Yanis":"Écrire à Yanis")+'</span><span class="muted small" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(lmsg?esc(lmsg.body.slice(0,90)):"Une question ? Ta messagerie est ici.")+'</span></span>'+(un?'<span class="count" aria-label="'+un+' non lu'+(un>1?"s":"")+'">'+un+'</span>':CHEV)+'</button>';
  h+=vNotif();
  h+='<button class="btn ghost sm" type="button" data-act="logout">Changer de code d\'accès</button>';
  return h;
}
function exFilled(e){return !!(e&&(e.done||e.h||e.feel||(e.s||[]).some(function(q){return q&&(q.kg||q.r||q.m);})));}
function sessDone(){var s=sess(ui.sid),L=D.logs[lk(ui.week,ui.sid)],E=(L&&L.data&&L.data.ex)||{},d=0;if(!s)return 0;s.blocks.forEach(function(b){b.items.forEach(function(x){if(exFilled(E[x.id]))d++;});});return d;}
var NXT=0;function doneTxt(d){return d+" exercice"+(d>1?"s":"")+" noté"+(d>1?"s":"")+" sur "+NXT;}
function progHtml(xi,N,NX){NXT=NX;return '<div class="sprog"><div class="row" style="justify-content:space-between"><span>Bloc '+(N?xi+1:0)+' sur '+N+'</span><span class="muted" id="sprog-t">'+doneTxt(sessDone())+'</span></div><div class="bar"><i style="width:'+pct(xi+1,N)+'%"></i></div></div>';}
function updProg(){var t=document.getElementById("sprog-t");if(t)t.textContent=doneTxt(sessDone());}
function flexDays(){var S=cyc().sessions||[];return S.length>0&&S.every(function(s){return typeof s.dow!=="number";});}
function prefs(){var n=D.client.notif||{};return {on:n.on!==false,reminder:n.reminder!==false,time:/^\d{1,2}:\d{2}$/.test(n.time||"")?n.time:"08:00",tz:(function(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||"Europe/Paris";}catch(e){return "Europe/Paris";}})()};}
function vNotif(){
  var h='<section class="sec" id="notif"><h3>Notifications</h3>',intro=pushIntro(),p=prefs();
  if(intro)return h+intro+'</section>';
  if(PUSH.on){
    h+='<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Notifications activées</span><span class="muted small">Sur cet appareil : messages de Yanis, commentaires sur tes séances, cycle débloqué.</span></div></div>';
    h+='<label class="row" style="min-height:44px"><input type="checkbox" id="n-rem" data-b="nrem"'+(p.reminder?" checked":"")+' style="width:22px;height:22px;accent-color:var(--accent);flex:none"><span class="grow"><span style="font-weight:700">Rappel les jours de séance</span><span class="muted small">Seulement si la séance du jour n\'est pas encore faite.</span></span></label>';
    h+='<div class="field"'+(p.reminder?"":" hidden")+'><label for="n-time">Heure du rappel</label><input type="time" id="n-time" data-b="ntime" value="'+esc(p.time)+'" style="width:100%;min-height:44px;border:1px solid var(--line2);border-radius:8px;background:var(--field);color:var(--fg);padding:8px 10px;font-size:16px;font-weight:700"><span class="muted small">Le rappel part dans le quart d\'heure qui suit.</span></div>';
    h+='<button class="btn ghost sm full" type="button" data-act="pushoff">Désactiver sur cet appareil</button>';
  }else{
    h+='<div class="card"><div class="grow"><span class="title">Être prévenu sur ton téléphone</span><span class="muted small">Messages de Yanis, commentaires sur tes séances, cycle débloqué, et un rappel les jours de séance à l\'heure que tu choisis.</span></div><button class="btn acc full" type="button" data-act="pushon">Activer les notifications</button>';
  }
  return h+'<p class="msg" id="n-msg" role="status">'+esc(PUSH.msg||"")+'</p></div></section>';
}
function savePrefs(sub,p){return rpc("client_save_push",{p_token:TOKEN,p_sub:sub,p_prefs:p}).then(function(r){D.client.notif=r||p;persist();});}
var evt={};
function prevHint(x,i){
  var L=peek(ui.week-1,ui.sid),d=L&&L.data&&L.data.ex&&L.data.ex[x.id],s=d&&d.s&&d.s[i];if(!s)return "–";
  if(x.t==="dist")return s.m?esc(s.m)+" m":"–";
  if(!s.kg&&!s.r)return "–";
  return esc(s.kg||"PDC")+" × "+esc(s.r||"–");
}
function vEx(x,L){
  var d=L.data.ex[x.id]||{},h='<article class="card ex"><div class="row" style="align-items:flex-start"><div class="grow"><h3>'+(x.code?esc(x.code)+' · ':'')+esc(x.name)+'</h3><span class="presc">'+esc(x.presc)+'</span>'+(x.pause?'<span class="muted small">'+esc(x.pause)+'</span>':'')+'</div>'+(x.v?'<a class="btn ghost sm" href="'+esc(x.v)+'" target="_blank" rel="noopener" aria-label="Voir la vidéo : '+esc(x.name)+'">'+PLAY+'Vidéo</a>':'')+'</div>';
  if(x.note)h+='<p class="muted small">'+esc(x.note)+'</p>';
  var i,s,id=esc(x.id);
  var pv=ui.week>1,fc=function(v){return v?' class="filled"':"";},nm=esc(x.name);
  if(x.t==="load"||x.t==="iso"){
    h+='<div class="sgrid'+(pv?"":" c3")+'"><span class="hd">Série</span><span class="hd">Charge (kg)</span><span class="hd">'+(x.t==="iso"?"Secondes":"Reps")+'</span>'+(pv?'<span class="hd r">Sem. '+(ui.week-1)+'</span>':"");
    for(i=0;i<nSets(x,ui.week);i++){s=(d.s&&d.s[i])||{};
      h+='<span class="n">'+(i+1)+'</span><input type="text" inputmode="decimal" id="i-'+id+'-'+i+'-kg" aria-label="'+nm+', série '+(i+1)+', charge en kilos" data-b="set" data-ex="'+id+'" data-i="'+i+'" data-f="kg" value="'+esc(s.kg)+'" placeholder="PDC"'+fc(s.kg)+'><input type="text" inputmode="numeric" id="i-'+id+'-'+i+'-r" aria-label="'+nm+', série '+(i+1)+', '+(x.t==="iso"?"secondes":"répétitions")+'" data-b="set" data-ex="'+id+'" data-i="'+i+'" data-f="r" value="'+esc(s.r)+'"'+fc(s.r)+'>'+(pv?'<span class="pv">'+prevHint(x,i)+'</span>':"");}
    h+='</div>';
  }else if(x.t==="dist"){
    h+='<div class="sgrid '+(pv?"d3":"d2")+'"><span class="hd">Série</span><span class="hd">Distance (m)</span>'+(pv?'<span class="hd r">Sem. '+(ui.week-1)+'</span>':"");
    for(i=0;i<x.sets;i++){s=(d.s&&d.s[i])||{};
      h+='<span class="n">'+(i+1)+'</span><input type="text" inputmode="decimal" id="i-'+id+'-'+i+'-m" aria-label="'+nm+', série '+(i+1)+', distance en mètres" data-b="set" data-ex="'+id+'" data-i="'+i+'" data-f="m" value="'+esc(s.m)+'"'+fc(s.m)+'>'+(pv?'<span class="pv">'+prevHint(x,i)+'</span>':"");}
    h+='</div>';
  }else if(x.t==="box"){
    h+='<div class="two"><div class="field"><label for="i-'+id+'-h">Hauteur de box (cm)</label><input type="text" inputmode="decimal" id="i-'+id+'-h" data-b="exf" data-ex="'+id+'" data-f="h" value="'+esc(d.h)+'"></div><div class="field"><label for="i-'+id+'-f">Ressenti</label><input type="text" id="i-'+id+'-f" data-b="exf" data-ex="'+id+'" data-f="feel" value="'+esc(d.feel)+'"></div></div>';
  }else{
    h+='<div class="two" role="group" aria-label="Exercice fait ?"><button class="btn ghost sm" type="button" data-act="done" data-ex="'+id+'" data-v="oui" aria-pressed="'+(d.done==="oui")+'">Fait</button><button class="btn ghost sm" type="button" data-act="done" data-ex="'+id+'" data-v="non" aria-pressed="'+(d.done==="non")+'">Pas fait</button></div><div class="field"><label for="i-'+id+'-f">Ressenti</label><input type="text" id="i-'+id+'-f" data-b="exf" data-ex="'+id+'" data-f="feel" value="'+esc(d.feel)+'"></div>';
  }
  var ps=pauseSec(x.pause);if(ps)h+='<button class="btn ghost sm full" type="button" data-act="rest" data-s="'+ps+'">Lancer le chrono de repos · '+mmss(ps)+'</button>';
  return h+'</article>';
}
function vSession(){
  var s=sess(ui.sid);if(!s){ui.view="home";return vHome();}
  var L=cur(),h=backHead("home","Retour à tes séances",(cyc().label||cyc().name)+" · "+s.day,s.title+" · "+s.sub);
  var IT=s.blocks,N=IT.length,NX=0;IT.forEach(function(b){NX+=b.items.length;});
  if(ui.xi==null||ui.xi<0){ui.xi=0;for(var q=0;q<N;q++){if(IT[q].items.some(function(x){return !exFilled(L.data.ex[x.id]);})){ui.xi=q;break;}}}
  if(ui.xi>N-1)ui.xi=Math.max(0,N-1);var xi=ui.xi,last=xi>=N-1;
  h+=weekSeg()+progHtml(xi,N,NX);
  var wopen=weekOpen(ui.week),skipped=L.done&&L.data.skipped;
  if(!wopen)h+='<div class="card dash"><div class="row"><span class="muted">'+LOCK+'</span><div class="grow"><span class="title">Aperçu · semaine '+ui.week+' verrouillée</span><span class="muted small">Tu pourras remplir cette séance quand la semaine '+currentWeek()+' sera terminée.</span></div></div></div>';
  else if(skipped)h+='<div class="card dash"><div class="grow"><span class="title">Séance marquée non faite</span><span class="muted small">Yanis le voit dans son espace.</span></div><button class="btn ghost sm full" type="button" data-act="unskip">Finalement, je la fais</button></div>';
  else if(L.done)h+='<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Séance faite</span><span class="muted small">'+(L.done_at?"Le "+new Date(L.done_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})+" · ":"")+'tu peux encore corriger tes saisies.</span></div></div></div>';
  var cm=D.messages.filter(function(m){return m.sender==="coach"&&m.ref===lk(ui.week,ui.sid);});
  if(cm.length)h+='<div class="card okcard"><span class="eyebrow muted">Commentaire de Yanis</span>'+cm.map(function(m){return '<p style="white-space:pre-wrap;overflow-wrap:anywhere">'+esc(m.body)+'</p>';}).join("")+'</div>';
  if(s.warm&&xi===0)h+='<div class="card"><span class="eyebrow muted">Warm up & priming</span><p class="small">'+esc(s.warm)+'</p></div>';
  if(N){var cu=IT[xi],nx=IT[xi+1];
    h+='<section class="sec"><div class="blockbar"><h2>'+esc(cu.name)+'</h2>'+(cu.tag?'<span>'+esc(cu.tag)+'</span>':'')+'</div>';
    if(cu.items.length>1)h+='<p class="muted small">'+cu.items.length+' exercices dans ce bloc, sur la même page.</p>';
    cu.items.forEach(function(x){h+=vEx(x,L);});h+='</section>';
    if(nx)h+='<button class="navrow" type="button" data-act="xnav" data-i="'+(xi+1)+'"><span class="grow"><span class="muted small" style="font-weight:600">Ensuite</span><span class="title">'+esc(nx.name)+'</span><span class="muted small">'+nx.items.map(function(x){return esc(x.name);}).join(" · ")+'</span></span>'+CHEV+'</button>';
    if(!last)h+='<button class="btn inv full" type="button" data-act="xnav" data-i="'+(xi+1)+'">Bloc suivant</button>';
    else if(wopen&&!skipped)h+='<button class="btn inv full" type="button" data-act="end">'+(L.done?"Modifier mon bilan de fin de séance":"Fin de séance · mon ressenti")+'</button>';
    if(xi>0)h+='<button class="btn ghost full sm" type="button" data-act="xnav" data-i="'+(xi-1)+'">Bloc précédent</button>';
  }
  if(wopen&&!skipped&&!L.done)h+='<button class="btn ghost full sm" type="button" data-act="skip">'+(ui.skipAsk===lk(ui.week,ui.sid)?"Confirmer : je n'ai pas fait cette séance":"Je n'ai pas fait cette séance")+'</button>';
  return h;
}
var ENDF=[["diff","Difficulté de la séance"],["nrj","Énergie"],["stress","Stress"],["sq","Qualité du sommeil"]];
function vEnd(){
  var s=sess(ui.sid);if(!s||!weekOpen(ui.week)){ui.view="home";return vHome();}
  var L=cur(),e=L.data.end,h=backHead("open","Retour à la séance","Fin de séance",s.day+" · semaine "+ui.week,' data-sid="'+esc(s.id)+'"')+'<div class="card">';
  ENDF.forEach(function(f){var has=e[f[0]]!=null&&e[f[0]]!=="";h+='<div class="field"><label for="e-'+f[0]+'"><span>'+f[1]+'</span><output id="o-'+f[0]+'">'+(has?esc(e[f[0]]):"–")+'</output></label><input type="range" min="0" max="10" step="1" id="e-'+f[0]+'" data-b="end" data-f="'+f[0]+'" value="'+(has?esc(e[f[0]]):5)+'"></div>';});
  h+='<div class="two"><div class="field"><label for="e-sh">Sommeil (heures)</label><input type="text" inputmode="decimal" id="e-sh" data-b="end" data-f="sh" value="'+esc(e.sh)+'"></div><div class="field"><label for="e-kg">Poids du matin (kg)</label><input type="text" inputmode="decimal" id="e-kg" data-b="end" data-f="kg" value="'+esc(e.kg)+'"></div></div>';
  h+='<div class="field"><label for="e-pain">Courbatures / douleur</label><input type="text" id="e-pain" data-b="end" data-f="pain" value="'+esc(e.pain)+'"></div>';
  h+='<div class="field"><label for="e-mob">Mobilité à la maison cette semaine (nombre de fois)</label><input type="text" inputmode="numeric" id="e-mob" data-b="end" data-f="mob" value="'+esc(e.mob)+'"></div>';
  h+='<div class="field"><label for="e-com">Commentaire</label><textarea id="e-com" data-b="end" data-f="com">'+esc(e.com)+'</textarea></div></div>';
  h+='<button class="btn acc full" type="button" data-act="finish">'+(L.done?"Mettre à jour mon bilan":"Séance terminée")+'</button>';
  if(L.done)h+='<div class="card"><div class="row">'+CHK+'<div class="grow"><span class="title">Bilan envoyé à Yanis</span><span class="muted small">Il le voit dans son espace coach. Tu peux encore le corriger.</span></div></div><button class="btn ghost full sm" type="button" data-act="home">Retour à tes séances</button></div>';
  return h;
}
function vGuide(){
  var h=backHead("home","Retour à tes séances","Guide du programme",D.program.title||"");
  (D.program.guide||[]).forEach(function(g){h+='<details><summary>'+esc(g.t)+'</summary><div class="body">'+g.html+'</div></details>';});
  return h;
}

/* ----- nutrition ----- */
function goals(){var c=D.client;return {kcal:c.kcal||0,prot:c.prot||0,carb:c.carb||0,fat:c.fat||0};}
function dayEntries(){return D.food[ui.date]||[];}
function addEntry(e){var a=D.food[ui.date]||(D.food[ui.date]=[]);e.id=uid();a.push(e);touchFood();}
function mealSelect(id,val){var h='<select id="'+id+'">';MEALS.forEach(function(m){h+='<option'+(m===val?" selected":"")+'>'+m+'</option>';});return h+'</select>';}
function guessMeal(){var hr=new Date().getHours();return hr<10?MEALS[0]:hr<14?MEALS[1]:hr<18?MEALS[2]:hr<21?MEALS[3]:MEALS[4];}
function vNutri(){
  if(ui.nview==="scan")return vScan();
  if(ui.nview==="search")return vSearch();
  if(ui.nview==="item")return vItem();
  if(ui.nview==="create")return vCreate();
  if(ui.nview==="planadd")return vPlanAdd();
  var G=goals(),h='<div><h1 style="font-size:24px">Nutrition</h1><p class="muted small">'+esc(D.nutrition.title||"Ton suivi alimentaire")+(G.kcal?" · "+G.kcal+" kcal par jour":"")+'</p></div>';
  h+='<div class="seg" role="group" aria-label="Vue"><button type="button" data-act="ntab" data-v="journal" aria-pressed="'+(ui.ntab==="journal")+'">Mon journal</button><button type="button" data-act="ntab" data-v="plan" aria-pressed="'+(ui.ntab==="plan")+'">Mon plan</button></div>';
  if(ui.ntab==="plan")return h+vPlan();
  var E=dayEntries(),t=foodTotals(E),d=fromIso(ui.date),isToday=ui.date===iso(new Date());
  h+='<div class="row"><button class="icon-btn" type="button" data-act="day" data-d="-1" aria-label="Jour précédent">'+BACK+'</button><div class="grow" style="text-align:center"><span class="title">'+(isToday?"Aujourd'hui":esc(d.toLocaleDateString("fr-FR",{weekday:"long"})))+'</span><span class="muted small">'+esc(frDate(ui.date))+'</span></div><button class="icon-btn" type="button" data-act="day" data-d="1" aria-label="Jour suivant"'+(isToday?" disabled":"")+'>'+CHEV+'</button></div>';
  if(isToday)h+=weighCard()+measureCard();
  if(!G.kcal)h+='<p class="note">Yanis n\'a pas encore fixé tes objectifs. Tu peux déjà noter ce que tu manges.</p>';
  h+=totalsCard(t,G);
  h+='<div class="two"><button class="btn acc" type="button" data-act="nv" data-v="scan">Scanner un produit</button><button class="btn acc" type="button" data-act="nv" data-v="search">Chercher un aliment</button>'+(D.nutrition.days?'<button class="btn ghost" type="button" data-act="nv" data-v="planadd">Repas de mon plan</button>':'')+'<button class="btn ghost" type="button" data-act="nv" data-v="create">Créer un aliment</button></div>';
  h+='<section class="sec"><h3>Ce que tu as mangé</h3>';
  if(!E.length)h+='<p class="note">Rien de noté pour ce jour. Scanne un produit, cherche un aliment ou ajoute un repas de ton plan.</p>';
  MEALS.forEach(function(m){
    var L=E.filter(function(x){return x.meal===m;});if(!L.length)return;
    var mt=foodTotals(L);
    h+='<div class="card"><div class="row"><span class="eyebrow muted grow">'+m+'</span><span class="small muted">'+r0(mt.k)+' kcal</span></div>';
    L.forEach(function(x){h+='<div class="row"><div class="grow"><span style="font-weight:700;overflow-wrap:anywhere">'+esc(x.name)+(x.brand?' <span class="muted small">· '+esc(x.brand)+'</span>':'')+'</span><span class="muted small">'+(x.qty?esc(x.qty)+" g · ":"")+r0(x.k)+' kcal · P '+r0(x.p)+' · G '+r0(x.g)+' · L '+r0(x.l)+'</span></div><button class="btn ghost sm" type="button" data-act="delentry" data-id="'+esc(x.id)+'" aria-label="Retirer '+esc(x.name)+'">Retirer</button></div>';});
    h+='</div>';
  });
  h+='</section>';
  var mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));var sum={k:0,p:0,g:0,l:0},nd=0;
  for(var j=0;j<7;j++){var dd=new Date(mon);dd.setDate(mon.getDate()+j);var tt=foodTotals(D.food[iso(dd)]);if(tt.n){sum.k+=tt.k;sum.p+=tt.p;sum.g+=tt.g;sum.l+=tt.l;nd++;}}
  h+='<div class="card"><span class="eyebrow muted">Bilan de la semaine</span>'+(nd?'<span class="title">Moyenne : '+r0(sum.k/nd)+' kcal par jour</span><span class="muted small">P '+r0(sum.p/nd)+' · G '+r0(sum.g/nd)+' · L '+r0(sum.l/nd)+' g · '+nd+' jour'+(nd>1?"s":"")+' noté'+(nd>1?"s":"")+' sur 7</span>':'<span class="muted small">Note ton premier aliment pour voir ta moyenne de la semaine.</span>')+'<p class="muted small">La semaine compte plus que la journée.</p></div>';
  return h;
}
function vPlan(){
  var N=D.nutrition,h="";
  if(!N.days&&!(N.sections||[]).length)return '<p class="note">Ton plan nutrition arrive bientôt.</p>';
  if(N.days){h+='<section class="sec"><h3>Ta semaine type</h3>';
    ["lun","mar","mer","jeu","ven","sam","dim"].forEach(function(k){var dy=N.days[k];if(!dy)return;
      h+='<details><summary>'+esc(dy.label)+' · '+esc(dy.type)+'</summary><div class="body">';
      dy.meals.forEach(function(m){h+='<h4>'+esc(m.slot)+'</h4><p><b>'+esc(m.name)+'</b> · ≈ '+m.k+' kcal · P '+m.p+' · G '+m.g+' · L '+m.l+'</p><ul class="plain small muted">'+m.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>'+(m.tip?'<p class="small muted">'+esc(m.tip)+'</p>':'');});
      h+='</div></details>';});
    h+='</section>';}
  if((N.sections||[]).length){h+='<section class="sec"><h3>Ton plan</h3>';N.sections.forEach(function(p){h+='<details><summary>'+esc(p.t)+'</summary><div class="body">'+p.html+'</div></details>';});h+='</section>';}
  return h;
}
function nBack(title,sub){return backHead("nv","Retour au journal",title,sub,' data-v="journal"');}
function vScan(){
  return nBack("Scanner un produit","Vise le code-barres de l'emballage")+'<div id="reader"></div><p class="msg" id="scanmsg" role="status">'+esc(ui.msg||"Ouverture de l'appareil photo…")+'</p><div class="card"><div class="field"><label for="code">Ou tape le code-barres</label><input type="text" inputmode="numeric" id="code" placeholder="Ex. 8076800195057"></div><button class="btn ghost full" type="button" data-act="codego">Chercher ce code</button></div>';
}
function foodRow(f,i,kind){return '<button class="navrow" type="button" data-act="pick" data-k="'+kind+'" data-i="'+i+'"><span class="grow"><span style="font-weight:700;overflow-wrap:anywhere">'+esc(f.name)+(f.brand?' <span class="muted small">· '+esc(f.brand)+'</span>':'')+'</span><span class="muted small">Pour 100 g : '+r0(f.kcal)+' kcal · P '+r1(f.prot)+' · G '+r1(f.carb)+' · L '+r1(f.fat)+'</span></span>'+CHEV+'</button>';}
function myMatches(){var q=ui.q.trim().toLowerCase();return D.foods.filter(function(f){return !q||(f.name+" "+(f.brand||"")).toLowerCase().indexOf(q)>=0;});}
function vSearch(){
  var h=nBack("Chercher un aliment","Tes aliments et la base Open Food Facts");
  h+='<form class="card" id="searchform"><div class="field"><label for="q">Nom de l\'aliment ou du produit</label><input type="search" id="q" value="'+esc(ui.q)+'" placeholder="Ex. skyr nature, riz basmati" autocomplete="off"></div><button class="btn acc full" type="submit">Chercher</button></form>';
  var mine=myMatches();
  if(mine.length){h+='<section class="sec"><h3>Mes aliments</h3>';mine.slice(0,30).forEach(function(f){h+=foodRow(f,D.foods.indexOf(f),"mine");});h+='</section>';}
  h+='<section class="sec"><h3>Open Food Facts</h3>';
  if(ui.msg)h+='<p class="msg" role="status">'+esc(ui.msg)+'</p>';
  if(ui.results){if(!ui.results.length)h+='<p class="note">Aucun résultat. Essaie un autre mot, scanne le produit ou crée l\'aliment.</p>';ui.results.forEach(function(f,i){h+=foodRow(f,i,"off");});}
  else if(!ui.msg)h+='<p class="muted small">Tape un nom puis « Chercher ».</p>';
  h+='</section><button class="btn ghost full" type="button" data-act="nv" data-v="create">Créer un aliment</button>';
  return h;
}
function vItem(){
  var it=ui.item,f=it.food,q=num(it.qty),h=nBack(f.name,f.brand||"");
  var k=f.kcal*q/100,p=f.prot*q/100,g=f.carb*q/100,l=f.fat*q/100;
  h+='<div class="card"><div class="two"><div class="field"><label for="it-qty">Quantité mangée (g ou ml)</label><input type="text" inputmode="decimal" id="it-qty" data-b="itqty" value="'+esc(it.qty)+'"></div><div class="field"><label for="it-meal">Repas</label>'+mealSelect("it-meal",it.meal)+'</div></div>';
  h+='<div class="grow"><span class="eyebrow muted">Pour cette quantité</span><span class="title" id="it-prev">'+r0(k)+' kcal · P '+r1(p)+' · G '+r1(g)+' · L '+r1(l)+'</span><span class="muted small" id="it-prev2">'+xLine(f,q/100)+'</span></div>';
  h+='<button class="btn acc full" type="button" data-act="additem">Ajouter à ma journée</button></div>';
  h+='<details'+(it.fix?" open":"")+'><summary>Valeurs pour 100 g</summary><div class="body"><p class="muted small">Vérifie avec l\'étiquette. Corrige si une valeur est fausse ou manquante.</p><div class="four"><div class="field"><label for="f-kcal">kcal</label><input type="text" inputmode="decimal" id="f-kcal" data-b="itf" data-f="kcal" value="'+esc(r1(f.kcal))+'"></div><div class="field"><label for="f-prot">Prot.</label><input type="text" inputmode="decimal" id="f-prot" data-b="itf" data-f="prot" value="'+esc(r1(f.prot))+'"></div><div class="field"><label for="f-carb">Gluc.</label><input type="text" inputmode="decimal" id="f-carb" data-b="itf" data-f="carb" value="'+esc(r1(f.carb))+'"></div><div class="field"><label for="f-fat">Lip.</label><input type="text" inputmode="decimal" id="f-fat" data-b="itf" data-f="fat" value="'+esc(r1(f.fat))+'"></div></div><div class="four"><div class="field"><label for="f-sug">Sucres</label><input type="text" inputmode="decimal" id="f-sug" data-b="itf" data-f="sug" value="'+esc(r1(f.sug))+'"></div><div class="field"><label for="f-sat">Gr. sat.</label><input type="text" inputmode="decimal" id="f-sat" data-b="itf" data-f="sat" value="'+esc(r1(f.sat))+'"></div><div class="field"><label for="f-fib">Fibres</label><input type="text" inputmode="decimal" id="f-fib" data-b="itf" data-f="fib" value="'+esc(r1(f.fib))+'"></div><div class="field"><label for="f-salt">Sel</label><input type="text" inputmode="decimal" id="f-salt" data-b="itf" data-f="salt" value="'+esc(Math.round(f.salt*100)/100)+'"></div></div>'+(f.src!=="mine"?'<button class="btn ghost full sm" type="button" data-act="savemine">Enregistrer dans Mes aliments</button>':'<button class="btn ghost full sm" type="button" data-act="delmine">Supprimer de Mes aliments</button>')+'<p class="msg" id="it-msg" role="status"></p></div></details>';
  if(it.warn)h+='<p class="note">'+esc(it.warn)+'</p>';
  return h;
}
function vCreate(){
  var c=ui.create||{};
  return nBack("Créer un aliment","Recopie les valeurs de l'étiquette, pour 100 g")+'<form class="card" id="createform"><div class="field"><label for="c-name">Nom</label><input type="text" id="c-name" value="'+esc(c.name)+'" placeholder="Ex. Pâtes complètes"></div><div class="field"><label for="c-brand">Marque (facultatif)</label><input type="text" id="c-brand" value="'+esc(c.brand)+'"></div><div class="four"><div class="field"><label for="c-kcal">kcal</label><input type="text" inputmode="decimal" id="c-kcal"></div><div class="field"><label for="c-prot">Prot.</label><input type="text" inputmode="decimal" id="c-prot"></div><div class="field"><label for="c-carb">Gluc.</label><input type="text" inputmode="decimal" id="c-carb"></div><div class="field"><label for="c-fat">Lip.</label><input type="text" inputmode="decimal" id="c-fat"></div></div><p class="muted small">Facultatif :</p><div class="four"><div class="field"><label for="c-sug">Sucres</label><input type="text" inputmode="decimal" id="c-sug"></div><div class="field"><label for="c-sat">Gr. sat.</label><input type="text" inputmode="decimal" id="c-sat"></div><div class="field"><label for="c-fib">Fibres</label><input type="text" inputmode="decimal" id="c-fib"></div><div class="field"><label for="c-salt">Sel</label><input type="text" inputmode="decimal" id="c-salt"></div></div>'+(c.barcode?'<p class="muted small">Code-barres : '+esc(c.barcode)+'. La prochaine fois, le scan le retrouvera.</p>':'')+'<button class="btn acc full" type="submit">Enregistrer l\'aliment</button><p class="msg bad" id="c-msg" role="status">'+esc(ui.msg||"")+'</p></form>';
}
function vPlanAdd(){
  var N=D.nutrition,k=ui.pday||DKEYS[fromIso(ui.date).getDay()],h=nBack("Repas de mon plan","Ajoute un repas de ta semaine type");
  h+='<div class="field"><label for="pday">Journée type</label><select id="pday" data-b="pday">';
  ["lun","mar","mer","jeu","ven","sam","dim"].forEach(function(x){if(N.days[x])h+='<option value="'+x+'"'+(x===k?" selected":"")+'>'+esc(N.days[x].label)+' · '+esc(N.days[x].type)+'</option>';});
  h+='</select></div>';
  (N.days[k]?N.days[k].meals:[]).forEach(function(m,i){
    h+='<article class="card"><div class="grow"><span class="eyebrow muted">'+esc(m.slot)+'</span><span class="title">'+esc(m.name)+'</span><span class="presc">≈ '+m.k+' kcal · P '+m.p+' · G '+m.g+' · L '+m.l+'</span></div><ul class="plain small muted">'+m.items.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul><div class="two"><div class="field"><select id="pf-'+i+'" aria-label="Portion mangée">'+[[0.5,"½ portion"],[0.75,"¾ portion"],[1,"Portion du plan"],[1.25,"1 portion ¼"],[1.5,"1 portion ½"]].map(function(o){return '<option value="'+o[0]+'"'+(o[0]===1?" selected":"")+'>'+o[1]+'</option>';}).join("")+'</select></div><button class="btn acc sm" type="button" data-act="addplan" data-i="'+i+'">Ajouter</button></div></article>';
  });
  return h;
}
function loadScript(src){return new Promise(function(res,rej){if(window.Html5Qrcode)return res();var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=function(){rej(new Error("script"));};document.head.appendChild(s);});}
function stopScan(){if(scanner){var s=scanner;scanner=null;try{s.stop().then(function(){try{s.clear();}catch(e){}}).catch(function(){});}catch(e){}}}
function startScan(){
  loadScript("vendor/html5-qrcode.min.js").then(function(){
    if(ui.nview!=="scan"||!document.getElementById("reader"))return;
    var F=window.Html5QrcodeSupportedFormats;
    scanner=new window.Html5Qrcode("reader",{formatsToSupport:[F.EAN_13,F.EAN_8,F.UPC_A,F.UPC_E],experimentalFeatures:{useBarCodeDetectorIfSupported:true},verbose:false});
    return scanner.start({facingMode:"environment"},{fps:10,qrbox:function(w,h){return {width:Math.round(w*0.86),height:Math.round(Math.min(w,h)*0.5)};}},function(code){if(!scanner)return;stopScan();lookup(code);},function(){})
    .then(function(){var m=document.getElementById("scanmsg");if(m)m.textContent="Place le code-barres dans le cadre.";});
  }).catch(function(){scanner=null;var m=document.getElementById("scanmsg");if(m){m.textContent="Appareil photo indisponible. Autorise la caméra pour ce site, ou tape le code-barres ci-dessous.";m.className="msg bad";}});
}
function offFood(p){
  var n=p.nutriments||{},k=n["energy-kcal_100g"];if(k==null&&n.energy_100g!=null)k=n.energy_100g/4.184;
  var b=Array.isArray(p.brands)?p.brands[0]:String(p.brands||"").split(",")[0];
  return {name:(p.product_name_fr||p.product_name||"").trim()||"Produit sans nom",brand:(b||"").trim(),barcode:p.code||"",kcal:num(k),prot:num(n.proteins_100g),carb:num(n.carbohydrates_100g),fat:num(n.fat_100g),sug:num(n.sugars_100g),sat:num(n["saturated-fat_100g"]),fib:num(n.fiber_100g),salt:num(n.salt_100g),serving:num(p.serving_quantity)||0,src:"off",
    missing:(k==null||n.proteins_100g==null||n.carbohydrates_100g==null||n.fat_100g==null)};
}
function openItem(f){var X=xOf(f);ui.item={food:{name:f.name,brand:f.brand||"",barcode:f.barcode||"",kcal:num(f.kcal),prot:num(f.prot),carb:num(f.carb),fat:num(f.fat),sug:X.sug,sat:X.sat,fib:X.fib,salt:X.salt,src:f.src||"mine",id:f.id},qty:String(f.serving||100),meal:guessMeal(),fix:!!f.missing,warn:f.missing?"Certaines valeurs manquent dans la base pour ce produit. Complète-les avec l'étiquette avant d'ajouter.":""};ui.nview="item";ui.msg="";render();}
function lookup(code){
  code=String(code||"").replace(/\D/g,"");
  if(code.length<8){ui.msg="Ce code-barres n'est pas valide.";render();if(ui.nview==="scan")startScan();return;}
  for(var i=0;i<D.foods.length;i++)if(D.foods[i].barcode===code){var m=D.foods[i];return openItem({name:m.name,brand:m.brand,barcode:m.barcode,kcal:m.kcal,prot:m.prot,carb:m.carb,fat:m.fat,extra:m.extra,src:"mine",id:m.id});}
  var el=document.getElementById("scanmsg");if(el)el.textContent="Recherche du produit "+code+"…";
  fetch("https://world.openfoodfacts.org/api/v2/product/"+code+".json?fields=code,product_name,product_name_fr,brands,nutriments,serving_quantity")
  .then(function(r){return r.json();}).then(function(j){
    if(!j||j.status!==1||!j.product){ui.create={barcode:code};ui.msg="Produit introuvable dans la base. Crée-le avec les valeurs de l'étiquette.";ui.nview="create";render();return;}
    var f=offFood(j.product);f.barcode=code;openItem(f);
  }).catch(function(){ui.msg="Recherche impossible pour l'instant. Vérifie ta connexion ou tape le code.";ui.nview="scan";render();startScan();});
}
function searchOff(q){
  ui.q=q;ui.results=null;ui.msg="Recherche en cours…";render(true);
  var direct=function(){return fetch("https://world.openfoodfacts.org/cgi/search.pl?search_terms="+encodeURIComponent(q)+"&search_simple=1&action=process&json=1&page_size=24&cc=fr&lc=fr&fields=code,product_name,product_name_fr,brands,nutriments,serving_quantity").then(function(r){if(!r.ok)throw new Error("off");return r.json();});};
  fetch(SB_URL+"/functions/v1/food-search?q="+encodeURIComponent(q),{headers:{apikey:SB_ANON,Authorization:"Bearer "+SB_ANON}})
  .then(function(r){if(!r.ok)throw new Error("fn");return r.json();}).catch(direct).then(function(j){
    if(ui.q!==q)return;
    ui.results=(j.products||[]).map(offFood).filter(function(f){return f.name!=="Produit sans nom"&&f.kcal>0;});ui.msg="";if(ui.nview==="search")render(true);
  }).catch(function(){if(ui.q!==q)return;ui.results=null;ui.msg="La base Open Food Facts ne répond pas pour l'instant. Réessaie, scanne le produit ou crée l'aliment.";if(ui.nview==="search")render(true);});
}

/* ----- progrès ----- */
function fr(n){return String(Math.round(n*10)/10).replace(".",",");}
function bestSet(x,L){var d=L&&L.data&&L.data.ex&&L.data.ex[x.id];if(!d||!d.s)return null;var b=null;d.s.forEach(function(s){if(!s)return;
  if(x.t==="dist"){if(s.m&&(!b||num(s.m)>num(b.m)))b=s;}
  else if(s.kg||s.r){var a=num(s.kg),c=b?num(b.kg):-1;if(a>c||(a===c&&num(s.r)>num(b.r)))b=s;}});
  if(!b)return null;if(x.t==="dist")return {v:num(b.m),r:0,txt:esc(b.m)+" m"};var kg=b.kg||"PDC";return {v:num(b.kg),r:num(b.r),txt:esc(kg)+(/[a-z]/i.test(kg)?"":" kg")+" × "+esc(b.r||"–")};}
function trend(a,p,x){
  if(!a||!p)return "";
  var d=a.v-p.v,u=x.t==="dist"?" m":" kg";
  if(d===0){d=a.r-p.r;u=x.t==="iso"?" s":" rep";}
  if(d===0)return ' <span class="eq" title="Identique">=</span>';
  return ' <span class="'+(d>0?"up":"down")+'">'+(d>0?"▲ +":"▼ −")+fr(Math.abs(d))+u+'</span>';
}
function progTables(C,getLog,openFirst){
  var nw=C.nweeks||3,h="",any=false,first=openFirst;
  (C.sessions||[]).forEach(function(s){
    var rows="";
    s.blocks.forEach(function(b){b.items.forEach(function(x){if(x.t==="done"||x.t==="box")return;var c=[],w;for(w=1;w<=nw;w++)c.push(bestSet(x,getLog(w,s.id)));
      var cells=c.map(function(v,i){if(!v)return '<td>–</td>';any=true;var p=null;for(var k=i-1;k>=0;k--)if(c[k]){p=c[k];break;}return '<td>'+v.txt+trend(v,p,x)+'</td>';}).join("");
      rows+='<tr><td>'+(x.code?esc(x.code)+' · ':'')+esc(x.name)+'</td>'+cells+'</tr>';});});
    var th="";for(var w=1;w<=nw;w++)th+='<th>S'+w+'</th>';
    h+='<details'+(first?' open':'')+'><summary>'+esc(s.day)+' · '+esc(s.title)+'</summary><div class="body"><div class="tbl num"><table><tr><th>Exercice</th>'+th+'</tr>'+rows+'</table></div></div></details>';first=false;
  });
  return {html:h,any:any};
}
var BF=[["kg","Poids","kg"],["taille","Taille","cm"],["hanches","Hanches","cm"],["poitrine","Poitrine","cm"],["bras","Bras","cm"],["cuisse","Cuisse","cm"]];
function bodySeries(body,logs){
  var m={},k;for(k in (body||{})){m[k]={};for(var f in body[k])m[k][f]=body[k][f];m[k]._own=true;}
  Object.keys(logs||{}).forEach(function(key){var L=logs[key],e=L&&L.data&&L.data.end;if(!e||!e.kg||!(L.done_at||L.updated_at))return;var d=iso(new Date(L.done_at||L.updated_at));if(!m[d])m[d]={};if(!m[d].kg)m[d].kg=e.kg;});
  return Object.keys(m).sort().map(function(d){return {day:d,data:m[d]};});
}
function goalClass(d,goal){if(!d||goal==="maintenir")return "eq";return ((goal==="prendre")===(d>0))?"up":"down";}
function weightChart(pts){
  if(pts.length<2)return "";
  var W=320,H=120,pl=34,pr=8,pt=10,pb=22,vs=pts.map(function(p){return p.v;}),mn=Math.min.apply(null,vs),mx=Math.max.apply(null,vs);if(mx-mn<1){mn-=0.5;mx+=0.5;}
  var t0=fromIso(pts[0].day).getTime(),t1=fromIso(pts[pts.length-1].day).getTime()||t0+1,X=function(p){return pl+(W-pl-pr)*(t1===t0?0.5:(fromIso(p.day).getTime()-t0)/(t1-t0));},Y=function(p){return pt+(H-pt-pb)*(1-(p.v-mn)/(mx-mn));};
  var line=pts.map(function(p){return r1(X(p))+","+r1(Y(p));}).join(" ");
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="Courbe du poids, de '+fr(pts[0].v)+' à '+fr(pts[pts.length-1].v)+' kg" style="display:block;max-width:100%"><line x1="'+pl+'" y1="'+pt+'" x2="'+(W-pr)+'" y2="'+pt+'" stroke="var(--line)" stroke-width="1"/><line x1="'+pl+'" y1="'+(H-pb)+'" x2="'+(W-pr)+'" y2="'+(H-pb)+'" stroke="var(--line)" stroke-width="1"/><text x="'+(pl-6)+'" y="'+(pt+4)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+fr(mx)+'</text><text x="'+(pl-6)+'" y="'+(H-pb+4)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+fr(mn)+'</text><polyline points="'+line+'" fill="none" stroke="var(--accent-text)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'+pts.map(function(p,i){return '<circle cx="'+r1(X(p))+'" cy="'+r1(Y(p))+'" r="'+(i===pts.length-1?4.5:3)+'" fill="var(--accent-text)"/>';}).join("")+'<text x="'+pl+'" y="'+(H-6)+'" font-size="10" fill="var(--muted)">'+esc(frDate(pts[0].day,{day:"numeric",month:"short"}))+'</text><text x="'+(W-pr)+'" y="'+(H-6)+'" text-anchor="end" font-size="10" fill="var(--muted)">'+esc(frDate(pts[pts.length-1].day,{day:"numeric",month:"short"}))+'</text></svg>';
}
function bodyHtml(series,goal,canDelete){
  if(!series.length)return '<p class="note">Aucune mesure pour l\'instant.</p>';
  var h="",wp=series.filter(function(s){return num(s.data.kg)>0;}).map(function(s){return {day:s.day,v:num(s.data.kg)};});
  if(wp.length){var a=wp[0],b=wp[wp.length-1],d=b.v-a.v;
    h+='<div class="card"><div class="row" style="align-items:flex-end"><div class="grow"><span class="eyebrow muted">Poids actuel</span><span class="kcal">'+fr(b.v)+' <span class="small muted">kg</span></span></div>'+(wp.length>1?'<span class="small '+goalClass(d,goal)+'" style="font-weight:700;text-align:right">'+(d===0?"Stable":(d>0?"▲ +":"▼ −")+fr(Math.abs(d))+" kg")+'<br><span class="muted" style="font-weight:500">depuis le '+esc(frDate(a.day,{day:"numeric",month:"short"}))+'</span></span>':'')+'</div>'+(function(){var t=new Date(),s=0,n=0;wp.forEach(function(p){var dd=(t-fromIso(p.day))/86400000;if(dd<7&&dd>=-1){s+=p.v;n++;}});return n>1?'<p class="small"><b>Moyenne sur 7 jours : '+fr(s/n)+' kg</b> <span class="muted">('+n+' pesées)</span></p>':"";})()+weightChart(wp)+(wp.length<2?'<p class="muted small">La courbe apparaît à partir de 2 pesées.</p>':'')+'</div>';}
  var cols=BF.filter(function(f){return series.some(function(s){return num(s.data[f[0]])>0;});});
  h+='<div class="card"><span class="eyebrow muted">Historique</span><div class="tbl num"><table class="bodytbl"><tr><th>Date</th>'+cols.map(function(f){return '<th>'+f[1]+'</th>';}).join("")+(canDelete?'<th></th>':'')+'</tr>';
  var prev={};var rows=series.map(function(s){var r='<td>'+esc(frDate(s.day,{day:"numeric",month:"short"}))+'</td>';
    cols.forEach(function(f){var v=num(s.data[f[0]]);if(!(v>0)){r+='<td>–</td>';return;}var p=prev[f[0]],t="";if(p!=null&&v!==p){var dd=v-p;t=' <span class="'+(f[0]==="kg"?goalClass(dd,goal):"eq")+'">'+(dd>0?"▲ +":"▼ −")+fr(Math.abs(dd))+'</span>';}prev[f[0]]=v;r+='<td>'+fr(v)+' '+f[2]+t+'</td>';});
    if(canDelete)r+='<td>'+(s.data._own?'<button class="btn ghost sm" type="button" data-act="delbody" data-d="'+s.day+'" style="min-height:36px;min-width:36px;padding:0" aria-label="Retirer la mesure du '+esc(frDate(s.day))+'">×</button>':'')+'</td>';
    return '<tr>'+r+'</tr>';});
  return h+rows.reverse().join("")+'</table></div></div>';
}
function vSuivi(){
  var C=cyc(),h='<div><h1 style="font-size:24px">Progrès</h1><p class="muted small">Tes charges, ton poids et tes mensurations</p></div>';
  h+='<section class="sec"><h3>Poids et mensurations</h3>'+bodyHtml(bodySeries(D.body,D.logs),D.client.weight_goal||"perdre",true);
  h+='<form class="card" id="bodyform"><span class="eyebrow muted">Mensurations de la semaine</span><p class="small">'+(function(){var l=lastMeasure();return l?"Dernières mensurations : "+esc(frDate(l))+(daysSince(l)>=7?". C'est le moment de les reprendre.":". Prochaines dans "+(7-daysSince(l))+" jour"+(7-daysSince(l)>1?"s":"")+"."):"Une fois par semaine, le matin, en même temps que ta pesée.";})()+'</p><div class="field"><label for="b-day">Date</label><input type="date" id="b-day" value="'+iso(new Date())+'" max="'+iso(new Date())+'" style="width:100%;min-height:44px;border:1px solid var(--line2);border-radius:8px;background:var(--field);color:var(--fg);padding:8px 10px;font-size:16px;font-weight:700"></div><div class="two">'+BF.map(function(f){return '<div class="field"><label for="b-'+f[0]+'">'+(f[0]==="taille"?"Tour de taille":f[1])+' ('+f[2]+')</label><input type="text" inputmode="decimal" id="b-'+f[0]+'"'+(f[0]==="kg"&&num((D.body[iso(new Date())]||{}).kg)>0?' value="'+esc(fr(num(D.body[iso(new Date())].kg)))+'"':'')+'></div>';}).join("")+'</div><p class="muted small">Une fois par semaine. Remplis seulement ce que tu as mesuré. Ton poids, lui, se note chaque matin dans Nutrition.</p><button class="btn acc full" type="submit">Enregistrer</button><p class="msg bad" id="b-msg" role="status"></p></form></section>';
  var P=progTables(C,function(w,sid){return peek(w,sid);},true);
  h+='<section class="sec"><h3>Charges · '+esc(C.name)+'</h3><p class="muted small">Meilleure série de chaque semaine. <span class="up">▲ progrès</span> · <span class="down">▼ baisse</span> par rapport à la semaine d\'avant.</p>'+P.html+(P.any?"":'<p class="note">Tes charges apparaîtront ici dès ta première séance notée.</p>')+'</section>';
  return h;
}

/* ----- rendu & événements client ----- */
function render(keep){
  if(MODE!=="client")return;
  if(!(ui.tab==="nutri"&&ui.nview==="scan"))stopScan();
  var h,y=window.scrollY;
  if(ui.tab==="home")h=vAccueil();
  else if(ui.tab==="nutri")h=vNutri();
  else if(ui.tab==="msg")h=vMsg();
  else if(ui.tab==="suivi")h=vSuivi();
  else if(ui.view==="session")h=vSession();
  else if(ui.view==="end")h=vEnd();
  else if(ui.view==="guide")h=vGuide();
  else h=vHome();
  $main.innerHTML=h;

  $tabs.querySelectorAll("button").forEach(function(b){if(b.dataset.tab===ui.tab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  updateBadge();
  if(ui.tab==="prog"&&ui.view==="session"&&ui.sid&&(!weekOpen(ui.week)||(D.logs[lk(ui.week,ui.sid)]&&D.logs[lk(ui.week,ui.sid)].data&&D.logs[lk(ui.week,ui.sid)].data.skipped)))$main.querySelectorAll("input,textarea,[data-act=done],[data-act=rest]").forEach(function(el){el.disabled=true;});
  if(ui.tab==="msg"){markRead();if(!keep){window.scrollTo(0,document.body.scrollHeight);return;}}
  window.scrollTo(0,keep?y:0);
}
function clientClick(b){
  var a=b.dataset.act,L,E,i,f,it;
  if(a==="rest"){startRest(+b.dataset.s);return;}
  if(a==="pushon"){b.disabled=true;PUSH.msg="";subscribePush().then(function(sub){var p=prefs();p.on=true;return savePrefs(sub,p);}).then(function(){PUSH.on=true;PUSH.msg="";render(true);}).catch(function(er){PUSH.msg=er&&er.message==="denied"?"Tu as refusé l'autorisation. Tu peux la redonner dans les réglages de ton téléphone.":"Activation impossible sur cet appareil. Réessaie plus tard.";render(true);});return;}
  if(a==="pushoff"){b.disabled=true;unsubscribePush().then(function(ep){return ep?savePrefs({remove:ep},null):null;}).catch(function(){}).then(function(){PUSH.on=false;PUSH.msg="Notifications désactivées sur cet appareil.";render(true);});return;}
  if(a==="wedit"){ui.wEdit=true;render(true);return;}
  if(a==="gomsg"){ui.tab="msg";render();return;}
  if(a==="gomes"){ui.tab="suivi";render();var bf=document.getElementById("bodyform");if(bf)bf.scrollIntoView({block:"start"});return;}
  if(a==="gonutri"){ui.tab="nutri";ui.ntab="journal";ui.nview="journal";ui.date=iso(new Date());render();return;}
  if(a==="gonotif"){var ne=document.getElementById("notif");if(ne)ne.scrollIntoView({block:"start"});return;}
  if(a==="open"){if(b.dataset.w)ui.week=+b.dataset.w;ui.tab="prog";ui.sid=b.dataset.sid;ui.xi=-1;ui.view="session";render();}
  else if(a==="xnav"){ui.xi=+b.dataset.i;render();}
  else if(a==="home"){ui.view="home";render();}
  else if(a==="guide"){ui.view="guide";render();}
  else if(a==="end"){if(!weekOpen(ui.week))return;ui.view="end";render();}
  else if(a==="skip"){var kk=lk(ui.week,ui.sid);if(ui.skipAsk!==kk){ui.skipAsk=kk;render(true);return;}ui.skipAsk=null;L=cur();evt["L|"+kk]="session_skipped";L.done=true;L.data.skipped=true;if(!L.done_at)L.done_at=new Date().toISOString();touchLog();ui.view="home";render();}
  else if(a==="unskip"){L=cur();L.done=false;delete L.data.skipped;L.done_at=null;touchLog();render(true);}
  else if(a==="week"){ui.week=+b.dataset.w;persist();render(true);}
  else if(a==="cycle"){ui.cycle=+b.dataset.n;ui.week=1;persist();render();}
  else if(a==="done"){L=cur();(L.data.ex[b.dataset.ex]||(L.data.ex[b.dataset.ex]={})).done=b.dataset.v;touchLog();updProg();b.parentNode.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b));});}
  else if(a==="finish"){if(!weekOpen(ui.week))return;L=cur();if(!L.done||L.data.skipped)evt["L|"+lk(ui.week,ui.sid)]="session_done";delete L.data.skipped;L.done=true;if(!L.done_at)L.done_at=new Date().toISOString();touchLog();render(true);window.scrollTo(0,document.body.scrollHeight);}
  else if(a==="logout"){store.del("ya-token");TOKEN=null;D=null;history.replaceState(null,"",location.pathname);showLogin();}
  else if(a==="ntab"){ui.ntab=b.dataset.v;render();}
  else if(a==="day"){var d=fromIso(ui.date);d.setDate(d.getDate()+(+b.dataset.d));if(iso(d)>iso(new Date()))return;ui.date=iso(d);render(true);}
  else if(a==="nv"){ui.nview=b.dataset.v;ui.msg="";if(ui.nview==="search"){ui.results=null;}if(ui.nview==="create"){ui.create={name:ui.q||""};}if(ui.nview==="planadd")ui.pday=null;render();if(ui.nview==="scan")startScan();}
  else if(a==="codego"){lookup(document.getElementById("code").value);}
  else if(a==="pick"){i=+b.dataset.i;if(b.dataset.k==="mine"){f=D.foods[i];openItem({name:f.name,brand:f.brand,barcode:f.barcode,kcal:f.kcal,prot:f.prot,carb:f.carb,fat:f.fat,extra:f.extra,src:"mine",id:f.id});}else openItem(ui.results[i]);}
  else if(a==="additem"){it=ui.item;var q=num(document.getElementById("it-qty").value);if(!(q>0)){document.getElementById("it-prev").textContent="Indique la quantité mangée.";return;}
    f=it.food;addEntry({meal:document.getElementById("it-meal").value,name:f.name,brand:f.brand,barcode:f.barcode,qty:q,k:r1(f.kcal*q/100),p:r1(f.prot*q/100),g:r1(f.carb*q/100),l:r1(f.fat*q/100),x:{sug:r1(f.sug*q/100),sat:r1(f.sat*q/100),fib:r1(f.fib*q/100),salt:Math.round(f.salt*q)/100}});ui.nview="journal";ui.item=null;render();}
  else if(a==="savemine"){it=ui.item;f=it.food;b.disabled=true;
    var ex={sug:f.sug,sat:f.sat,fib:f.fib,salt:f.salt};rpc("client_save_custom_food",{p_token:TOKEN,p_food:{name:f.name,brand:f.brand,barcode:f.barcode,kcal:f.kcal,prot:f.prot,carb:f.carb,fat:f.fat,extra:ex}}).then(function(id){D.foods.push({id:id,name:f.name,brand:f.brand,barcode:f.barcode,kcal:f.kcal,prot:f.prot,carb:f.carb,fat:f.fat,extra:ex});f.src="mine";f.id=id;persist();var m=document.getElementById("it-msg");if(m){m.textContent="Enregistré dans Mes aliments.";m.className="msg ok";}})
    .catch(function(){b.disabled=false;var m=document.getElementById("it-msg");if(m){m.textContent="Enregistrement impossible. Réessaie.";m.className="msg bad";}});}
  else if(a==="delmine"){it=ui.item;f=it.food;b.disabled=true;
    rpc("client_delete_custom_food",{p_token:TOKEN,p_id:f.id}).then(function(){D.foods=D.foods.filter(function(x){return x.id!==f.id;});persist();ui.nview="search";render();}).catch(function(){b.disabled=false;});}
  else if(a==="addplan"){var k=ui.pday||DKEYS[fromIso(ui.date).getDay()],m=D.nutrition.days[k].meals[+b.dataset.i],fac=num(document.getElementById("pf-"+b.dataset.i).value)||1,slot=m.slot.split(" · ")[0];
    addEntry({meal:MEALS.indexOf(slot)>=0?slot:guessMeal(),name:m.name+(fac!==1?" (×"+fac+")":""),brand:"Plan",qty:0,k:r1(m.k*fac),p:r1(m.p*fac),g:r1(m.g*fac),l:r1(m.l*fac)});ui.nview="journal";render();}
  else if(a==="delbody"){delete D.body[b.dataset.d];dirty["B|"+b.dataset.d]=1;schedule();render(true);}
  else if(a==="delentry"){E=D.food[ui.date]||[];D.food[ui.date]=E.filter(function(x){return x.id!==b.dataset.id;});touchFood();render(true);}
}
function clientInput(t){
  var d=t.dataset,L,x,it;
  if((d.b==="set"||d.b==="exf"||d.b==="end")&&!weekOpen(ui.week))return;
  if(d.b==="set"){L=cur();x=L.data.ex[d.ex]||(L.data.ex[d.ex]={});if(!x.s)x.s=[];if(!x.s[d.i])x.s[d.i]={};x.s[d.i][d.f]=t.value;touchLog();t.classList.toggle("filled",!!t.value);updProg();}
  else if(d.b==="exf"){L=cur();(L.data.ex[d.ex]||(L.data.ex[d.ex]={}))[d.f]=t.value;touchLog();updProg();}
  else if(d.b==="end"){cur().data.end[d.f]=t.value;touchLog();if(t.type==="range"){var o=document.getElementById("o-"+d.f);if(o)o.textContent=t.value;}}
  else if(d.b==="itqty"||d.b==="itf"){it=ui.item;if(!it)return;if(d.b==="itqty")it.qty=t.value;else it.food[d.f]=num(t.value);var q=num(it.qty),f=it.food,p=document.getElementById("it-prev");if(p)p.textContent=r0(f.kcal*q/100)+" kcal · P "+r1(f.prot*q/100)+" · G "+r1(f.carb*q/100)+" · L "+r1(f.fat*q/100);var p2=document.getElementById("it-prev2");if(p2)p2.textContent=xLine(f,q/100);}
}

/* =====================================================================
   CONNEXION
   ===================================================================== */
var MODE="login";
function showLogin(msg,prefill){
  MODE="login";$bottom.hidden=true;setStatus("");document.body.classList.remove("coach");
  $main.innerHTML='<div class="center"><div><h1 style="font-size:26px">Ton espace coaching</h1><p class="muted small">Entre le code d\'accès que Yanis t\'a envoyé, ou ouvre ton lien personnel.</p></div><form class="card" id="loginform"><div class="field"><label for="tok">Code d\'accès</label><input type="text" id="tok" autocomplete="off" autocapitalize="none" spellcheck="false" value="'+esc(prefill||"")+'"></div><button class="btn acc full" type="submit">Entrer</button><p class="msg bad" role="status">'+esc(msg||"")+'</p></form><p class="muted small">Pas de code ? Contacte Yanis : <span class="sel">'+COACH_TEL+'</span></p><button class="btn ghost sm" type="button" data-act="gocoach">Espace coach</button></div>';
}

/* =====================================================================
   ESPACE COACH
   ===================================================================== */
var sb=null,K={view:"dash",home:"dash",feed:[],prog:{},clients:[],last:{},cur:null,tab:"seances",msg:""};
function sbc(){if(!sb)sb=window.supabase.createClient(SB_URL,SB_KEY);return sb;}
function coachLoginView(msg,ok){
  MODE="coach";$bottom.hidden=true;setStatus("");document.body.classList.remove("coach");
  $main.innerHTML='<div class="center"><div><h1 style="font-size:26px">Espace coach</h1><p class="muted small">Réservé à Yanis.</p></div><form class="card" id="coachform"><div class="field"><label for="c-email">E-mail</label><input type="email" id="c-email" autocomplete="username"></div><div class="field"><label for="c-pass">Mot de passe</label><input type="password" id="c-pass" autocomplete="current-password"></div><button class="btn acc full" type="submit" data-mode="in">Se connecter</button><button class="btn ghost full sm" type="button" data-act="cforgot">Mot de passe oublié</button><p class="msg '+(ok?"ok":"bad")+'" id="c-msg" role="status">'+esc(msg||"")+'</p></form><button class="btn ghost sm" type="button" data-act="goclient">Espace client</button></div>';
}
function newPassView(msg){
  MODE="coach";$bottom.hidden=true;document.body.classList.remove("coach");
  $main.innerHTML='<div class="center"><div><h1 style="font-size:26px">Nouveau mot de passe</h1><p class="muted small">Choisis ton nouveau mot de passe pour l\'espace coach.</p></div><form class="card" id="newpassform"><div class="field"><label for="np-1">Nouveau mot de passe (8 caractères minimum)</label><input type="password" id="np-1" autocomplete="new-password"></div><div class="field"><label for="np-2">Le même, une deuxième fois</label><input type="password" id="np-2" autocomplete="new-password"></div><button class="btn acc full" type="submit">Enregistrer</button><p class="msg bad" id="np-msg" role="status">'+esc(msg||"")+'</p></form></div>';
}
function bootCoach(){
  MODE="coach";$bottom.hidden=true;
  sbc().auth.getSession().then(function(r){var ok=r.data&&r.data.session;if(ok&&K.recover)newPassView();else if(ok)coachList();else coachLoginView(K.recover?"Ce lien n'est plus valable. Redemande un e-mail avec « Mot de passe oublié ».":"");}).catch(function(){coachLoginView();});
}
function coachList(){
  K.view=K.home;$main.innerHTML='<div class="center"><p class="muted">Chargement…</p></div>';
  Promise.all([sbc().from("clients").select("*").order("name"),sbc().from("session_logs").select("client_id,cycle,week,session_id,updated_at,done,done_at,skipped:data->skipped").order("updated_at",{ascending:false}).limit(500),sbc().from("coaches").select("email"),sbc().from("messages").select("client_id").eq("sender","client").is("read_at",null),sbc().from("messages").select("client_id,body,created_at").eq("sender","client").order("created_at",{ascending:false}).limit(30),sbc().from("client_content").select("client_id,program"),sbc().from("body_logs").select("client_id,day,data,updated_at").order("updated_at",{ascending:false}).limit(30)]).then(function(r){
    if(r[0].error)throw r[0].error;
    if(!r[2].data||!r[2].data.length){$main.innerHTML='<div class="center"><div class="card"><span class="title">Compte non autorisé</span><p class="muted small">Ce compte n\'a pas accès à l\'espace coach.</p><button class="btn ghost full" type="button" data-act="clogout">Se déconnecter</button></div></div>';return;}
    getSub().then(function(s){var was=PUSH.on;PUSH.on=!!s;if(MODE==="coach"&&K.view==="settings"&&was!==PUSH.on)renderCoach(true);});
    K.clients=r[0].data||[];K.unread={};((r[3]&&r[3].data)||[]).forEach(function(x){K.unread[x.client_id]=(K.unread[x.client_id]||0)+1;});K.last={};(r[1].data||[]).forEach(function(l){if(!K.last[l.client_id])K.last[l.client_id]=l.updated_at;});
    document.body.classList.add("coach");K.logs=r[1].data||[];K.prog={};((r[5]&&r[5].data)||[]).forEach(function(x){K.prog[x.client_id]=x.program||{};});
    var ix={},F=[];K.clients.forEach(function(c,i){ix[c.id]=i;});
    K.logs.forEach(function(l){if(!l.done||ix[l.client_id]==null)return;F.push({t:l.done_at||l.updated_at,i:ix[l.client_id],k:l.skipped?"bad":"ok",txt:(l.skipped?"n'a pas fait ":"a terminé ")+sessName(l.client_id,l)});});
    ((r[4]&&r[4].data)||[]).forEach(function(m){if(ix[m.client_id]==null)return;F.push({t:m.created_at,i:ix[m.client_id],k:"msg",txt:"t'a écrit : « "+String(m.body||"").slice(0,80)+(String(m.body||"").length>80?"…":"")+" »"});});
    ((r[6]&&r[6].data)||[]).forEach(function(b){if(ix[b.client_id]==null||!b.data)return;var kg=num(b.data.kg),ms=["taille","hanches","poitrine","bras","cuisse"].some(function(k){return num(b.data[k])>0;});if(!kg&&!ms)return;F.push({t:b.updated_at||b.day,i:ix[b.client_id],k:"body",txt:kg?"a noté son poids : "+fr(kg)+" kg"+(ms?" et ses mensurations":""):"a noté ses mensurations"});});
    F.sort(function(a,b){return a.t<b.t?1:-1;});K.feed=F.slice(0,14);
    renderCoach();
  }).catch(function(e){$main.innerHTML='<div class="center"><p class="msg bad">Chargement impossible : '+esc(e.message||e)+'</p><button class="btn ghost" type="button" data-act="clist">Réessayer</button></div>';});
}
function linkFor(c){return location.origin+location.pathname+"#c="+c.token;}
function ago(ts){var d=new Date(ts),m=(Date.now()-d.getTime())/60000;if(!(m>=0))m=0;if(m<1)return "à l'instant";if(m<60)return "il y a "+Math.round(m)+" min";if(iso(d)===iso(new Date()))return "il y a "+Math.round(m/60)+" h";var y=new Date();y.setDate(y.getDate()-1);if(iso(d)===iso(y))return "hier";return "le "+d.toLocaleDateString("fr-FR",{day:"numeric",month:"short"});}
function sessName(cid,l){var P=K.prog[cid],c=P&&(P.cycles||[]).filter(function(x){return x.n===l.cycle;})[0],s=c&&(c.sessions||[]).filter(function(x){return x.id===l.session_id;})[0];return (s?s.day+" · "+s.title:"une séance")+" (cycle "+l.cycle+", semaine "+l.week+")";}
function stale(c){var la=K.last[c.id];return !!c.active&&(!la||(Date.now()-new Date(la).getTime())>7*86400000);}
function clientRow(c,i){var la=K.last[c.id],u=(K.unread||{})[c.id]||0;
  return '<button class="navrow" type="button" data-act="cclient" data-i="'+i+'"><span class="avatar" aria-hidden="true">'+esc(String(c.name||"?").charAt(0).toUpperCase())+'</span><span class="grow" style="gap:6px"><span class="title">'+esc(c.name)+'</span><span class="chips"><span class="pill">'+esc(c.offer||"Sans offre")+'</span><span class="pill">Cycle '+c.unlocked+'</span>'+(u?'<span class="pill acc">'+u+' message'+(u>1?"s":"")+'</span>':'')+(!c.active?'<span class="pill">Désactivé</span>':stale(c)?'<span class="pill warn">À relancer</span>':'')+'</span><span class="muted small">'+(la?"Dernière saisie "+ago(la):"Aucune saisie")+'</span></span>'+CHEV+'</button>';}
function coachDash(){
  var dl=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"}),wk=Date.now()-7*86400000;dl=dl.charAt(0).toUpperCase()+dl.slice(1);
  var act=K.clients.filter(function(c){return c.active;}).length,done=(K.logs||[]).filter(function(l){return l.done&&!l.skipped&&new Date(l.done_at||l.updated_at).getTime()>wk;}).length,un=0,st=K.clients.filter(stale).length;Object.keys(K.unread||{}).forEach(function(k){un+=K.unread[k];});
  var h='<div><span class="muted small">'+esc(dl)+'</span><h1 style="font-size:24px">Tableau de bord</h1></div>';
  h+='<div class="kpis"><div class="tile"><span class="eyebrow muted">Clients actifs</span><b>'+act+'</b><span class="muted small">sur '+K.clients.length+'</span></div><div class="tile"><span class="eyebrow muted">Séances faites</span><b>'+done+'</b><span class="muted small">7 derniers jours</span></div><div class="tile"><span class="eyebrow muted">Messages à lire</span><b>'+un+'</b><span class="muted small">'+(un?"non lus":"tout est lu")+'</span></div><div class="tile"><span class="eyebrow muted">À relancer</span><b>'+st+'</b><span class="muted small">sans saisie depuis 7 jours</span></div></div>';
  h+='<div class="cgrid"><section class="sec"><h3>Activité récente</h3>';
  if(!K.feed.length)h+='<p class="note">Rien pour l\'instant. Les séances, pesées et messages de tes clients apparaîtront ici.</p>';
  else{h+='<div class="card feed">';K.feed.forEach(function(f){var c=K.clients[f.i];h+='<button class="frow" type="button" data-act="cclient" data-i="'+f.i+'"><span class="avatar" aria-hidden="true">'+esc(String(c.name||"?").charAt(0).toUpperCase())+'</span><span class="grow"><span><b>'+esc(c.name)+'</b> <span class="'+(f.k==="bad"?"down":"")+'" style="font-weight:500;white-space:normal;overflow-wrap:anywhere">'+esc(f.txt)+'</span></span><span class="muted small">'+esc(ago(f.t))+'</span></span></button>';});h+='</div>';}
  h+='</section><section class="sec"><h3>Mes clients</h3>';
  K.clients.forEach(function(c,i){h+=clientRow(c,i);});
  if(!K.clients.length)h+='<p class="note">Aucun client pour l\'instant.</p>';
  h+='<button class="btn ghost sm" type="button" data-act="cnav" data-v="list">Ajouter un client</button></section></div>';
  return h;
}
function renderCoach(keep){
  var y=window.scrollY,h="",nv=K.view==="dash"||K.view==="settings"?K.view:"list";
  document.querySelectorAll("#side [data-v]").forEach(function(b){if(b.dataset.v===nv)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
  if(K.view==="dash"){h=coachDash();}
  else if(K.view==="settings"){h='<div class="narrow" style="display:flex;flex-direction:column;gap:18px"><div><h1 style="font-size:24px">Réglages</h1><p class="muted small">Sur cet appareil</p></div>'+coachNotifCard()+'<p class="muted small">Le mode nuit ou jour se change avec le bouton en haut à droite.</p><button class="btn ghost sm" type="button" data-act="clogout">Déconnexion</button></div>';}
  else if(K.view==="list"){
    h='<div class="row"><div class="grow"><h1 style="font-size:24px">Mes clients</h1><p class="muted small">'+K.clients.length+' client'+(K.clients.length>1?"s":"")+'</p></div></div>';
    K.clients.forEach(function(c,i){h+=clientRow(c,i);});
    if(!K.clients.length)h+='<p class="note">Aucun client pour l\'instant. Ajoute ton premier client ci-dessous.</p>';
    h+='<form class="card narrow" id="addclient"><span class="eyebrow muted">Ajouter un client</span><div class="field"><label for="n-name">Prénom</label><input type="text" id="n-name"></div><div class="two"><div class="field"><label for="n-offer">Offre</label><select id="n-offer"><option>Programme seul</option><option>Suivi en ligne</option><option>Hybride</option><option>Présentiel</option></select></div><div class="field"><label for="n-pay">Paiement</label><select id="n-pay"><option value="echelonne">Échelonné / mensuel</option><option value="une_fois">En une fois</option></select></div></div><button class="btn acc full" type="submit">Ajouter</button><p class="msg bad" id="n-msg" role="status"></p><p class="muted small">Le programme et le plan nutrition d\'un nouveau client sont ajoutés par Claude à partir de tes PDF.</p></form>';
  }else if(K.view==="client"){
    var c=K.cur.client;
    h=backHead("clist","Retour à mes clients",c.name,(c.offer||"")+" · cycle "+c.unlocked+" débloqué");
    h+='<div class="seg" role="group" aria-label="Vue">'+[["seances","Séances"],["progres","Progrès"],["nutri","Nutrition"],["msg","Messages"+(K.cur.msgs.filter(function(m){return m.sender==="client"&&!m.read_at;}).length?" ●":"")],["acces","Accès"]].map(function(t){return '<button type="button" data-act="ctab" data-v="'+t[0]+'" aria-pressed="'+(K.tab===t[0])+'">'+t[1]+'</button>';}).join("")+'</div>';
    if(K.tab==="seances")h+=coachSeances();else if(K.tab==="progres")h+=coachProgres();else if(K.tab==="msg")h+=coachMsg();else if(K.tab==="nutri")h+=coachNutri();else h+=coachAcces();
  }else if(K.view==="log"){h=coachLog();}
  else if(K.view==="day"){h=coachDay();}
  $main.innerHTML=h;window.scrollTo(0,keep?y:0);
}
function openClient(i){
  var c=K.clients[i];$main.innerHTML='<div class="center"><p class="muted">Chargement…</p></div>';
  var since=new Date();since.setDate(since.getDate()-45);
  Promise.all([sbc().from("client_content").select("*").eq("client_id",c.id).maybeSingle(),sbc().from("session_logs").select("*").eq("client_id",c.id),sbc().from("food_logs").select("*").eq("client_id",c.id).gte("day",iso(since)).order("day",{ascending:false}),sbc().from("body_logs").select("day,data").eq("client_id",c.id),sbc().from("messages").select("*").eq("client_id",c.id).order("created_at")]).then(function(r){
    if(r[0].error||r[1].error||r[2].error||r[3].error||r[4].error)throw (r[0].error||r[1].error||r[2].error||r[3].error||r[4].error);var body={};(r[3].data||[]).forEach(function(b){body[b.day]=b.data;});
    var logs={};(r[1].data||[]).forEach(function(l){logs[l.cycle+"-"+l.week+"-"+l.session_id]=l;});
    K.cur={client:c,content:r[0].data||{program:{},nutrition:{}},logs:logs,food:r[2].data||[],body:body,msgs:r[4].data||[]};K.view="client";K.msg="";renderCoach();
  }).catch(function(e){$main.innerHTML='<div class="center"><p class="msg bad">Chargement impossible : '+esc(e.message||e)+'</p><button class="btn ghost" type="button" data-act="clist">Retour</button></div>';});
}
function endChips(e){e=e||{};var a=[];
  if(e.diff!=null&&e.diff!=="")a.push("Difficulté "+e.diff+"/10");if(e.nrj!=null&&e.nrj!=="")a.push("Énergie "+e.nrj+"/10");if(e.stress!=null&&e.stress!=="")a.push("Stress "+e.stress+"/10");
  if(e.sh)a.push("Sommeil "+e.sh+" h"+(e.sq!=null&&e.sq!==""?" ("+e.sq+"/10)":""));if(e.kg)a.push("Poids "+e.kg+" kg");if(e.pain)a.push("Douleur : "+e.pain);
  return a.length?'<div class="chips">'+a.map(function(x){return '<span class="pill">'+esc(x)+'</span>';}).join("")+'</div>':"";}
function coachSeances(){
  var P=K.cur.content.program||{},cs=(P.cycles||[]).filter(function(c){return c.sessions&&c.sessions.length;}),h="";
  if(!cs.length)return '<p class="note">Pas encore de programme pour ce client. Envoie son PDF à Claude pour l\'ajouter.</p>';
  cs.forEach(function(c){
    for(var w=1;w<=(c.nweeks||3);w++){
      var rows="",any=false;
      c.sessions.forEach(function(s){var L=K.cur.logs[c.n+"-"+w+"-"+s.id];if(L)any=true;
        rows+='<button class="navrow" type="button" data-act="clog" data-c="'+c.n+'" data-w="'+w+'" data-s="'+esc(s.id)+'"'+(L?"":" disabled")+' style="'+(L?"":"opacity:.55")+'"><span class="grow"><span class="title">'+esc(s.day)+' · '+esc(s.title)+'</span><span class="muted small">'+(L?(L.done&&L.data&&L.data.skipped?"Non faite, passée par le client le "+new Date(L.done_at||L.updated_at).toLocaleDateString("fr-FR"):L.done?"Terminée le "+new Date(L.done_at||L.updated_at).toLocaleDateString("fr-FR"):"En cours, modifiée le "+new Date(L.updated_at).toLocaleDateString("fr-FR")):"Pas encore faite")+'</span>'+(L?endChips(L.data&&L.data.end):"")+'</span>'+(L&&L.done&&!(L.data&&L.data.skipped)?CHK:(L?CHEV:""))+'</button>';});
      h+='<details'+(any?" open":"")+'><summary>'+esc(c.name)+' · semaine '+w+'</summary><div class="body">'+rows+'</div></details>';
    }
  });
  return h;
}
function coachLog(){
  var q=K.logSel,P=K.cur.content.program,c=(P.cycles||[]).filter(function(x){return x.n===q.c;})[0],s=c.sessions.filter(function(x){return x.id===q.s;})[0],L=K.cur.logs[q.c+"-"+q.w+"-"+q.s];
  var lines=bilanLines(c,s,L,q.w,L&&(L.done_at||L.updated_at)?new Date(L.done_at||L.updated_at).toLocaleDateString("fr-FR"):"");
  return backHead("cback","Retour au client",K.cur.client.name+" · "+s.day,c.name+" · semaine "+q.w)+endChips(L&&L.data&&L.data.end)+'<div class="card"><pre class="bilan">'+esc(lines.join("\n"))+'</pre></div>'+(function(){var ref=q.c+"-"+q.w+"-"+q.s,ms=K.cur.msgs.filter(function(m){return m.ref===ref;});return '<section class="sec"><h3>Ton commentaire sur cette séance</h3>'+(ms.length?msgList(ms,"coach",function(){return "";}).replace(/<span class="ref"><\/span>/g,""):"")+'<form class="card" id="clogform"><div class="field"><label for="cl-body">Commentaire</label><textarea id="cl-body" maxlength="2000"></textarea></div><button class="btn acc full" type="submit">Envoyer au client</button><p class="msg bad" role="status"></p><p class="muted small">Il le verra sur sa séance et dans ses messages.</p></form></section>';})();
}
function coachPush(ev){var cid=K.cur&&K.cur.client.id;if(!cid)return;sbc().auth.getSession().then(function(r){var t=r.data&&r.data.session&&r.data.session.access_token;if(t)pushCall({kind:"coach",client_id:cid,event:ev},t);});}
function coachNotifCard(){
  var h='<section class="sec"><h3>Mes notifications</h3>',intro=pushIntro();
  if(intro)return h+intro+'</section>';
  if(PUSH.on)h+='<div class="card okcard"><div class="row">'+CHK+'<div class="grow"><span class="title">Notifications activées</span><span class="muted small">Sur cet appareil : nouveau message d\'un client, séance terminée, séance non faite.</span></div></div><button class="btn ghost sm full" type="button" data-act="cpushoff">Désactiver sur cet appareil</button>';
  else h+='<div class="card"><div class="grow"><span class="title">Être prévenu sur cet appareil</span><span class="muted small">Nouveau message d\'un client, séance terminée, séance non faite.</span></div><button class="btn acc full" type="button" data-act="cpushon">Activer les notifications</button>';
  return h+'<p class="msg" id="n-msg" role="status">'+esc(PUSH.msg||"")+'</p></div></section>';
}
function coachCycles(){return (K.cur.content.program||{}).cycles||[];}
function coachMarkRead(){var c=K.cur.client,un=K.cur.msgs.filter(function(m){return m.sender==="client"&&!m.read_at;});if(!un.length)return;var now=new Date().toISOString();un.forEach(function(m){m.read_at=now;});if(K.unread)delete K.unread[c.id];sbc().from("messages").update({read_at:now}).eq("client_id",c.id).eq("sender","client").is("read_at",null).then(function(){});}
function coachMsg(){
  var h=msgList(K.cur.msgs,"coach",function(r){return refLabel(r,coachCycles());});
  h+='<form class="card" id="cmsgform"><div class="field"><label for="cm-body">Ton message à '+esc(K.cur.client.name)+'</label><textarea id="cm-body" maxlength="2000"></textarea></div><button class="btn acc full" type="submit">Envoyer</button><p class="msg bad" role="status"></p></form><p class="muted small">Le client voit ton message quand il ouvre son app. Il n\'y a pas encore de notification sur son téléphone.</p>';
  coachMarkRead();return h;
}
function coachPoll(){
  if(MODE!=="coach"||K.view!=="client"||K.tab!=="msg"||!K.cur||document.visibilityState!=="visible")return;
  sbc().from("messages").select("*").eq("client_id",K.cur.client.id).order("created_at").then(function(r){if(r.error||!K.cur||r.data.length===K.cur.msgs.length)return;K.cur.msgs=r.data;var t=document.getElementById("cm-body"),d=t?t.value:"";renderCoach(true);t=document.getElementById("cm-body");if(t)t.value=d;});
}
setInterval(coachPoll,30000);
function coachProgres(){
  var c=K.cur.client,P=K.cur.content.program||{},cs=(P.cycles||[]).filter(function(x){return x.sessions&&x.sessions.length;});
  var h='<section class="sec"><h3>Poids et mensurations</h3>'+bodyHtml(bodySeries(K.cur.body,K.cur.logs),c.weight_goal||"perdre",false)+'<div class="card"><div class="field"><label for="a-wg">Objectif de poids du client</label><select id="a-wg" data-b="cwg"><option value="perdre"'+(c.weight_goal==="perdre"?" selected":"")+'>Perdre du poids : une baisse s\'affiche en vert</option><option value="prendre"'+(c.weight_goal==="prendre"?" selected":"")+'>Prendre du poids : une hausse s\'affiche en vert</option><option value="maintenir"'+(c.weight_goal==="maintenir"?" selected":"")+'>Maintenir : pas de couleur</option></select></div></div></section>';
  cs.forEach(function(cy,i){var T=progTables(cy,function(w,sid){return K.cur.logs[cy.n+"-"+w+"-"+sid];},i===0);h+='<section class="sec"><h3>Charges · '+esc(cy.name)+'</h3>'+(T.any?T.html:'<p class="note">Aucune charge notée sur ce cycle.</p>')+'</section>';});
  if(cs.length)h+='<p class="muted small">Meilleure série de chaque semaine. <span class="up">▲ progrès</span> · <span class="down">▼ baisse</span> par rapport à la semaine d\'avant.</p>';
  return h;
}
function coachNutri(){
  var c=K.cur.client,G={kcal:c.kcal||0,prot:c.prot||0,carb:c.carb||0,fat:c.fat||0};
  var h='<form class="card" id="goalform"><span class="eyebrow muted">Objectifs du client, par jour</span><div class="four"><div class="field"><label for="g-kcal">kcal</label><input type="text" inputmode="numeric" id="g-kcal" value="'+esc(c.kcal||"")+'"></div><div class="field"><label for="g-prot">Prot. (g)</label><input type="text" inputmode="numeric" id="g-prot" value="'+esc(c.prot||"")+'"></div><div class="field"><label for="g-carb">Gluc. (g)</label><input type="text" inputmode="numeric" id="g-carb" value="'+esc(c.carb||"")+'"></div><div class="field"><label for="g-fat">Lip. (g)</label><input type="text" inputmode="numeric" id="g-fat" value="'+esc(c.fat||"")+'"></div></div><button class="btn acc full" type="submit">Enregistrer les objectifs</button><p class="msg" id="g-msg" role="status">'+esc(K.msg||"")+'</p></form>';
  h+='<section class="sec"><h3>Son journal · 45 derniers jours</h3>';
  var days=K.cur.food.filter(function(d){return (d.entries||[]).length;});
  if(!days.length)return h+'<p class="note">Aucun repas noté pour l\'instant.</p></section>';
  var s={k:0,p:0,g:0,l:0},n=Math.min(7,days.length);days.slice(0,7).forEach(function(d){var t=foodTotals(d.entries);s.k+=t.k;s.p+=t.p;s.g+=t.g;s.l+=t.l;});
  h+=totalsCard({k:s.k/n,p:s.p/n,g:s.g/n,l:s.l/n},G,"Moyenne des "+n+" derniers jours notés");
  h+='<div class="card"><div class="tbl num"><table><tr><th>Jour</th><th>kcal</th><th>P</th><th>G</th><th>L</th></tr>'+days.map(function(d,i){var t=foodTotals(d.entries);return '<tr><td><button class="btn ghost sm" type="button" data-act="cday" data-i="'+K.cur.food.indexOf(d)+'" style="min-height:36px;padding:0 10px">'+esc(frDate(d.day,{weekday:"short",day:"numeric",month:"short"}))+'</button></td><td>'+r0(t.k)+(G.kcal?' <span class="muted">/ '+G.kcal+'</span>':'')+'</td><td>'+r0(t.p)+'</td><td>'+r0(t.g)+'</td><td>'+r0(t.l)+'</td></tr>';}).join("")+'</table></div></div></section>';
  return h;
}
function coachDay(){
  var d=K.cur.food[K.daySel],c=K.cur.client,G={kcal:c.kcal||0,prot:c.prot||0,carb:c.carb||0,fat:c.fat||0},h=backHead("cback","Retour au client",c.name+" · "+frDate(d.day,{weekday:"long",day:"numeric",month:"long"}),"Journal alimentaire");
  h+=totalsCard(foodTotals(d.entries),G);
  MEALS.forEach(function(m){var L=(d.entries||[]).filter(function(x){return x.meal===m;});if(!L.length)return;
    h+='<div class="card"><div class="row"><span class="eyebrow muted grow">'+m+'</span><span class="small muted">'+r0(foodTotals(L).k)+' kcal</span></div>'+L.map(function(x){return '<div class="grow"><span style="font-weight:700;overflow-wrap:anywhere">'+esc(x.name)+(x.brand?' <span class="muted small">· '+esc(x.brand)+'</span>':'')+'</span><span class="muted small">'+(x.qty?esc(x.qty)+" g · ":"")+r0(x.k)+' kcal · P '+r0(x.p)+' · G '+r0(x.g)+' · L '+r0(x.l)+'</span></div>';}).join("")+'</div>';});
  return h;
}
function coachAcces(){
  var c=K.cur.client,P=K.cur.content.program||{},cs=P.cycles||[],maxN=cs.length?Math.max.apply(null,cs.map(function(x){return x.n;})):1;
  var h='<div class="card"><span class="eyebrow muted">Lien personnel du client</span><p class="small sel" id="plink">'+esc(linkFor(c))+'</p><div class="two"><button class="btn acc sm" type="button" data-act="ccopy" data-v="link">Copier le lien</button><button class="btn ghost sm" type="button" data-act="ccopy" data-v="code">Copier le code</button></div><p class="msg" id="a-msg" role="status"></p><p class="muted small">Envoie ce lien au client. Il l\'ouvre sur son téléphone puis l\'ajoute à son écran d\'accueil. Toute personne qui a ce lien accède à son espace : ne le partage qu\'avec lui.</p></div>';
  h+='<div class="card"><span class="eyebrow muted">Cycles</span><span class="title">Cycle '+c.unlocked+' débloqué'+(maxN>1?" sur "+maxN:"")+'</span><div class="two"><button class="btn acc sm" type="button" data-act="cunlock" data-d="1"'+(c.unlocked>=maxN?" disabled":"")+'>Débloquer le suivant</button><button class="btn ghost sm" type="button" data-act="cunlock" data-d="-1"'+(c.unlocked<=1?" disabled":"")+'>Reverrouiller</button></div>';
  cs.forEach(function(x){h+='<div class="row"><span class="grow small">'+esc(x.name)+(x.weeks?" · "+esc(x.weeks):"")+'</span><span class="pill'+(x.n<=c.unlocked?" ok":"")+'">'+(x.sessions&&x.sessions.length?(x.n<=c.unlocked?"Ouvert":"Verrouillé"):"Contenu à ajouter")+'</span></div>';});
  h+='<div class="field"><label for="a-pay">Paiement</label><select id="a-pay" data-b="cpay"><option value="echelonne"'+(c.pay_mode==="echelonne"?" selected":"")+'>Échelonné / mensuel : je débloque à chaque paiement</option><option value="une_fois"'+(c.pay_mode==="une_fois"?" selected":"")+'>En une fois : déblocage automatique quand le cycle est terminé</option></select></div></div>';
  h+='<div class="card"><span class="eyebrow muted">Accès</span><button class="btn ghost full sm" type="button" data-act="cactive">'+(c.active?"Désactiver l'accès du client":"Réactiver l'accès du client")+'</button></div>';
  return h;
}
function updClient(patch){var c=K.cur.client;return sbc().from("clients").update(patch).eq("id",c.id).select().single().then(function(r){if(r.error)throw r.error;Object.keys(r.data).forEach(function(k){c[k]=r.data[k];});});}
function coachClick(b){
  var a=b.dataset.act;
  if(a==="clist")coachList();
  else if(a==="cnav"){K.home=b.dataset.v;coachList();}
  else if(a==="clogout")sbc().auth.signOut().then(function(){coachLoginView();});
  else if(a==="cclient")openClient(+b.dataset.i);
  else if(a==="ctab"){K.tab=b.dataset.v;K.msg="";renderCoach();}
  else if(a==="clog"){K.logSel={c:+b.dataset.c,w:+b.dataset.w,s:b.dataset.s};K.view="log";renderCoach();}
  else if(a==="cday"){K.daySel=+b.dataset.i;K.view="day";renderCoach();}
  else if(a==="cback"){K.view="client";renderCoach();}
  else if(a==="ccopy"){var c=K.cur.client,txt=b.dataset.v==="link"?linkFor(c):c.token;copyText(txt,function(ok){var m=document.getElementById("a-msg");if(m){m.textContent=ok?(b.dataset.v==="link"?"Lien copié.":"Code copié."):"Copie impossible. Sélectionne le lien ci-dessus.";m.className="msg "+(ok?"ok":"bad");}});}
  else if(a==="cpushon"){b.disabled=true;PUSH.msg="";subscribePush().then(function(sub){return sbc().from("push_subs").upsert({endpoint:sub.endpoint,p256dh:sub.p256dh,auth:sub.auth,client_id:null},{onConflict:"endpoint"}).then(function(r){if(r.error)throw r.error;});}).then(function(){PUSH.on=true;renderCoach(true);}).catch(function(er){PUSH.msg=er&&er.message==="denied"?"Tu as refusé l'autorisation. Tu peux la redonner dans les réglages du navigateur.":"Activation impossible sur cet appareil.";renderCoach(true);});}
  else if(a==="cpushoff"){b.disabled=true;unsubscribePush().then(function(ep){return ep?sbc().from("push_subs").delete().eq("endpoint",ep):null;}).catch(function(){}).then(function(){PUSH.on=false;PUSH.msg="Notifications désactivées sur cet appareil.";renderCoach(true);});}
  else if(a==="cunlock"){b.disabled=true;var up=+b.dataset.d>0;updClient({unlocked:Math.max(1,K.cur.client.unlocked+(+b.dataset.d))}).then(function(){if(up)coachPush("unlock");renderCoach(true);}).catch(function(){b.disabled=false;});}
  else if(a==="cactive"){b.disabled=true;updClient({active:!K.cur.client.active}).then(function(){renderCoach(true);}).catch(function(){b.disabled=false;});}
  else if(a==="cforgot"){var fe=document.getElementById("c-email").value.trim(),fm=document.getElementById("c-msg");if(!fe){fm.textContent="Écris d'abord ton e-mail ci-dessus.";fm.className="msg bad";return;}
    b.disabled=true;sbc().auth.resetPasswordForEmail(fe,{redirectTo:location.origin+location.pathname}).then(function(r){b.disabled=false;if(r.error){fm.textContent=/rate|seconds/i.test(r.error.message)?"Un e-mail vient déjà de partir. Attends une minute avant de redemander.":"Envoi impossible : "+r.error.message;fm.className="msg bad";return;}fm.textContent="E-mail envoyé. Ouvre le lien reçu sur cet appareil pour choisir un nouveau mot de passe.";fm.className="msg ok";});}
  else if(a==="csignup"){var em=document.getElementById("c-email").value.trim(),pw=document.getElementById("c-pass").value,m=document.getElementById("c-msg");
    if(!em||pw.length<8){m.textContent="Entre ton e-mail et un mot de passe d'au moins 8 caractères.";m.className="msg bad";return;}
    b.disabled=true;sbc().auth.signUp({email:em,password:pw,options:{emailRedirectTo:location.origin+location.pathname+"#coach"}}).then(function(r){b.disabled=false;if(r.error){m.textContent="Création impossible : "+r.error.message;m.className="msg bad";return;}
      if(r.data&&r.data.session)coachList();else{m.textContent="Compte créé. Clique sur le lien reçu par e-mail, puis reviens te connecter.";m.className="msg ok";}});}
  else if(a==="goclient"){history.replaceState(null,"",location.pathname);document.body.classList.remove("coach");var t=store.get("ya-token",null);MODE="client";if(t)bootClient(t);else showLogin();}
}

/* ---------- événements globaux ---------- */
document.addEventListener("click",function(e){
  var tb=e.target.closest("#tabs button");
  if(tb&&MODE==="client"){if(ui.tab===tb.dataset.tab){if(ui.tab==="prog")ui.view="home";if(ui.tab==="nutri")ui.nview="journal";}ui.tab=tb.dataset.tab;render();return;}
  var b=e.target.closest("[data-act]");if(!b||b.disabled)return;
  var a=b.dataset.act;
  if(a==="gocoach"){history.replaceState(null,"",location.pathname+"#coach");bootCoach();return;}
  if(MODE==="coach")coachClick(b);else if(MODE==="client")clientClick(b);
});
document.addEventListener("input",function(e){if(MODE==="client"&&e.target.dataset.b)clientInput(e.target);});
document.addEventListener("change",function(e){
  var t=e.target,d=t.dataset;
  if(MODE==="client"&&d.b==="pday"){ui.pday=t.value;render(true);}
  if(MODE==="client"&&(d.b==="nrem"||d.b==="ntime")){var np=prefs();if(d.b==="nrem")np.reminder=t.checked;else if(/^\d{1,2}:\d{2}$/.test(t.value))np.time=t.value;D.client.notif=np;persist();savePrefs(null,np).then(function(){var m=document.getElementById("n-msg");if(m){m.textContent=np.reminder?"Rappel réglé à "+np.time.replace(":"," h ")+".":"Rappel désactivé.";m.className="msg ok";}}).catch(function(){var m=document.getElementById("n-msg");if(m){m.textContent="Réglage non enregistré. Vérifie ta connexion.";m.className="msg bad";}});if(d.b==="nrem")render(true);}
  if(MODE==="coach"&&d.b==="cpush"){}
  if(MODE==="coach"&&d.b==="cpay"){updClient({pay_mode:t.value}).catch(function(){});}
  if(MODE==="coach"&&d.b==="cwg"){updClient({weight_goal:t.value}).then(function(){renderCoach(true);}).catch(function(){});}
});
document.addEventListener("submit",function(e){
  e.preventDefault();var id=e.target.id,m;
  if(id==="loginform"){var t=document.getElementById("tok").value.trim();var mm=t.match(/c=([0-9a-f]{16,})/i);if(mm)t=mm[1];if(t.length<16){showLogin("Ce code est trop court. Colle le code complet.",t);return;}MODE="client";$main.innerHTML='<div class="center"><p class="muted">Chargement…</p></div>';bootClient(t.toLowerCase());}
  else if(id==="msgform"){var ta=document.getElementById("m-body"),txt=ta.value.trim(),bt=e.target.querySelector("button[type=submit]");m=document.getElementById("m-msg");if(!txt){m.textContent="Écris ton message avant d'envoyer.";return;}
    bt.disabled=true;rpc("client_send_message",{p_token:TOKEN,p_body:txt,p_ref:null}).then(function(row){D.messages.push(row);persist();render();pushCall({kind:"client",token:TOKEN,event:"message"});}).catch(function(){bt.disabled=false;m.textContent="Envoi impossible. Vérifie ta connexion et réessaie.";});}
  else if(id==="cmsgform"||id==="clogform"){var ta2=e.target.querySelector("textarea"),tx=ta2.value.trim(),b2=e.target.querySelector("button[type=submit]"),m2=e.target.querySelector(".msg");if(!tx){m2.textContent="Écris ton message avant d'envoyer.";return;}
    b2.disabled=true;var q=K.logSel;sbc().from("messages").insert({client_id:K.cur.client.id,sender:"coach",body:tx.slice(0,2000),ref:id==="clogform"?(q.c+"-"+q.w+"-"+q.s):null}).select().single().then(function(r){if(r.error)throw r.error;K.cur.msgs.push(r.data);coachPush(id==="clogform"?"comment":"message");renderCoach(id==="clogform");if(id==="cmsgform")window.scrollTo(0,document.body.scrollHeight);}).catch(function(er){b2.disabled=false;m2.textContent="Envoi impossible : "+(er.message||er);});}
  else if(id==="wform"){var wv=num(document.getElementById("w-kg").value),td=iso(new Date());m=document.getElementById("w-msg");
    if(!(wv>=25&&wv<=350)){m.textContent="Indique ton poids en kilos, par exemple 82,4.";return;}
    var wb=D.body[td]||{};wb.kg=wv;D.body[td]=wb;dirty["B|"+td]=1;ui.wEdit=false;schedule();render(true);}
  else if(id==="bodyform"){var day=document.getElementById("b-day").value||iso(new Date()),o={},nb=0;BF.forEach(function(f){var v=num(document.getElementById("b-"+f[0]).value);if(v>0){o[f[0]]=v;nb++;}});m=document.getElementById("b-msg");
    if(!nb){m.textContent="Indique au moins une mesure.";return;}if(day>iso(new Date())){m.textContent="La date ne peut pas être dans le futur.";return;}
    var cur0=D.body[day]||{};for(var kk in o)cur0[kk]=o[kk];D.body[day]=cur0;dirty["B|"+day]=1;schedule();render(true);}
  else if(id==="searchform"){var q=document.getElementById("q").value.trim();ui.q=q;if(q.length<2){ui.msg="Tape au moins 2 lettres.";ui.results=null;render(true);return;}searchOff(q);}
  else if(id==="createform"){var g=function(x){return document.getElementById(x).value.trim();},name=g("c-name");m=document.getElementById("c-msg");
    if(!name||g("c-kcal")===""){m.textContent="Indique au moins le nom et les calories pour 100 g.";return;}
    var f={name:name,brand:g("c-brand"),barcode:(ui.create&&ui.create.barcode)||"",kcal:num(g("c-kcal")),prot:num(g("c-prot")),carb:num(g("c-carb")),fat:num(g("c-fat")),extra:{sug:num(g("c-sug")),sat:num(g("c-sat")),fib:num(g("c-fib")),salt:num(g("c-salt"))}};
    rpc("client_save_custom_food",{p_token:TOKEN,p_food:f}).then(function(fid){f.id=fid;D.foods.push(f);persist();ui.create=null;openItem({name:f.name,brand:f.brand,barcode:f.barcode,kcal:f.kcal,prot:f.prot,carb:f.carb,fat:f.fat,extra:f.extra,src:"mine",id:fid});})
    .catch(function(){m.textContent="Enregistrement impossible. Vérifie ta connexion et réessaie.";});}
  else if(id==="newpassform"){var p1=document.getElementById("np-1").value,p2=document.getElementById("np-2").value;m=document.getElementById("np-msg");
    if(p1.length<8){m.textContent="Il faut au moins 8 caractères.";return;}if(p1!==p2){m.textContent="Les deux mots de passe ne sont pas identiques.";return;}
    var nb=e.target.querySelector("button[type=submit]");nb.disabled=true;sbc().auth.updateUser({password:p1}).then(function(r){if(r.error){nb.disabled=false;m.textContent="Enregistrement impossible : "+r.error.message;return;}K.recover=false;history.replaceState(null,"",location.pathname+"#coach");coachList();});}
  else if(id==="coachform"){var em=document.getElementById("c-email").value.trim(),pw=document.getElementById("c-pass").value;m=document.getElementById("c-msg");
    sbc().auth.signInWithPassword({email:em,password:pw}).then(function(r){if(r.error){m.textContent=/confirm/i.test(r.error.message)?"Confirme d'abord ton e-mail avec le lien reçu.":"E-mail ou mot de passe incorrect.";m.className="msg bad";}else coachList();});}
  else if(id==="addclient"){var nm=document.getElementById("n-name").value.trim();m=document.getElementById("n-msg");if(!nm){m.textContent="Indique le prénom du client.";return;}
    sbc().from("clients").insert({name:nm,offer:document.getElementById("n-offer").value,pay_mode:document.getElementById("n-pay").value}).select().single().then(function(r){if(r.error)throw r.error;return sbc().from("client_content").insert({client_id:r.data.id});}).then(function(r){if(r.error)throw r.error;coachList();}).catch(function(er){m.textContent="Ajout impossible : "+(er.message||er);});}
  else if(id==="goalform"){var gv=function(x){var n=Math.round(num(document.getElementById(x).value));return n>0?n:null;};
    updClient({kcal:gv("g-kcal"),prot:gv("g-prot"),carb:gv("g-carb"),fat:gv("g-fat")}).then(function(){K.msg="Objectifs enregistrés. Le client les voit dès qu'il rouvre l'app.";renderCoach(true);var x=document.getElementById("g-msg");if(x)x.className="msg ok";}).catch(function(er){var x=document.getElementById("g-msg");if(x){x.textContent="Enregistrement impossible : "+(er.message||er);x.className="msg bad";}});}
});
window.addEventListener("online",function(){if(MODE==="client"&&Object.keys(dirty).length)flush();});
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden"&&MODE==="client"){persist();if(Object.keys(dirty).length){clearTimeout(flushTimer);flush();}}});

/* ---------- démarrage ---------- */
(function boot(){
  var hsh=location.hash||"",m=hsh.match(/c=([0-9a-f]{16,})/i);
  if(/type=recovery/.test(hsh))K.recover=true;
  if(/^#coach/.test(hsh)||/type=signup|access_token=|error_code=/.test(hsh)){bootCoach();return;}
  var tok=m?m[1].toLowerCase():store.get("ya-token",null);
  if(tok){MODE="client";bootClient(tok);}else showLogin();
})();
})();
