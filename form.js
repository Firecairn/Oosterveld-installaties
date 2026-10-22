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
{k:"Opmerkingen of extra wensen",s:"Opmerkingen",t:"a"},
{k:"Woonplaats",t:"x"},{k:"Naam",t:"x"},{k:"Telefoonnummer",s:"Telefoon",t:"x"},{k:"E-mailadres (voor onze reactie, mag leeg)",s:"E-mail",t:"x"}
];
var C=document.getElementById("fields"),SM=document.getElementById("sum"),MG=document.getElementById("msg");
F.forEach(function(f,i){
var h='<div class="fg" data-f="'+(f.f||"")+'" data-w="'+(f.w||"")+'" data-k="'+(f.s||f.k)+'" data-t="'+f.t+'"><div class="fl">'+f.k+'</div>';
if(f.t=="r"||f.t=="m"){f.o.forEach(function(o){h+='<label class="chip"><input type="'+(f.t=="r"?"radio":"checkbox")+'" name="f'+i+'" value="'+o+'"><span>'+o+'</span></label>'})}
else if(f.t=="d"){h+='<div class="dim"><input type="number" step="0.1" min="0" inputmode="decimal" aria-label="Lengte" placeholder="Lengte"><span>×</span><input type="number" step="0.1" min="0" inputmode="decimal" aria-label="Breedte" placeholder="Breedte"></div>'}
else if(f.t=="n"){h+='<div class="dim"><input type="number" min="0" step="1" inputmode="numeric" aria-label="'+f.k+'" placeholder="Aantal"></div>'}
else if(f.t=="a"){h+='<textarea rows="3" placeholder="Omschrijf kort wat u wilt laten doen, of geef extra wensen door"></textarea>'}
else{h+='<input type="'+(f.k=="Telefoonnummer"?"tel":(f.s=="E-mail"?"email":"text"))+'" aria-label="'+f.k+'"'+(f.s=="E-mail"?' autocomplete="email"':'')+'>'}
C.insertAdjacentHTML("beforeend",h+"</div>")});
function proj(){var c=C.querySelector('[name=f0]:checked');return c?P[c.value]:""}
function val(g){var t=g.dataset.t;
if(t=="r"){var c=g.querySelector(":checked");return c?c.value:""}
if(t=="m"){return [].map.call(g.querySelectorAll(":checked"),function(x){return x.value}).join(", ")}
if(t=="d"){var n=g.querySelectorAll("input"),a=parseFloat(n[0].value),b=parseFloat(n[1].value);return a>0&&b>0?a+" × "+b+" m ("+(Math.round(a*b*10)/10)+" m²)":""}
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
function ok(){var t=build(),need=[];["Project","Woonplaats","Naam","Telefoon"].forEach(function(k){if(t.indexOf(k+": ")<0)need.push(k)});
if(need.length){MG.textContent="Vul nog in: "+need.join(", ")+".";return null}MG.textContent="";return t}
function data(){var o={};C.querySelectorAll(".fg").forEach(function(g){if(g.hidden)return;var v=val(g);if(v)o[g.dataset.k]=v});return o}
document.getElementById("send").onclick=function(){var t=ok();if(!t)return;
if(!CFG.endpoint){MG.textContent="Automatisch mailen is in deze voorbeeldpagina nog niet gekoppeld. Gebruik WhatsApp of kopieer de tekst.";return}
var b=this;b.disabled=true;MG.textContent="Bezig met versturen…";
fetch(CFG.endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({tekst:t,velden:data(),website:document.getElementById("hp").value,pagina:location.href})})
.then(function(r){return r.json().then(function(j){if(!r.ok||!j.ok)throw 0;return j})})
.then(function(){MG.textContent="Bedankt! Je aanvraag is verstuurd. We nemen snel contact met je op."})
.catch(function(){MG.textContent="Versturen is niet gelukt. Probeer WhatsApp of bel ons."})
.then(function(){b.disabled=false})};
document.getElementById("wa").onclick=function(){var t=ok();if(t)window.open("https://wa.me/31616623602?text="+encodeURIComponent("Hallo, ik wil graag een richtprijs aanvragen.\n\n"+t),"_blank","noopener")};
document.getElementById("copy").onclick=function(){var t=ok();if(!t)return;try{navigator.clipboard.writeText(t).then(function(){MG.textContent="Gekopieerd."},function(){MG.textContent="Kopiëren lukt niet, selecteer de tekst handmatig."})}catch(e){MG.textContent="Kopiëren lukt niet, selecteer de tekst handmatig."}};
