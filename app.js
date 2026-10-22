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
var cs=tr.children,dt=sl.querySelector(".sl-dots"),pv=sl.querySelector(".sl-prev"),nx=sl.querySelector(".sl-next"),tm,pg=1,auto=sl.hasAttribute("data-auto");
function gap(){return parseFloat(getComputedStyle(tr).columnGap)||0}
function st(){return cs[0].offsetWidth+gap()}
function mx(){return tr.scrollWidth-tr.clientWidth}
function idx(){return Math.min(pg-1,Math.round(tr.scrollLeft/st()))}
function mark(){if(!dt)return;var k=idx();[].forEach.call(dt.children,function(d,i){d.className=i==k?"on":""})}
function build(){pg=Math.max(1,Math.round(mx()/st())+1);var many=pg>1;[pv,nx,dt].forEach(function(e){if(e)e.hidden=!many});if(dt){dt.innerHTML="";for(var i=0;i<pg;i++)dt.appendChild(document.createElement("i"))}mark()}
function go(n){tr.scrollTo({left:Math.max(0,Math.min(n,pg-1))*st(),behavior:calm?"auto":"smooth"})}
function next(){tr.scrollLeft>=mx()-4?go(0):go(idx()+1)}
function prev(){tr.scrollLeft<=4?go(pg-1):go(idx()-1)}
function stop(){clearInterval(tm)}
function play(){if(!auto||calm||pg<2)return;stop();tm=setInterval(next,5500)}
if(nx)nx.onclick=function(){next();stop()};if(pv)pv.onclick=function(){prev();stop()};
tr.addEventListener("scroll",function(){requestAnimationFrame(mark)},{passive:true});
tr.addEventListener("keydown",function(e){if(e.key=="ArrowRight"){next();stop();e.preventDefault()}if(e.key=="ArrowLeft"){prev();stop();e.preventDefault()}});
["mouseenter","focusin","touchstart"].forEach(function(e){sl.addEventListener(e,stop,{passive:true})});
["mouseleave","focusout"].forEach(function(e){sl.addEventListener(e,play)});
addEventListener("resize",function(){build()});build();play()}
document.querySelectorAll(".sl").forEach(slider);
var fc=document.querySelector(".fchips");
if(fc){fc.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;var f=b.dataset.f;[].forEach.call(fc.children,function(x){x.classList.toggle("on",x===b)});document.querySelectorAll(".rgrid .rs").forEach(function(r){r.hidden=!(f=="alle"||(r.dataset.t||"").indexOf(f)>=0)})})}
})();
