(function(){
var hd=document.getElementById("hd"),nv=document.getElementById("nv"),mb=document.getElementById("mb");
addEventListener("scroll",function(){hd.classList.toggle("s",scrollY>10)},{passive:true});
mb.onclick=function(){var o=nv.classList.toggle("o");mb.setAttribute("aria-expanded",o?"true":"false")};
nv.addEventListener("click",function(e){var b=e.target.closest(".ddb");if(b){var p=b.parentNode;p.classList.toggle("o");b.setAttribute("aria-expanded",p.classList.contains("o")?"true":"false");return}if(e.target.closest("a"))nv.classList.remove("o")});
var els=document.querySelectorAll(".rv");
if("IntersectionObserver" in window){var io=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.12});els.forEach(function(el,i){el.style.transitionDelay=(i%4)*70+"ms";io.observe(el)})}else{els.forEach(function(el){el.classList.add("in")})}
var calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".bgs").forEach(function(g,gi){var s=g.children,i=0;s[0].classList.add("on");if(s.length<2||calm)return;
setInterval(function(){s[i].classList.remove("on");i=(i+1)%s.length;s[i].classList.add("on")},6000+gi*900)});
function slider(sl){
var tr=sl.querySelector(".sl-track");if(!tr||!tr.children.length)return;
var rv=sl.classList.contains("rvs"),cs=tr.children,dt=sl.querySelector(".sl-dots"),pv=sl.querySelector(".sl-prev"),nx=sl.querySelector(".sl-next"),pp=sl.querySelector(".sl-pp"),pr=sl.querySelector(".sl-prog i"),ct=sl.querySelector(".sl-count"),tm,pg=1,auto=sl.hasAttribute("data-auto"),vis=true,held=false,user=false;
function gap(){return parseFloat(getComputedStyle(tr).columnGap)||0}
function st(){return cs[0].offsetWidth+gap()}
function mx(){return tr.scrollWidth-tr.clientWidth}
function idx(){return Math.min(pg-1,Math.round(tr.scrollLeft/st()))}
function mark(){var k=idx();
 if(dt)[].forEach.call(dt.children,function(d,i){d.className=i==k?"on":""});
 if(rv){var l=tr.getBoundingClientRect(),n=0,f=-1,la=0;
  [].forEach.call(cs,function(c,i){var r=c.getBoundingClientRect(),ok=r.left>=l.left-6&&r.right<=l.right+6;c.classList.toggle("off",!ok);if(ok){n++;if(f<0)f=i;la=i}});
  if(ct)ct.textContent=n?(f==la?(f+1):(f+1)+"–"+(la+1))+" van "+cs.length:"";
  if(pr)pr.style.width=(mx()>4?Math.max(8,tr.scrollLeft/mx()*100):100)+"%";
  var e=mx()<=4?"all":tr.scrollLeft<=4?"start":tr.scrollLeft>=mx()-4?"end":"mid";tr.dataset.e=e;
  [].forEach.call(cs,function(c,i){c.setAttribute("aria-label",(i+1)+" van "+cs.length)})}}
function build(){pg=Math.max(1,Math.round(mx()/st())+1);var many=pg>1;[pv,nx,pp,dt].forEach(function(e){if(e)e.hidden=!many});
 if(dt){dt.innerHTML="";for(var i=0;i<pg;i++)dt.appendChild(document.createElement("i"))}mark()}
function go(n){tr.scrollTo({left:Math.max(0,Math.min(n,pg-1))*st(),behavior:calm?"auto":"smooth"})}
function next(){tr.scrollLeft>=mx()-4?go(0):go(idx()+1)}
function prev(){tr.scrollLeft<=4?go(pg-1):go(idx()-1)}
function stop(){clearInterval(tm);tm=0}
function play(){stop();if(!auto||calm||pg<2||!vis||held||user)return;tm=setInterval(next,rv?6500:5500)}
function setPP(){if(!pp)return;var off=user||held===2;pp.setAttribute("aria-pressed",off?"true":"false");pp.setAttribute("aria-label",off?"Automatisch doorlopen hervatten":"Automatisch doorlopen pauzeren");pp.firstChild.textContent=off?"▶":"❚❚"}
if(pp){if(!auto||calm){user=true}pp.onclick=function(){user=!user;held=0;setPP();user?stop():play()};setPP()}
if(nx)nx.onclick=function(){next();if(!rv){stop()}else{play()}};if(pv)pv.onclick=function(){prev();if(!rv){stop()}else{play()}};
tr.addEventListener("scroll",function(){requestAnimationFrame(mark)},{passive:true});
tr.addEventListener("keydown",function(e){if(e.key=="ArrowRight"){next();e.preventDefault()}if(e.key=="ArrowLeft"){prev();e.preventDefault()}if(e.key=="Home"){go(0);e.preventDefault()}if(e.key=="End"){go(pg-1);e.preventDefault()}});
["mouseenter","focusin"].forEach(function(e){sl.addEventListener(e,function(){held=1;stop()})});
["mouseleave","focusout"].forEach(function(e){sl.addEventListener(e,function(){held=0;play()})});
sl.addEventListener("touchstart",function(){user=true;stop();setPP()},{passive:true});
if("IntersectionObserver" in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting;vis?play():stop()},{threshold:.25}).observe(sl)}
if(rv){var dx=0,x0=0,s0=0,dn=false;
 tr.addEventListener("pointerdown",function(e){if(e.pointerType!="mouse"||e.button)return;dn=true;dx=0;x0=e.clientX;s0=tr.scrollLeft;tr.classList.add("drag");try{tr.setPointerCapture(e.pointerId)}catch(_){}});
 tr.addEventListener("pointermove",function(e){if(!dn)return;dx=e.clientX-x0;tr.scrollLeft=s0-dx});
 function up(){if(!dn)return;dn=false;tr.classList.remove("drag");user=true;stop();setPP();go(Math.round(tr.scrollLeft/st()))}
 tr.addEventListener("pointerup",up);tr.addEventListener("pointercancel",up);tr.addEventListener("dragstart",function(e){e.preventDefault()})}
var rz;addEventListener("resize",function(){clearTimeout(rz);rz=setTimeout(build,120)});sl._rb=build;build()}
document.querySelectorAll(".sl").forEach(slider);
/* voor/na */
document.querySelectorAll("[data-ba]").forEach(function(b){var stg=b.querySelector(".ba-stage"),r=b.querySelector(".ba-r"),v=b.querySelector(".ba-v");
 function set(p){stg.style.setProperty("--p",p+"%")}
 r.addEventListener("input",function(){set(r.value);b.classList.add("used")});set(50);
 b.querySelectorAll(".ba-sw button").forEach(function(x){x.onclick=function(){b.querySelectorAll(".ba-sw button").forEach(function(y){y.classList.toggle("on",y===x)});v.src=x.dataset.src;v.alt=x.dataset.alt}});
 if(!calm&&"IntersectionObserver" in window){var o=new IntersectionObserver(function(en){if(!en[0].isIntersecting)return;o.disconnect();var t0=null,seq=[[50,22,700],[22,78,1100],[78,50,700]],i=0,from=50;
  (function step(t){if(b.classList.contains("used"))return;if(t0===null)t0=t;var s=seq[i],k=Math.min(1,(t-t0)/s[2]),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,p=s[0]+(s[1]-s[0])*e;set(p);r.value=p;if(k>=1){i++;t0=null;if(i>=seq.length)return}requestAnimationFrame(step)})(performance.now())},{threshold:.6});o.observe(b)}});
/* video */
document.querySelectorAll("[data-vd]").forEach(function(v){var f=v.parentNode,btn=f.querySelector(".vd-b"),ic=btn.firstChild;
 function sync(){f.classList.toggle("paused",v.paused);ic.textContent=v.paused?"▶":"❚❚"}
 v.addEventListener("play",sync);v.addEventListener("pause",sync);sync();var manual=false;
 btn.onclick=function(){manual=true;v.paused?v.play():v.pause()};
 if(!calm&&"IntersectionObserver" in window){new IntersectionObserver(function(en){var on=en[0].isIntersecting;if(on){v.preload="auto";if(!manual)v.play().catch(function(){})}else if(!v.paused)v.pause()},{threshold:.5}).observe(v)}});
var fc=document.querySelector(".fchips");
if(fc){fc.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var f=b.dataset.f;[].forEach.call(fc.children,function(x){x.classList.toggle("on",x===b)});document.querySelectorAll(".rgrid .rs").forEach(function(r){r.hidden=!(f=="alle"||(r.dataset.t||"").indexOf(f)>=0)})})}
})();
/* wisselende woorden in de kop */
(function(){document.querySelectorAll("[data-rotg]").forEach(function(g){var rs=[].slice.call(g.querySelectorAll(".rot"));if(!rs.length)return;
 if(matchMedia("(prefers-reduced-motion: reduce)").matches){rs.forEach(function(r){r.classList.add("static")});return}
 var n=rs[0].querySelector(".rr").children.length,i=0;
 rs.forEach(function(r){var l=r.querySelector(".rr");l.appendChild(l.children[0].cloneNode(true))});
 function w(r,k){if(r.classList.contains("rw")){var s=r.querySelector(".rr").children[k];r.style.width=s.scrollWidth+8+"px"}}
 function fit(){rs.forEach(function(r){w(r,i%n)})}
 fit();addEventListener("resize",fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
 setInterval(function(){i++;rs.forEach(function(r){var l=r.querySelector(".rr"),h=l.children[0].getBoundingClientRect().height;l.style.transition="transform .7s cubic-bezier(.65,0,.25,1)";l.style.transform="translateY(-"+i*h+"px)";w(r,i)});
  if(i==n){setTimeout(function(){rs.forEach(function(r){var l=r.querySelector(".rr");l.style.transition="none";l.style.transform="translateY(0)"});i=0},760)}},2800)})
/* Google-reviews automatisch bijwerken (via /api/reviews; bij een fout blijven de vaste reviews staan) */
var tracks=document.querySelectorAll(".rvs .sl-track,.rgrid");
if(tracks.length&&location.protocol.indexOf("http")==0&&window.fetch){
 var norm=function(s){return(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"").slice(0,50)};
 fetch("/api/reviews",{headers:{Accept:"application/json"}}).then(function(r){return r.ok?r.json():null}).then(function(d){
  if(!d||!d.ok)return;
  if(d.rating){var rt=(Math.round(d.rating*10)/10).toFixed(1).replace(".",",");document.querySelectorAll('.rbadges a[href*="maps.google"] strong').forEach(function(s){s.textContent=rt})}
  var have={};document.querySelectorAll(".rs blockquote").forEach(function(b){have[norm(b.textContent)]=1});
  var nieuw=(d.reviews||[]).filter(function(v){var k=norm(v.tekst);if(!k||have[k])return false;have[k]=1;return true});
  if(!nieuw.length)return;
  var mk=function(v){var f=document.createElement("figure");f.className="rs";f.setAttribute("data-t","algemeen alle");f.setAttribute("role","group");f.setAttribute("aria-roledescription","review");
   var n=Math.max(1,Math.min(5,v.sterren|0)),st=document.createElement("div");st.className="st";st.setAttribute("role","img");st.setAttribute("aria-label",n+" van 5 sterren");st.textContent="★★★★★".slice(0,n)+"☆☆☆☆☆".slice(0,5-n);f.appendChild(st);
   var q=document.createElement("blockquote");q.textContent="“"+v.tekst+"”";f.appendChild(q);
   var c=document.createElement("figcaption"),av=document.createElement("span");av.className="av g";av.setAttribute("aria-hidden","true");av.textContent=(v.naam||"G").charAt(0).toUpperCase();
   var w=document.createElement("span"),b=document.createElement("b");b.textContent=v.naam||"Google-gebruiker";var sm=document.createElement("small"),dt="";
   if(v.datum){try{dt=" · "+new Date(v.datum).toLocaleDateString("nl-NL",{month:"long",year:"numeric"})}catch(e){}}
   if(v.url){var l=document.createElement("a");l.href=v.url;l.target="_blank";l.rel="noopener nofollow";l.textContent="Google review";l.style.color="inherit";sm.appendChild(l);sm.appendChild(document.createTextNode(dt))}else sm.textContent="Google review"+dt;
   w.appendChild(b);w.appendChild(sm);c.appendChild(av);c.appendChild(w);f.appendChild(c);return f};
  tracks.forEach(function(t){nieuw.slice().reverse().forEach(function(v){t.insertBefore(mk(v),t.firstChild)});var s=t.closest(".sl");if(s&&s._rb){t.scrollLeft=0;s._rb()}});
 }).catch(function(){})}
})();
