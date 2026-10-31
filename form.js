var CFG={endpoint:"/api/aanvraag"}; /* Adres dat de aanvraag ontvangt en mailt, bijv. "/aanvraag.php". Leeg = voorbeeldpagina. */
var P={"Complete badkamer":"b","Toilet":"t","Elektrawerk":"e","Zonnepanelen":"z","Accu installatie":"a","Loodgieterwerk":"l"};
var BR=["Heb ik al","Levering door Oosterveld","Nog onbekend"];
var F=[
{k:"Project",t:"r",o:["Complete badkamer","Toilet","Elektrawerk","Zonnepanelen","Accu installatie","Loodgieterwerk"]},
{k:"Particulier of zakelijk",s:"Klanttype",t:"r",o:["Particulier","Zakelijk"]},
{k:"Woning",t:"r",o:["Nieuwbouw","Bestaande bouw"]},
{k:"Verdieping",t:"r",o:["Begane grond","1e verdieping","2e verdieping of hoger"],f:"bt"},
{k:"Afmetingen ruimte (lengte × breedte in meter)",s:"Afmetingen",t:"d",f:"bt"},
{k:"Schuin dak in de ruimte",t:"r",o:["Ja","Nee"],f:"b"},
{k:"Bestaande ruimte",t:"r",o:["Slopen (oude badkamer/toilet eruit)","Kale ruimte, geen sloop nodig"],f:"bt"},
{k:"Installatie kranen en leidingen",s:"Installatie",t:"r",o:["Inbouw (in de wand)","Opbouw (zichtbaar)","Weet ik niet"],f:"bt"},
{k:"Plafond afwerken",t:"r",o:["Ja","Nee"],f:"bt"},
{k:"Soort plafond",t:"r",o:["Stucplafond","Kunststof plafond","Weet ik niet"],f:"bt",w:"Plafond afwerken:Ja"},
{k:"Afzuiging",t:"r",o:["Aanwezig","Moet geïnstalleerd worden","Geen afzuiging"],f:"bt"},
{k:"Bad gewenst",s:"Bad",t:"r",o:["Ja","Nee"],f:"b"},
{k:"Gewenst sanitair",t:"m",o:["Inloopdouche","Douche met deur","Badmeubel met wastafel","Dubbele wastafel"],f:"b"},
{k:"Radiator",t:"r",o:["CV-radiator","Elektrische radiator","Geen radiator"],f:"b"},
{k:"Toilet in de badkamer",t:"r",o:["Aanwezig, blijft zoals het is","Aanwezig, wordt vervangen","Niet aanwezig, moet geïnstalleerd worden","Geen toilet gewenst"],f:"b"},
{k:"Type toilet",t:"r",o:["Hangtoilet","Staand toilet"],f:"b",w:"Toilet in de badkamer:vervangen|geïnstalleerd"},
{k:"Toilet",t:"r",o:["Hangtoilet","Staand toilet"],f:"t"},
{k:"Fontein",t:"r",o:["Ja","Nee"],f:"t"},
{k:"Tegelwerk",t:"r",o:["Wanden en vloer","Alleen wanden","Alleen vloer","Geen tegelwerk"],f:"bt"},
{k:"Tegels leveren",t:"r",o:["Door mijzelf","Door Oosterveld","Nog onbekend"],f:"bt"},
{k:"Vloerverwarming",t:"r",o:["Ja","Nee"],f:"b"},
{k:"Elektra",t:"m",o:["Extra stopcontacten","Inbouwspots","Spiegelverlichting"],f:"bt"},
{k:"Werkzaamheden",t:"m",o:["Groepenkast of meterkast","Laadpaal aansluiten","Inductie of kookgroep aansluiten","Stopcontacten plaatsen","Storing verhelpen"],f:"e"},
{k:"Spoed",t:"r",o:["Ja, zo snel mogelijk","Nee"],f:"e",w:"Werkzaamheden:Storing"},
{k:"Huidige groepenkast",t:"r",o:["Oud (met smeltveiligheden)","Modern (met aardlekschakelaar)","Weet ik niet"],f:"e",w:"Werkzaamheden:Groepenkast"},
{k:"Laadpaal",t:"r",o:BR,f:"e",w:"Werkzaamheden:Laadpaal"},
{k:"Afstand meterkast tot laadpaal",t:"r",o:["Minder dan 10 m","10 tot 25 m","Meer dan 25 m","Weet ik niet"],f:"e",w:"Werkzaamheden:Laadpaal"},
{k:"Kookplaat",t:"r",o:BR,f:"e",w:"Werkzaamheden:Inductie"},
{k:"Aantal stopcontacten",t:"n",f:"e",w:"Werkzaamheden:Stopcontacten"},
{k:"Aansluiting",t:"r",o:["1-fase","3-fase","Weet ik niet"],f:"ez"},
{k:"Type dak",t:"r",o:["Schuin dak","Plat dak","Beide"],f:"z"},
{k:"Dakbedekking",t:"r",o:["Dakpannen","Bitumen of dakleer","Metaal of golfplaat","Anders"],f:"z"},
{k:"Richting dak",t:"r",o:["Zuid","Oost-West","Anders","Weet ik niet"],f:"z"},
{k:"Gewenst aantal panelen",t:"r",o:["Tot 10","10 tot 20","Meer dan 20","Advies gewenst"],f:"z"},
{k:"Slimme meter",t:"r",o:["Ja","Nee","Weet ik niet"],f:"z"},
{k:"Thuisbatterij erbij",t:"r",o:["Ja","Misschien later","Nee"],f:"z"},
{k:"Capaciteit",t:"r",o:["Tot 5 kWh","5 tot 10 kWh","10 kWh of meer","Advies gewenst"],f:"a"},
{k:"Doel",t:"m",o:["Meer eigen stroom gebruiken","Lagere energiekosten","Noodstroom bij storing","Terugleverkosten verlagen"],f:"a"},
{k:"Welk loodgieterwerk",s:"Loodgieterwerk",t:"m",o:["Keuken aansluiten (water en afvoer)","Waterleiding verleggen of aanleggen","Afvoer verleggen of aanleggen","Sanitair aansluiten","Anders, zie opmerkingen"],f:"l"},
{k:"Keuken",t:"r",o:["Nieuwe keuken wordt geplaatst","Keuken blijft, alleen aansluiten","Weet ik niet"],f:"l",w:"Loodgieterwerk:Keuken"},
{k:"Foto's of video (optioneel)",s:"Foto's",t:"f"},
{k:"Opmerkingen of extra wensen",s:"Opmerkingen",t:"a"},
{k:"Woonplaats",t:"x"},{k:"Naam",t:"x"},{k:"Telefoonnummer",s:"Telefoon",t:"x"},{k:"E-mailadres",s:"E-mail",t:"x"}
];
var C=document.getElementById("fields"),SM=document.getElementById("sum"),MG=document.getElementById("msg");
F.forEach(function(f,i){
var h='<div class="fg" data-f="'+(f.f||"")+'" data-w="'+(f.w||"")+'" data-k="'+(f.s||f.k)+'" data-t="'+f.t+'"><div class="fl">'+f.k+(["Project","Woonplaats","Naam","Telefoonnummer","E-mailadres"].indexOf(f.k)>=0?'<span aria-hidden="true" style="color:var(--or)"> *</span>':'')+'</div>';
if(f.t=="r"||f.t=="m"){f.o.forEach(function(o){h+='<label class="chip"><input type="'+(f.t=="r"?"radio":"checkbox")+'" name="f'+i+'" value="'+o+'"><span>'+o+'</span></label>'})}
else if(f.t=="d"){h+='<div class="dim"><input type="number" step="0.1" min="0" inputmode="decimal" aria-label="Lengte" placeholder="Lengte"><span>×</span><input type="number" step="0.1" min="0" inputmode="decimal" aria-label="Breedte" placeholder="Breedte"></div>'}
else if(f.t=="n"){h+='<div class="dim"><input type="number" min="0" step="1" inputmode="numeric" aria-label="'+f.k+'" placeholder="Aantal"></div>'}
else if(f.t=="f"){h+='<p class="ftip" id="ftip">Met een paar foto\'s of een korte video kunnen we vaak al een richtprijs geven zonder eerst langs te komen.</p><label class="fbtn"><input id="fin" type="file" accept="image/*,video/*" multiple><span>Foto\'s of video toevoegen</span></label><div class="fthumbs" id="fthumbs"></div><p class="fnote" id="fnote">Maximaal 6 foto\'s. Van een video nemen we een paar beelden.</p>'}
else if(f.t=="a"){h+='<textarea rows="3" placeholder="Omschrijf kort wat u wilt laten doen, of geef extra wensen door"></textarea>'}
else{h+='<input type="'+(f.k=="Telefoonnummer"?"tel":(f.s=="E-mail"?"email":"text"))+'" aria-label="'+f.k+'"'+(f.s=="E-mail"?' autocomplete="email"':'')+'>'}
C.insertAdjacentHTML("beforeend",h+"</div>")});
function proj(){var c=C.querySelector('[name=f0]:checked');return c?P[c.value]:""}
function val(g){var t=g.dataset.t;
if(t=="r"){var c=g.querySelector(":checked");return c?c.value:""}
if(t=="m"){return [].map.call(g.querySelectorAll(":checked"),function(x){return x.value}).join(", ")}
if(t=="d"){var n=g.querySelectorAll("input"),a=parseFloat(n[0].value),b=parseFloat(n[1].value);return a>0&&b>0?a+" × "+b+" m ("+(Math.round(a*b*10)/10)+" m²)":""}
if(t=="f"){return FOTO&&FOTO.length?FOTO.length+" beeld(en) bijgevoegd":""}
return g.querySelector("input,textarea").value.trim()}
function build(){
var p=proj(),L=["OFFERTE-AANVRAAG"],M={};
C.querySelectorAll(".fg").forEach(function(g){
var f=g.dataset.f,w=g.dataset.w,show=(!f||(p&&f.indexOf(p)>=0));
if(show&&w){var pr=w.split(":"),pv=M[pr[0]]||"";show=pr[1].split("|").some(function(s){return pv.indexOf(s)>=0})}
g.hidden=!show;if(!show)return;
var v=val(g);M[g.dataset.k]=v;if(v)L.push(g.dataset.k+": "+v)});
return L.length>1?L.join("\n"):"Nog niets ingevuld."}
function upd(){SM.textContent=build()}
C.addEventListener("input",upd);C.addEventListener("change",upd);upd();
(function(){try{var q=new URLSearchParams(location.search).get("project"),M={badkamer:"Complete badkamer",toilet:"Toilet",elektra:"Elektrawerk",zonnepanelen:"Zonnepanelen",accu:"Accu installatie",loodgieter:"Loodgieterwerk"};if(q&&M[q]){var el=C.querySelector('[name=f0][value="'+M[q]+'"]');if(el){el.checked=true;upd()}}}catch(e){}})();
function ok(){var t=build(),need=[];["Project","Woonplaats","Naam","Telefoon","E-mail"].forEach(function(k){if(t.indexOf(k+": ")<0)need.push(k)});
if(need.length){MG.textContent="Vul nog in: "+need.join(", ")+".";return null}
var em=(t.match(/E-mail: (.*)/)||[])[1]||"";if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){MG.textContent="Vul een geldig e-mailadres in.";return null}MG.textContent="";return t}
function data(){var o={};C.querySelectorAll(".fg").forEach(function(g){if(g.hidden)return;var v=val(g);if(v)o[g.dataset.k]=v});return o}
document.getElementById("send").onclick=function(){var t=ok();if(!t)return;
if(!CFG.endpoint){MG.textContent="Automatisch mailen is in deze voorbeeldpagina nog niet gekoppeld. Gebruik voor nu WhatsApp.";return}
var b=this;b.disabled=true;MG.textContent=FOTO.length?"Bezig met versturen, foto's worden meegestuurd…":"Bezig met versturen…";
fotoData().then(function(fotos){return fetch(CFG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tekst:t,velden:data(),fotos:fotos,website:document.getElementById("hp").value,pagina:location.href,herkomst:window.ooHerkomst?window.ooHerkomst():null})})})
.then(function(r){return r.json().then(function(j){if(!r.ok||!j.ok)throw 0;return j})})
.then(function(){MG.textContent="Bedankt! Je aanvraag is verstuurd. We nemen snel contact met je op.";FOTO.forEach(function(f){URL.revokeObjectURL(f.url)});FOTO=[];toon();upd()})
.catch(function(){MG.textContent="Versturen is niet gelukt. Probeer WhatsApp of bel ons."})
.then(function(){b.disabled=false})};
document.getElementById("wa").onclick=function(){var t=ok();if(t)window.open("https://wa.me/31616623602?text="+encodeURIComponent("Hallo, ik wil graag een richtprijs aanvragen.\n\n"+t),"_blank","noopener")};
var cp=document.getElementById("copy");if(cp)cp.onclick=function(){var t=ok();if(!t)return;try{navigator.clipboard.writeText(t).then(function(){MG.textContent="Gekopieerd."},function(){MG.textContent="Kopiëren lukt niet, selecteer de tekst handmatig."})}catch(e){MG.textContent="Kopiëren lukt niet, selecteer de tekst handmatig."}};
/* Foto- en video-intake: foto's worden in de browser verkleind, van een video nemen we 4 beelden. Alles gaat als JPEG mee met de aanvraag. */
var FOTO=[],FMAX=6,FIN=document.getElementById("fin"),FT=document.getElementById("fthumbs"),FN=document.getElementById("fnote"),FTIP=document.getElementById("ftip");
var TIPS={b:"Maak foto's van de huidige badkamer: vanuit de deuropening en van de hoeken met kranen en leidingen.",t:"Maak een foto van het toilet en de ruimte, en van de plek waar de leidingen de muur in gaan.",e:"Maak een foto van de hele meterkast met de klepjes zichtbaar, en een foto van dichtbij van de groepen.",z:"Maak een foto van het dak vanaf de straat of tuin, en een van de meterkast.",a:"Maak een foto van de meterkast en van de plek waar de thuisbatterij moet komen.",l:"Maak foto's van de leidingen en de plek van de klus."};
function tip(){var p=proj();FTIP.textContent=(TIPS[p]||"Maak foto's of een korte video van de plek van de klus.")+" Dan kunnen we vaak al een richtprijs geven zonder eerst langs te komen."}
C.addEventListener("change",function(e){if(e.target&&e.target.name=="f0")tip()});tip();
function teken(c,w,h){var m=Math.min(1,1280/Math.max(w,h)),cv=document.createElement("canvas");cv.width=Math.round(w*m);cv.height=Math.round(h*m);cv.getContext("2d").drawImage(c,0,0,cv.width,cv.height);return new Promise(function(ok){cv.toBlob(ok,"image/jpeg",0.78)})}
function foto(file){
if(window.createImageBitmap)return createImageBitmap(file).then(function(b){return teken(b,b.width,b.height)});
return new Promise(function(ok,nee){var i=new Image(),u=URL.createObjectURL(file);i.onload=function(){URL.revokeObjectURL(u);teken(i,i.naturalWidth,i.naturalHeight).then(ok)};i.onerror=nee;i.src=u})}
function beelden(file,n){return new Promise(function(ok,nee){
var v=document.createElement("video"),u=URL.createObjectURL(file),uit=[],i=0,t;v.muted=true;v.playsInline=true;v.preload="auto";
function klaar(){URL.revokeObjectURL(u);uit.length?ok(uit):nee()}
v.onerror=klaar;
v.onloadedmetadata=function(){var d=v.duration;if(!isFinite(d)||d<=0){klaar();return}t=function(){v.currentTime=d*(i+1)/(n+1)};t()};
v.onseeked=function(){teken(v,v.videoWidth,v.videoHeight).then(function(b){if(b)uit.push(b);i++;i<n?t():klaar()})};
v.src=u;setTimeout(klaar,15000)})}
function toon(){FT.textContent="";FOTO.forEach(function(f,k){var d=document.createElement("div"),im=document.createElement("img"),x=document.createElement("button");
im.src=f.url;im.alt=f.bron=="video"?"Beeld uit je video":"Je foto";x.type="button";x.textContent="×";x.setAttribute("aria-label","Verwijder dit beeld");
x.onclick=function(){URL.revokeObjectURL(f.url);FOTO.splice(k,1);toon();upd()};d.append(im,x);FT.appendChild(d)});
FN.textContent=FOTO.length?FOTO.length+" van "+FMAX+" beelden. Van een video nemen we een paar beelden.":"Maximaal 6 foto's. Van een video nemen we een paar beelden."}
function voeg(b,bron){if(b&&FOTO.length<FMAX)FOTO.push({blob:b,url:URL.createObjectURL(b),bron:bron})}
if(FIN)FIN.onchange=function(){var fs=[].slice.call(FIN.files),mis=0;FIN.value="";FN.textContent="Bezig met verwerken…";
fs.reduce(function(p,f){return p.then(function(){if(FOTO.length>=FMAX)return;
var vid=/^video\//.test(f.type);return (vid?beelden(f,Math.min(4,FMAX-FOTO.length)).then(function(bs){bs.forEach(function(b){voeg(b,"video")})}):foto(f).then(function(b){voeg(b,"foto")})).catch(function(){mis++})})},Promise.resolve())
.then(function(){toon();upd();if(mis)FN.textContent="Niet alles kon worden gelezen. Probeer een gewone foto (JPG) of een kortere video.";});};
function fotoData(){return Promise.all(FOTO.map(function(f){return new Promise(function(ok){var r=new FileReader();r.onload=function(){ok({data:String(r.result).split(",")[1],bron:f.bron})};r.onerror=function(){ok(null)};r.readAsDataURL(f.blob)})})).then(function(a){return a.filter(Boolean)})}
