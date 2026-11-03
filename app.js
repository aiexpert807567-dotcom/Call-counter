const SB=supabase.createClient("https://vqspycbjawzjgassjtsx.supabase.co","sb_publishable_fHUtCq5mEzCG1QlO-KfpKg_o7WIxB4F");
const NUMS=["045-552367","048-211033","045-552338","056-4180739"];
const OPTS=[["S1","Sector 1"],["S2","Sector 2"],["S3","Sector 3"],["AWL","AWL"],["COP","City Ops"],["AUTH","Authorities"]];
const CATS=[["ii","Internal In"],["io","Internal Out"],["ei","External In"],["eo","External Out"]];
const $=s=>document.querySelector(s),K="cc_v1";
let S={};try{S=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){}};
const today=()=>{const d=new Date();return new Date(d-d.getTimezoneOffset()*6e4).toISOString().slice(0,10)};
let date=today(),act=NUMS.map(()=>"ii");
const key=(n,c,o)=>date+"|"+n+"|"+c+"|"+o,get=(n,c,o)=>S[key(n,c,o)]||0;
const add=(n,c,o,d)=>{const v=Math.max(0,get(n,c,o)+d);v?S[key(n,c,o)]=v:delete S[key(n,c,o)];save();render()};
const ct=(n,c)=>OPTS.reduce((a,o)=>a+get(n,c,o[0]),0);
const fd=d=>d.split("-").reverse().join("/");
const TD="border:1px solid #000;padding:4px 10px;text-align:center;font-family:Calibri,Arial,sans-serif;";
const c=(v,st="",at="")=>`<td style="${TD}${st}"${at?" "+at:""}>${v}</td>`;
const BL="background:#9dc3e6;font-weight:bold;",RED="background:#ff4d4d;color:#fff;font-weight:bold;";
function calc(){
 const tc={};CATS.forEach(k=>tc[k[0]]=NUMS.reduce((a,_,i)=>a+ct(i,k[0]),0));
 const in1=tc.ii+tc.ei,out1=tc.io+tc.eo;
 const sec={i:{},o:{}};
 OPTS.forEach(o=>{["i","o"].forEach(d=>{sec[d][o[0]]=NUMS.reduce((a,_,n)=>a+CATS.filter(k=>k[0][1]==d).reduce((b,k)=>b+get(n,k[0],o[0]),0),0)})});
 const sum=x=>Object.values(x).reduce((a,b)=>a+b,0);
 return{tc,in1,out1,sec,in2:sum(sec.i),out2:sum(sec.o)};
}
function p1(r,bi,bo){
 const tot=(l,v,st="")=>`<tr>${c("<b>"+l+"</b>","text-align:left;")}${c("<b>"+v+"</b>",st,"colspan=4")}</tr>`;
 return `<table style="border-collapse:collapse">
<tr>${c("<b>Date (D/M/Y)</b>")}${c("<b>"+fd(date)+"</b>","","colspan=4")}</tr>
<tr>${c("<b>Extension/Contact</b>",BL,"rowspan=2")}${c("<b>Internal</b>","background:#6aa84f;","colspan=2")}${c("<b>External</b>","background:#ed7d31;","colspan=2")}</tr>
<tr>${["Incoming","Outgoing","Incoming","Outgoing"].map(x=>c(x,BL)).join("")}</tr>
${NUMS.map((n,i)=>`<tr>${c("<b>"+n+"</b>")}${CATS.map(k=>c(ct(i,k[0]))).join("")}</tr>`).join("")}
<tr>${c("<b>All Total</b>")}${CATS.map(k=>c("<b>"+r.tc[k[0]]+"</b>")).join("")}</tr>
${tot("Incoming Total",r.in1,bi?RED:"")}${tot("Outgoing Total",r.out1,bo?RED:"")}
${tot("Internal Total",r.tc.ii+r.tc.io)}${tot("External Total",r.tc.ei+r.tc.eo)}</table>`;
}
function p2(r,bi,bo){
 const row=(l,d,bad,first)=>`<tr>${first?c("<b>"+fd(date)+"</b>","","rowspan=2"):""}${c("<i>"+l+"</i>")}${OPTS.map(o=>c(r.sec[d][o[0]],bad?RED:"")).join("")}</tr>`;
 return `<table style="border-collapse:collapse"><tr>${c("<b>Date</b>",BL)}${c("",BL)}${OPTS.map(o=>c(o[1],BL)).join("")}</tr>${row("Incoming","i",bi,1)}${row("Outgoing","o",bo,0)}</table>`;
}
function render(){
 $("#dt").value=date;
 $("#cards").innerHTML=NUMS.map((n,i)=>{
  const a=act[i];
  return `<div class="card"><div class="ch"><b>${n}</b><span>Total ${CATS.reduce((s,k)=>s+ct(i,k[0]),0)}</span></div>
<div class="tabs">${CATS.map(k=>`<button class="${k[0][0]} ${a==k[0]?"on":""}" data-t="${i}|${k[0]}">${k[1]}<i>${ct(i,k[0])}</i></button>`).join("")}</div>
${OPTS.map(o=>`<div class="row"><span>${o[1]}</span><button data-a="${i}|${a}|${o[0]}|-1">−</button><b>${get(i,a,o[0])}</b><button class="pl" data-a="${i}|${a}|${o[0]}|1">+</button></div>`).join("")}</div>`}).join("");
 const r=calc(),bi=r.in1!==r.in2,bo=r.out1!==r.out2,ck=$("#chk");
 ck.className=bi||bo?"bad":"ok";
 ck.innerHTML=bi||bo?"⚠ Totals do not match: "+(bi?`Incoming (Result 1 = ${r.in1}, Result 2 = ${r.in2}) `:"")+(bo?`Outgoing (Result 1 = ${r.out1}, Result 2 = ${r.out2})`:"")+" — marked in red below."
  :`✔ Totals match · Incoming ${r.in1} = ${r.in2} · Outgoing ${r.out1} = ${r.out2}`;
 $("#p1").innerHTML=p1(r,bi,bo);$("#p2").innerHTML=p2(r,bi,bo);
}
$("#cards").onclick=e=>{const b=e.target.closest("button");if(!b)return;
 if(b.dataset.t){const[i,k]=b.dataset.t.split("|");act[i]=k;render()}
 else if(b.dataset.a){const[i,k,o,d]=b.dataset.a.split("|");add(+i,k,o,+d)}};
document.querySelectorAll(".cp").forEach(b=>b.onclick=async()=>{
 const el=$("#p"+b.dataset.p),txt=[...el.querySelectorAll("tr")].map(r=>[...r.cells].map(x=>x.innerText).join("\t")).join("\n");
 try{await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([el.innerHTML],{type:"text/html"}),"text/plain":new Blob([txt],{type:"text/plain"})})])}
 catch(x){const g=document.createRange();g.selectNode(el.firstChild);const s=getSelection();s.removeAllRanges();s.addRange(g);document.execCommand("copy");s.removeAllRanges()}
 const t=b.textContent;b.textContent="Copied ✓";setTimeout(()=>b.textContent=t,1500)});
$("#dt").onchange=e=>{date=e.target.value||today();render()};
$("#rs").onclick=()=>{if(confirm("Reset all counts for "+fd(date)+"?")){Object.keys(S).forEach(k=>{if(k.startsWith(date+"|"))delete S[k]});save();render()}};
$("#lo").onclick=()=>SB.auth.signOut();
$("#lf").onsubmit=async e=>{e.preventDefault();$("#err").textContent="";
 const{error}=await SB.auth.signInWithPassword({email:$("#em").value.trim(),password:$("#pw").value});
 if(error)$("#err").textContent=error.message==="Failed to fetch"?"Cannot reach server. Check internet/DNS.":error.message};
const show=v=>{$("#login").hidden=v;$("#app").hidden=!v;if(v)render()};
SB.auth.getSession().then(({data})=>show(!!data.session));
SB.auth.onAuthStateChange((_,s)=>show(!!s));
