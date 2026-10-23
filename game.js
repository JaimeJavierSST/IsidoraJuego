'use strict';
/* PRINCESA ISIDORA VS LOS CHANCHOS — Etapa I. Todo el arte se dibuja con Canvas (sustituible luego por assets/). */
const W=384,H=216,cv=document.getElementById('c'),cx=cv.getContext('2d');
const SC=4;cv.width=W*SC;cv.height=H*SC;cx.imageSmoothingEnabled=false;
const FONT="'Press Start 2P',monospace",clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ---------- AUDIO ---------- */
let AC=null,musicOn=true,mStep=0,mTimer=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')AC.resume()}
function tone(f,d,type='square',v=.05,sl=0,t0=0){if(!AC)return;const t=AC.currentTime+t0,o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+sl),t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}
const SFX={jump:()=>tone(300,.15,'square',.04,300),sword:()=>tone(500,.1,'sawtooth',.03,-300),arrow:()=>tone(700,.12,'triangle',.05,-400),hit:()=>tone(160,.15,'square',.06,-80),hurt:()=>tone(220,.35,'sawtooth',.06,-150),gem:()=>{tone(880,.08);tone(1320,.12,'square',.04,0,.07)},bonus:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.1,'square',.04,0,i*.08)),die:()=>[400,300,200,100].forEach((f,i)=>tone(f,.2,'square',.05,0,i*.15)),win:()=>[523,659,784,659,784,1047].forEach((f,i)=>tone(f,.18,'square',.04,0,i*.14)),empty:()=>tone(110,.1,'square',.04)};
const MEL=[69,0,72,0,76,0,72,0,74,0,77,0,76,72,69,0,67,0,71,0,74,0,71,0,72,0,76,0,81,0,76,0],BAS=[45,45,45,45,41,41,41,41,43,43,43,43,45,45,45,45],mf=n=>440*Math.pow(2,(n-69)/12);
function startMusic(){if(mTimer)return;mTimer=setInterval(()=>{if(!AC||!musicOn||document.hidden)return;const n=MEL[mStep%32];if(n)tone(mf(n),.16,'square',.02);if(mStep%2==0)tone(mf(BAS[(mStep>>1)%16]),.28,'triangle',.05);mStep++},170)}
/* ---------- ENTRADA (teclado + táctil) ---------- */
const keys={},pressed={},MAP={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'Dn',a:'A',A:'A',s:'S',S:'S',d:'D',D:'D',Escape:'P',p:'P',Enter:'E',' ':'E',m:'M',M:'M'};
function press(k){ac();startMusic();if(!keys[k])pressed[k]=1;keys[k]=1}
function release(k){keys[k]=0}
addEventListener('keydown',e=>{const k=MAP[e.key];if(k){e.preventDefault();if(!e.repeat)press(k)}});
addEventListener('keyup',e=>{const k=MAP[e.key];if(k)release(k)});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k;
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);b.classList.add('on');press(k)});
 const up=e=>{b.classList.remove('on');release(k)};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
 b.addEventListener('contextmenu',e=>e.preventDefault())});
if(matchMedia('(pointer:coarse)').matches)document.body.classList.add('touch');
addEventListener('touchstart',()=>document.body.classList.add('touch'),{passive:true});
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
const ptr=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};
cv.addEventListener('pointermove',e=>{if(!MENU.length)return;const[x,y]=ptr(e);MENU.forEach((m,i)=>{if(Math.abs(x-W/2)<90&&y>MY+i*15-2&&y<MY+i*15+12)sel=i})});
cv.addEventListener('pointerdown',e=>{ac();startMusic();const[x,y]=ptr(e);if(MENU.length){MENU.forEach((m,i)=>{if(Math.abs(x-W/2)<90&&y>MY+i*15-2&&y<MY+i*15+12){sel=i;pressed.E=1}})}else pressed.E=1});
/* ---------- SPRITES ---------- */
const PAL={k:'#1b1024',s:'#f8c8a0',h:'#8b4a28',H:'#5a2d18',y:'#ffd23f',p:'#a64ad8',P:'#ff7ac0',w:'#fff',g:'#d5dde8',b:'#6a3b1e',r:'#e23b3b',Q:'#d4528f',n:'#8e2f63',c:'#4ad0ff',e:'#2a7fff',d:'#bff3ff',o:'#e8a34a',O:'#a0622a',f:'#ffe9a8',G:'#8c96a6',x:'#44304f'};
function spr(rows,pal){const w=Math.max(...rows.map(r=>r.length)),c=document.createElement('canvas');c.width=w;c.height=rows.length;const x=c.getContext('2d');rows.forEach((r,j)=>[...r].forEach((ch,i)=>{const col=(pal&&pal[ch])||PAL[ch];if(ch!=='.'&&col){x.fillStyle=col;x.fillRect(i,j,1,1)}}));return c}
const UP=["...y.yy.y...","...yyyyyy...","..hhhhhhhh..",".hhhssssh...",".hhhsskssh..",".hhhssssss..",".hh.PPPP....",".hhppppppg..",".hspppppgg..","..ppppppg...",".hppppppp...","..PPPPPPPP.."];
const LG={st:["...ss.ss....","...ss.ss....","..bbb.bbb...","............"],a:["...ss.ss....","....s..ss...","..bb...bbb..","............"],b:["...ss.ss....","..ss..s.....","..bbb.bb....","............"],j:["...ss.ss....","..sss..s....","..bbb.bb....","............"]};
const ISI={};for(const k in LG)ISI[k]=spr([...UP,...LG[k]]);
const PIG=["......PP....",".PPPPPPPPP..","PPPPPPPPkPQQ","PPPPPPPPPPQn","PPPPPPPPPPQQ",".PPPPPPPPPP.",".PPPPPPPPPP.","..PP....PP..","..kk....kk.."];
const PIGS=spr(PIG),PIGB=spr(PIG,{P:'#8a5530',Q:'#5b3519',n:'#2a1a0a'});
const CH=spr(["..oooooooooo..",".oOOOOOOOOOOo.","oOOOOOOOOOOOOo","kkkkkkyykkkkkk","oOOOOOyyOOOOOo","oOOOOOOOOOOOOo","OOOOOOOOOOOOOO"]),CHO=spr(["..oooooooooo..","kkkkkkkkkkkkkk","kfffffffffffk","kfffyyyyffffk","oOOOOOyyOOOOOo","oOOOOOOOOOOOOo","OOOOOOOOOOOOOO"]);
const GEM=spr(["..cccc..",".cdddce.","cdwddcce","ecdddcce",".eccce..","..ece..."]),DOG=spr([".oooooooooo.","orrrrrrrrrro","oyyyyyyyyyyo",".oooooooooo."]);
const HRT=spr(["..r.r..",".rrwrr.","rrrrrrr",".rrrrr.","..rrr..","...r..."]),HRE=spr(["..x.x..",".xxxxx.","xxxxxxx",".xxxxx.","..xxx..","...x..."]);
const VIL=spr([".hhh.","hsksh","hsssh",".bbb.","bbbbb","bb.bb"],{b:'#3a8a5a'});
/* ---------- ISIDORA EN ALTA RESOLUCIÓN (assets/isidora_idle.png) ---------- */
const HDI=new Image();HDI.src='assets/isidora_idle.png';const hdOK=()=>HDI.complete&&HDI.naturalWidth>0;
function isiHD(cxc,by,fl,k=1,im=HDI){const w=(im.naturalWidth||im.width)/SC*k,h=(im.naturalHeight||im.height)/SC*k,ax=im.ax||.55,x=cxc-w*(fl?1-ax:ax),y=by-h;if(fl){cx.save();cx.translate(Math.round((x+w)*SC)/SC,Math.round(y*SC)/SC);cx.scale(-1,1);cx.drawImage(im,0,0,w,h);cx.restore()}else cx.drawImage(im,Math.round(x*SC)/SC,Math.round(y*SC)/SC,w,h)}
const SPR={};['cerdo_comun','cerdo_guerrero','arcon','arcon_abierto'].forEach(n=>{const i=new Image();i.src='assets/'+n+'.png';SPR[n]=i});
const sOK=n=>SPR[n].complete&&SPR[n].naturalWidth>0;
function spH(n,cxc,by,fl,ax=.5){const im=SPR[n],w=im.naturalWidth/SC,h=im.naturalHeight/SC,x=cxc-w*(fl?1-ax:ax),y=by-h;if(fl){cx.save();cx.translate(Math.round((x+w)*SC)/SC,Math.round(y*SC)/SC);cx.scale(-1,1);cx.drawImage(im,0,0,w,h);cx.restore()}else cx.drawImage(im,Math.round(x*SC)/SC,Math.round(y*SC)/SC,w,h);return h}
function strip(name,n,ax){const arr=Array.from({length:n},()=>{const c=document.createElement('canvas');c.width=1;c.height=1;c.ok=0;c.ax=ax;return c}),im=new Image();im.onload=()=>{const w=Math.floor(im.naturalWidth/n),h=im.naturalHeight;arr.forEach((c,i)=>{c.width=w;c.height=h;c.getContext('2d').drawImage(im,i*w,0,w,h,0,0,w,h);c.ok=1})};im.src='assets/'+name+'.png';return arr}
const WALK=strip('isidora_walk',6),walkOK=()=>WALK.every(c=>c.ok);
const JUMP=strip('isidora_jump',6),jumpOK=()=>JUMP.every(c=>c.ok),ATK=strip('isidora_ataque',4),atkOK=()=>ATK.every(c=>c.ok);
const okS=a=>a.every(c=>c.ok),ARC=strip('isidora_arco',3),DMG=strip('isidora_dano',4),FLY=strip('isidora_vuelo',3),PIGW=strip('cerdo_comun_anim',8,.5),PIGD=strip('cerdo_comun_muerte',3,.5),BOARW=strip('cerdo_guerrero_anim',4,.5),BOARC=strip('cerdo_guerrero_carga',3,.5),WPIG=strip('cerdo_alado',4,.5),PHK=strip('phork',4,.5),PHKD=strip('phork_derrota',3,.5),HAM=strip('martillo',4,.5),VILL=strip('superviviente',3,.5),ARW=new Image();ARW.src='assets/flecha.png';
const im1=n=>{const i=new Image();i.src='assets/'+n+'.png';return i},okI=i=>i.complete&&i.naturalWidth>0,CHN=strip('arcon_estado',2,.5),CHW=strip('arcon_alas',2,.5),DIA=strip('diamante',2,.5),HOT=im1('completo'),ALAS=im1('alas'),HUDH=im1('hud_corazon'),HUDE=im1('hud_corazon_vacio'),HUDC=im1('hud_credito'),HUDD=im1('hud_diamante'),HUDA=im1('flechas');
const TXN=['s1_suelo_izq','s1_suelo_med','s1_suelo_der','s1_muro_top','s1_muro_cuerpo','s1_madera_izq','s1_madera_med','s1_madera_der','casa1','casa_super','s2_suelo_top','s2_suelo_fill','s2_rama_izq','s2_rama_med','s2_rama_der','s3_nube_izq','s3_nube_med','s3_nube_der','s3_suelo','s4_piso_top1','s4_piso_top2','s4_piso_fill1','s4_piso_fill2','s4_borde_izq','s4_borde_med','s4_borde_der'],TX={};TXN.forEach(n=>TX[n]=im1(n));TX.casa1.ax=.5;TX.casa_super.ax=.5;
const FRG=strip('s2_fragil',3,.5),rd=(...q)=>q.every(n=>okI(TX[n])),dT=(i,x,y,w,h)=>cx.drawImage(i,Math.round(x*SC)/SC,Math.round(y*SC)/SC,w===undefined?i.naturalWidth/SC:w,h===undefined?i.naturalHeight/SC:h);
function tile(i,x,y,w,h){cx.save();cx.beginPath();cx.rect(x,y,w,h);cx.clip();const iw=i.naturalWidth/SC,ih=i.naturalHeight/SC;for(let a=x;a<x+w;a+=iw)for(let b=y;b<y+h;b+=ih)dT(i,a,b);cx.restore()}
const st3=(a,b,c,x,y,w,h,cw)=>{dT(b,x+cw,y,Math.max(1,w-2*cw),h);dT(a,x,y,cw,h);dT(c,x+w-cw,y,cw,h)};
function hdSolid(s){const n=L.n,x=s.x,y=s.y,w=s.w,h=s.h,k=s.k;
 if(n===1){
  if(k==='g'&&rd('s1_suelo_izq','s1_suelo_med','s1_suelo_der')){tile(TX.s1_suelo_med,x,y,w,h);dT(TX.s1_suelo_izq,x,y);dT(TX.s1_suelo_der,x+w-TX.s1_suelo_der.naturalWidth/SC,y);return 1}
  if(k==='s'&&rd('s1_muro_top','s1_muro_cuerpo')){cx.save();cx.beginPath();cx.rect(x,y,w,h);cx.clip();dT(TX.s1_muro_top,x,y);if(h>16)dT(TX.s1_muro_cuerpo,x,y+16);cx.restore();return 1}
  if(k==='h'&&rd('casa1')){isiHD(x+w/2,y+h,false,1,TX.casa1);return 1}
  if(k==='w'&&rd('s1_madera_izq','s1_madera_med','s1_madera_der')){st3(TX.s1_madera_izq,TX.s1_madera_med,TX.s1_madera_der,x,y-1,w,9,10);return 1}}
 if(n===2){
  if(k==='g'&&rd('s2_suelo_top','s2_suelo_fill')){tile(TX.s2_suelo_top,x,y,w,16);tile(TX.s2_suelo_fill,x,y+16,w,h-16);const ed=(a,b)=>{const g=cx.createLinearGradient(a,0,b,0);g.addColorStop(0,'rgba(4,10,6,.95)');g.addColorStop(1,'rgba(4,10,6,0)');cx.fillStyle=g;cx.fillRect(Math.min(a,b),y,8,h)};if(x>0){ed(x,x+8);R(x,y,1,h,'#050a06')}if(x+w<L.w){ed(x+w,x+w-8);R(x+w-1,y,1,h,'#050a06')}return 1}
  if(k==='w'&&rd('s2_rama_izq','s2_rama_med','s2_rama_der')){st3(TX.s2_rama_izq,TX.s2_rama_med,TX.s2_rama_der,x,y-4,w,14,16);return 1}
  if(k==='f'&&okS(FRG)){if(s.fall&&y>H+10)return 1;const o=s.t>0&&!s.fall?Math.round(Math.sin(T*60)):0;dT(FRG[s.fall?2:s.t>0?1:0],x+o,y-6,w,20);return 1}}
 if(n===3){
  if(k==='c'&&rd('s3_suelo')){tile(TX.s3_suelo,x,y,w,h);return 1}
  if(k==='w'&&rd('s3_nube_izq','s3_nube_med','s3_nube_der')){st3(TX.s3_nube_izq,TX.s3_nube_med,TX.s3_nube_der,x,y-3,w,14,16);return 1}}
 if(n===4){
  if(k==='g'&&rd('s4_piso_top1','s4_piso_top2','s4_piso_fill1','s4_piso_fill2')){for(let i=x;i<x+w;i+=16){const v=(i/16|0)%2?'2':'1';dT(TX['s4_piso_top'+v],i,y,16,12);dT(TX['s4_piso_fill'+v],i,y+12,16,14);dT(TX['s4_piso_fill'+v],i,y+26,16,14)}return 1}
  if(k==='w'&&rd('s4_borde_izq','s4_borde_med','s4_borde_der')){st3(TX.s4_borde_izq,TX.s4_borde_med,TX.s4_borde_der,x,y-1,w,16,15);return 1}}
 return 0}
const im2=f=>{const i=new Image();i.src='assets/'+f;return i},BGI={f1c:im2('fondo1_cielo.jpg'),f1l:im2('fondo1_lejos.png'),f1n:im2('fondo1_cerca.png'),f2c:im2('fondo2_cielo.jpg'),f2l:im2('fondo2_lejos.png'),f2n:im2('fondo2_cerca.png'),f3c:im2('fondo3_cielo.jpg'),f3n:im2('fondo3_nubes.png'),f4:im2('fondo4_salon.jpg')},PORT=im2('portada.jpg'),LOGO=im2('logo.png'),ESC=[im2('escena1.jpg'),im2('escena2.jpg'),im2('escena3.jpg')],FIN=im2('final.jpg'),FXG=strip('fx_golpe',4,.5),FXH=strip('fx_humo',4,.5),FXB=strip('fx_brillo',4,.5),RAY=strip('fx_rayo',3,.5),AVI=strip('fx_aviso',2,.5),bk=(...q)=>q.every(n=>okI(BGI[n]));
function bgHD(){const n=L.n,I=BGI,tl=(img,pf,bottom)=>{const w=img.naturalWidth/SC,h=img.naturalHeight/SC;if(w<2)return;for(let x=-((cam*pf)%w);x<W;x+=w)dT(img,x,bottom-h)},pan=img=>{const w=img.naturalWidth/SC;dT(img,-(cam/Math.max(1,L.w-W))*(w-W),0)};
 const abyss=c=>{const g=cx.createLinearGradient(0,140,0,H);g.addColorStop(0,'rgba('+c+',0)');g.addColorStop(.45,'rgba('+c+',.8)');g.addColorStop(.7,'rgba('+c+',1)');g.addColorStop(1,'rgba('+c+',1)');cx.fillStyle=g;cx.fillRect(0,140,W,H-140)};
 if(n===1&&bk('f1c','f1l','f1n')){pan(I.f1c);tl(I.f1l,.3,176);tl(I.f1n,.6,176);abyss('14,5,4');return 1}
 if(n===2&&bk('f2c','f2l','f2n')){R(0,0,W,H,'#0a1f19');pan(I.f2c);tl(I.f2l,.3,176);tl(I.f2n,.55,176);abyss('4,14,10');return 1}
 if(n===3&&bk('f3c','f3n')){const h=I.f3c.naturalHeight/SC;dT(I.f3c,0,-(camY/Math.max(1,L.h-H))*(h-H),W,h);cx.globalAlpha=.85;for(const wy of[40,300,560]){const y=wy-camY*.6;if(y>-285&&y<H)dT(I.f3n,0,y,W,285)}cx.globalAlpha=1;return 1}
 if(n===4&&bk('f4')){dT(I.f4,0,0,W,H);if((T%3.2)<.1)R(0,0,W,H,'#ffffff33');return 1}
 return 0}
function dI(i,x,y){const w=(i.naturalWidth||i.width)/SC,h=(i.naturalHeight||i.height)/SC;cx.drawImage(i,Math.round((x-w/2)*SC)/SC,Math.round((y-h/2)*SC)/SC,w,h)}
const bigI=(cxc,by,fl,k)=>hdOK()?isiHD(cxc,by,fl,k):draw(ISI.st,cxc-18,by-48,fl,3);
/* ---------- UTILIDADES DE DIBUJO ---------- */
function txt(s,x,y,sz=8,col='#fff',al='left',sh='#1b1024'){cx.font=sz+'px '+FONT;cx.textAlign=al;cx.textBaseline='top';if(sh){cx.fillStyle=sh;cx.fillText(s,x+1,y+1)}cx.fillStyle=col;cx.fillText(s,x,y)}
function otxt(s,x,y,sz,col,oc){cx.font=sz+'px '+FONT;cx.textAlign='center';cx.textBaseline='top';cx.fillStyle=oc;for(const[a,b]of[[-2,0],[2,0],[0,-2],[0,2],[-2,-2],[2,2],[-2,2],[2,-2],[0,3]])cx.fillText(s,x+a,y+b);cx.fillStyle=col;cx.fillText(s,x,y)}
function wrap(s,mw,sz=8){cx.font=sz+'px '+FONT;const out=[];let l='';for(const w of s.split(' ')){const t=l?l+' '+w:w;if(cx.measureText(t).width>mw&&l){out.push(l);l=w}else l=t}out.push(l);return out}
function draw(c,x,y,flip,s=1){const w=c.width*s,h=c.height*s;if(flip){cx.save();cx.translate(Math.round(x)+w,Math.round(y));cx.scale(-1,1);cx.drawImage(c,0,0,w,h);cx.restore()}else cx.drawImage(c,Math.round(x),Math.round(y),w,h)}
const R=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
function cloud(x,y,s){R(x,y+4*s,24*s,6*s,'#fff');R(x+4*s,y,12*s,8*s,'#fff');R(x+14*s,y+2*s,8*s,6*s,'#eaf6ff')}
function castle(x,y,s){cx.save();cx.translate(x,y);cx.scale(s,s);cx.fillStyle='#6a4a8a';cx.beginPath();cx.moveTo(-36,22);cx.lineTo(36,22);cx.lineTo(0,46);cx.fill();R(-30,0,60,22,'#e8d4f0');R(-34,-14,14,36,'#f4e2ff');R(20,-14,14,36,'#f4e2ff');R(-8,-26,16,48,'#fff0ff');
 cx.fillStyle='#ff5fa8';[[-34,-14,14],[20,-14,14],[-8,-26,16]].forEach(([a,b,w])=>{cx.beginPath();cx.moveTo(a-2,b);cx.lineTo(a+w/2,b-14);cx.lineTo(a+w+2,b);cx.fill()});R(-4,10,8,12,'#6a4a8a');R(-26,6,4,5,'#6a4a8a');R(22,6,4,5,'#6a4a8a');cx.restore()}
function rainbow(cxx,cy,r,a0,a1,lw=5){['#ff4040','#ff9a30','#ffe640','#50d060','#40a8ff','#6a50e0','#b050d0'].forEach((c,i)=>{cx.strokeStyle=c;cx.lineWidth=lw;cx.beginPath();cx.arc(cxx,cy,r-i*lw,a0,a1);cx.stroke()})}
function phork(x,y,s,fl,nh){cx.save();cx.translate(x,y);if(fl)cx.scale(-1,1);const r=(a,b,w,h,c)=>R(a*s,b*s,w*s,h*s,c);r(-3,2,6,9,'#c81e3c');cx.drawImage(PIGS,0,0,12*s,9*s);r(5,-2,6,3,'#aab3c2');r(4,-5,2,4,'#fff');r(10,-5,2,4,'#fff');r(2,6,8,3,'#8c96a6');if(!nh){r(-6,-4,2,14,'#8a5530');r(-9,-8,8,5,'#8c96a6')}cx.restore()}
function bolt(x,y0,y1,c='#fff27a'){let px=x;cx.fillStyle=c;for(let y=y0;y<y1;y+=8){const nx=x+((y/8|0)%2?5:-5);R(Math.min(px,nx),y,Math.abs(nx-px)+3,8,c);px=nx}}
const PI=document.getElementById('isi'),okP=()=>!!PI&&PI.complete&&PI.naturalWidth>0;
/* ---------- ESTADO ---------- */
let S='title',sel=0,T=0,fade=1,fdir=-1,fcb=null,MENU=[],MY=124,G=newG(),L,P,cam=0,camY=0,bolts=[],boltT=2,endT=0,endF=0,snap,paused=false,pops=[],parts=[],fxs=[],arrows=[],bannerT=0,sceneI=0,sceneT=0;
function newG(){return{stage:1,credits:3,gems:0,awarded:0,arrows:0,score:0}}
const SAVE='isidora_save',HI='isidora_hi';
const readSave=()=>{try{return JSON.parse(localStorage.getItem(SAVE))}catch(e){return null}},persist=()=>{try{localStorage.setItem(SAVE,JSON.stringify(G))}catch(e){}};
const hi=()=>+(localStorage.getItem(HI)||0),setHi=()=>{try{if(G.score>hi())localStorage.setItem(HI,G.score)}catch(e){}};
function go(fn){fcb=fn;fdir=1}
function setMenu(items,y=124){MENU=items;MY=y;sel=0}
function titleMenu(){S='title';const sv=readSave();setMenu([{t:'NUEVA PARTIDA',f:()=>{G=newG();go(()=>scene(0))}},...(sv?[{t:'CONTINUAR',f:()=>{G=Object.assign(newG(),sv);go(()=>G.stage>3?soon():startStage())}}]:[]),{t:'INSTRUCCIONES',f:()=>{S='help';MENU=[]}},{t:'CRÉDITOS',f:()=>{S='cred';MENU=[]}}])}
const SCENES=[{t:'Después de un largo viaje, la princesa Isidora regresa a su reino. Pero algo terrible ha sucedido: ¡una legión de chanchos ha tomado sus tierras!',d:0,next:()=>startStage()},
{t:'Los supervivientes le revelan que Phork ha levantado el castillo sobre las nubes. Para alcanzarlo, Isidora deberá atravesar el Bosque Arcoíris.',d:1,next:()=>startStage()},{t:'Entre las copas de los árboles, Isidora descubre una tormenta imposible. El castillo flota en el cielo y los rayos protegen el camino.',d:1,next:()=>startStage()},{t:'Las alas de Valquiria la han llevado hasta las puertas del castillo. Ha llegado la hora de enfrentarse a Phork y recuperar su hogar.',d:1,next:()=>startStage()}];
function scene(i){sceneI=i;sceneT=T;S='scene';MENU=[]}
function soon(){S='soon';setMenu([{t:'VOLVER AL MENÚ',f:()=>go(titleMenu)}],176)}
/* ---------- NIVEL (ETAPA I: VILLA DE LA FRONTERA) ---------- */
const mkE=(x,x0,x1,t,y=176)=>({x,y,by:y,x0,x1,t,hp:t===1?2:1,d:-1,w:t===1?18:14,h:t===1?15:11,hurt:0,cd:0,ch:0,wind:0,dying:0,sid:0});
const level=()=>G.stage>=4?level4():G.stage===3?level3():G.stage===2?level2():level1();
function level1(){const sol=[],E=[],gem=[],ch=[],food=[],add=(x,y,w,h,k)=>sol.push({x,y,w,h,k});
 [[0,520],[560,1000],[1040,1560],[1600,2000],[2040,2520]].forEach(a=>add(a[0],176,a[1]-a[0],40,'g'));
 const st=(x,y)=>add(x,y,24,176-y,'s'),hs=(x,w)=>add(x,136,w,40,'h'),wd=(x,y,w)=>add(x,y,w,6,'w');
 const pig=(x,x0,x1,t,y=176)=>E.push(mkE(x,x0,x1,t,y)),row=(x,y,n,d=14)=>{for(let i=0;i<n;i++)gem.push({x:x+i*d,y,got:0})};
 st(260,144);pig(150,110,230,0);pig(340,290,390,0);hs(400,56);wd(486,104,56);ch.push({x:508,y:104,open:0});row(490,92,3);row(60,158,4);row(262,124,3);
 st(600,160);st(624,144);pig(740,690,800,1);hs(820,56);wd(906,104,56);food.push({x:926,y:98,got:0});pig(960,925,992,0);row(760,150,3);row(826,120,4);
 pig(1100,1060,1180,1);st(1210,144);hs(1260,56);wd(1340,104,48);wd(1400,76,56);ch.push({x:1424,y:76,open:0});row(1344,90,3);row(1404,60,3);pig(1470,1440,1540,0);pig(1520,1450,1550,1);
 pig(1650,1610,1675,0);st(1680,144);st(1704,128);row(1688,100,4);pig(1780,1740,1860,1);pig(1900,1850,1990,0);food.push({x:1950,y:170,got:0});row(1760,150,4);
 pig(2120,2060,2200,1);pig(2260,2210,2330,0);row(2100,140,5);return{sol,E,gem,ch,food,w:2520,n:1,goal:2410,name:'ETAPA I: VILLA DE LA FRONTERA',sub:'Llega a la casa de los supervivientes'}}
function level2(){const sol=[],E=[],gem=[],ch=[],food=[],add=(x,y,w,h,k)=>sol.push({x,y,w,h,k}),pig=(x,x0,x1,t,y)=>E.push(mkE(x,x0,x1,t,y)),row=(x,y,n,d=14)=>{for(let i=0;i<n;i++)gem.push({x:x+i*d,y,got:0})},wd=(x,y,w)=>add(x,y,w,6,'w'),f=(x,y)=>sol.push({x,y,w:36,h:6,k:'f',y0:y,t:0,fall:0,vy:0,rs:0}),wing=(x,x0,x1,y)=>pig(x,x0,x1,2,y);
 [[0,380],[560,760],[900,1100],[1260,1500],[1660,1900],[2060,2480]].forEach(a=>add(a[0],176,a[1]-a[0],40,'g'));
 [[396,150],[444,138],[494,150],[776,148],[828,136],[1116,150],[1164,138],[1212,150],[1516,150],[1566,136],[1616,150],[1916,150],[1966,138],[2016,150]].forEach(a=>f(a[0],a[1]));
 pig(260,230,340,0,176);wing(300,260,360,120);wd(150,140,40);wd(200,106,48);ch.push({x:216,y:106,open:0});row(160,126,3);row(60,158,4);row(400,118,5,18);
 pig(650,590,740,1,176);wd(600,140,48);wd(660,108,48);food.push({x:680,y:100,got:0});row(780,118,4,16);
 wing(1000,930,1080,110);pig(960,920,1060,0,176);ch.push({x:1070,y:176,open:0});row(1120,118,5,16);
 pig(1330,1290,1380,1,176);wing(1400,1330,1480,100);wd(1380,140,48);wd(1430,108,48);row(1384,126,3);row(1520,118,5,18);
 pig(1740,1690,1800,1,176);pig(1850,1810,1890,0,176);wing(1780,1700,1880,110);wd(1760,140,48);ch.push({x:1774,y:140,open:0});food.push({x:1700,y:170,got:0});row(1920,118,5,18);
 pig(2150,2090,2220,1,176);wing(2260,2200,2330,110);row(2100,150,5);return{sol,E,gem,ch,food,w:2480,n:2,goal:2400,name:'ETAPA II: BOSQUE ARCOÍRIS',sub:'Cuidado con las ramas frágiles'}}
function level3(){const sol=[],E=[],gem=[],ch=[],food=[],add=(x,y,w,h,k)=>sol.push({x,y,w,h,k}),pig=(x,x0,x1,t,y)=>E.push(mkE(x,x0,x1,t,y)),row=(x,y,n,d=14)=>{for(let i=0;i<n;i++)gem.push({x:x+i*d,y,got:0})},pl=(x,y,w=72)=>add(x,y,w,6,'w'),wing=(x,x0,x1,y)=>pig(x,x0,x1,2,y);
 add(0,776,384,40,'c');[[30,740],[140,704],[250,668],[140,632],[30,596],[140,560],[250,524]].forEach(a=>pl(a[0],a[1]));
 ch.push({x:278,y:524,open:0,wings:1});pig(165,145,205,0,704);pig(60,40,90,1,596);pig(270,255,305,0,668);wing(200,20,360,640);
 row(46,726,3);row(156,690,3);row(266,654,3);row(46,582,3);row(156,546,3);
 wing(100,30,340,450);wing(280,40,350,370);wing(150,30,340,290);wing(250,30,350,210);wing(100,40,330,140);
 pl(40,440,56);pl(290,400,56);pl(150,340,56);ch.push({x:170,y:340,open:0});pl(250,260,56);food.push({x:270,y:252,got:0});pl(60,200,56);
 row(40,490,5,20);row(60,425,3);row(300,385,3);row(60,300,4,60);row(100,176,5,40);row(150,110,5,20);row(300,230,3);
 return{sol,E,gem,ch,food,w:384,h:816,n:3,name:'ETAPA III: CAMINO DE LAS ESTRELLAS',sub:'Busca el arcón de las alas'}}
function level4(){const sol=[],gem=[],ch=[],food=[],add=(x,y,w,h,k)=>sol.push({x,y,w,h,k});add(0,176,384,40,'g');add(40,140,64,6,'w');add(280,140,64,6,'w');ch.push({x:190,y:176,open:0});food.push({x:306,y:132,got:0});[50,64,78,290,304,318].forEach(x=>gem.push({x,y:126,got:0}));
 return{sol,E:[],gem,ch,food,w:384,n:4,boss:{x:310,hp:12,d:-1,st:'walk',t:1.5,hurt:0,h:null,sid:0},name:'ETAPA IV: CASTILLO DE LA FAMILIA ARCOÍRIS',sub:'Golpea a Phork 12 veces'}}
function hitBoss(dir){const B=L.boss;if(B.st==='dead'||B.hurt>0)return;B.hp--;B.hurt=.3;B.x=clamp(B.x+dir*6,24,360);SFX.hit();burst(B.x,155,'#fff',8);fxs.push({k:'g',x:B.x,y:152,t:0});G.score+=50;if(B.hp<=0){B.st='dead';B.t=2.6;B.h=null;bolts=[];SFX.die()}}
const bossBox=B=>({x:B.x-15,y:138,w:30,h:38});
function updateBoss(dt){const b=L.boss,p=P,fast=b.hp<=6?.7:1;b.hurt-=dt;
 if(b.st==='dead'){b.t-=dt;p.inv=9;if(Math.random()<.4)burst(b.x+(Math.random()-.5)*30,150+Math.random()*25,'#fff27a',3);if(Math.random()<.12)fxs.push({k:'h',x:b.x+(Math.random()-.5)*30,y:150+Math.random()*20,t:0});if(b.t<=0&&!p.won){p.won=1;G.stage=5;G.score+=1000;setHi();try{localStorage.removeItem(SAVE)}catch(e){}go(ending)}return}
 const dx=p.x-b.x;b.t-=dt;
 if(b.st==='walk'){b.d=dx>0?1:-1;if(Math.abs(dx)>40)b.x=clamp(b.x+b.d*(28/fast)*dt,24,360);if(b.t<=0){b.st=Math.random()<.5?'wind':'sum';b.t=.8*fast}}
 else if(b.st==='wind'&&b.t<=0){b.h={x:b.x,y:169,d:b.d,go:1,dist:0};b.st='throw'}
 else if(b.st==='throw'){if(!b.h){b.st='walk';b.t=1.1*fast}}
 else if(b.st==='sum'&&b.t<=0){const n=b.hp<=6?4:3;for(let i=0;i<n;i++)bolts.push({x:clamp(i?p.x+5+(Math.random()-.5)*200:p.x+5,12,372),t:-.9-i*.15});b.st='rest';b.t=1.3*fast}
 else if(b.st==='rest'&&b.t<=0){b.st='walk';b.t=.9*fast}
 const h=b.h;if(h){const sp=(h.go?190:210)*dt;if(h.go){h.x+=h.d*sp;h.dist+=sp;if(h.dist>220||h.x<10||h.x>374)h.go=0}else{const dd=b.x-h.x;h.x+=Math.sign(dd)*sp;if(Math.abs(dd)<10)b.h=null}
  if(b.h&&!p.dead&&ov(p,{x:h.x-7,y:h.y-7,w:14,h:14}))hurt(p.x<h.x?-1:1)}
 if(!p.dead&&ov(p,bossBox(b)))hurt(p.x<b.x?-1:1)}
function ending(){S='end';endT=T;endF=0;MENU=[];SFX.win()}
const mix=(a,b,k)=>a.map((v,i)=>Math.round(v+(b[i]-v)*k));
function endDraw(){if(!okI(FIN)){endDrawOld();return}const e=T-endT,k=clamp(e/3,0,1);dT(FIN,0,0,W,H);if(k<1)R(0,0,W,H,'rgba(0,0,0,'+(1-k)+')');
 if(e>6){R(10,8,222,68,'#1b1024dd');wrap('¡El reino está a salvo! La valentía de Isidora ha devuelto la esperanza. ¡La aventura continúa!'.slice(0,Math.floor((e-6)*30)),204).forEach((l,i)=>txt(l,18,14+i*12,8,'#fff'))}
 if(e>10){otxt('FIN',W/2-60,92,28,'#ffd23f','#7a2ab0');if(MENU.length)R(W/2-100,MY-6,200,40,'#1b1024cc');menuDraw()}}
function endDrawOld(){const e=T-endT,k=clamp(e/5,0,1),g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgb('+mix([14,10,42],[94,194,255],k)+')');g.addColorStop(1,'rgb('+mix([58,42,122],[200,240,255],k)+')');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 if(k<1&&(T%1.5)<.1)bolt(200,0,150);for(let i=0;i<5;i++)cloud(((i*90+e*8)%(W+60))-30,20+i%3*22,1.4);
 cx.fillStyle='#4aa84a';cx.beginPath();cx.moveTo(0,H);cx.lineTo(0,196);cx.quadraticCurveTo(190,176,W,198);cx.lineTo(W,H);cx.fill();for(let i=0;i<8;i++){R(150+i*28,200+i%2*4,12,9,'#e8c9a0');R(149+i*28,196+i%2*4,14,5,'#b03a2e')}
 const rp=clamp((e-2)/5,0,1);if(rp>0)rainbow(240,206,180,Math.PI,Math.PI+Math.PI*rp,6);
 castle(56,150,1.2);bigI(102,198-(e>3?Math.abs(Math.sin(e*5))*8:0),0,2);
 if(e>6){R(30,12,W-60,62,'#1b1024dd');wrap('¡El reino está a salvo! La valentía de Isidora ha devuelto la esperanza. ¡La aventura continúa!'.slice(0,Math.floor((e-6)*30)),W-80).forEach((l,i)=>txt(l,W/2,20+i*12,8,'#fff','center'))}
 if(e>10){otxt('FIN',W/2,92,28,'#ffd23f','#7a2ab0');if(MENU.length)R(W/2-100,MY-6,200,40,'#1b1024cc');menuDraw()}}
function bg4(){R(0,0,W,H,'#241540');const fl=(T%3.2)<.1;
 for(let i=0;i<4;i++){const x=24+i*96;R(x,30,48,110,fl?'#cfe6ff':'#101a3c');cx.globalAlpha=.55;for(let j=0;j<4;j++)R(x+2+(j%2)*23,32+(j>>1)*54,21,52,['#ff5fa8','#4ad0ff','#ffd23f','#7aff9a'][(i+j)%4]);cx.globalAlpha=1;R(x+23,30,2,110,'#241540');R(x+72,0,16,176,'#6a4a8a');R(x+75,0,3,176,'#9a7aba')}
 R(0,0,W,24,'#3a2260');R(0,24,W,3,'#ffd23f');rainbow(192,26,50,Math.PI,Math.PI*2,3)}
function newP(){return{x:24,y:150,w:10,h:16,vx:0,vy:0,face:1,hp:3,max:3,inv:0,sw:0,swid:0,fcd:0,ground:0,coy:0,buf:0,kb:0,dead:0,dt:0,safe:{x:24,y:150},wf:0,land:0,arrows:G.arrows}}
function startStage(){L=level();P=newP();snap={gems:G.gems,arrows:G.arrows};arrows=[];pops=[];parts=[];fxs=[];cam=0;bolts=[];boltT=2;camY=(L.h||H)-H;if(L.n===3){P.x=40;P.y=756}paused=false;S='play';MENU=[];bannerT=3;persist()}
function pop(s,x,y,c='#fff27a'){pops.push({s,x,y,l:1.2,c})}
function burst(x,y,c,n=8){for(let i=0;i<n;i++)parts.push({x,y,vx:(Math.random()-.5)*120,vy:-Math.random()*120,l:.5,c})}
/* ---------- FÍSICA ---------- */
const ow=s=>s.k==='w'||s.k==='f',ov=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function move(o,dx,dy){o.x+=dx;for(const s of L.sol){if(ow(s)||s.fall||!ov(o,s))continue;o.x=dx>0?s.x-o.w:s.x+s.w;o.vx=0}
 const pb=o.y+o.h;o.y+=dy;o.ground=0;
 for(const s of L.sol){if(s.fall||!ov(o,s))continue;if(ow(s)){if(dy>=0&&pb<=s.y+.5){o.y=s.y-o.h;o.vy=0;o.ground=1}}else if(dy>0){o.y=s.y-o.h;o.vy=0;o.ground=1}else if(dy<0){o.y=s.y+s.h;o.vy=0}}}
const supAt=(x,y)=>L.sol.some(s=>s.k!=='f'&&!s.fall&&x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h),solidAt=(x,y)=>L.sol.some(s=>!ow(s)&&x>=s.x&&x<s.x+s.w&&y>=s.y&&y<s.y+s.h);
function hurt(dir,force){if(P.dead||(P.inv>0&&!force))return;P.hp--;P.inv=1.5;P.kb=.25;P.vx=dir*90;P.vy=-150;SFX.hurt();burst(P.x+5,P.y+8,'#ff7ac0');if(P.hp<=0){P.dead=1;P.dt=1.4;P.vy=-220;SFX.die()}}
function dmg(e,n,dir){e.hp-=n;e.hurt=.2;e.x=clamp(e.x+dir*8,e.x0-10,e.x1+10);SFX.hit();burst(e.x,e.y-5,'#fff',6);fxs.push({k:'g',x:e.x,y:e.y-8,t:0});if(e.hp<=0){if(e.t)fxs.push({k:'h',x:e.x,y:e.y-8,t:0});e.dying=.4;G.score+=e.t===1?200:100;pop(e.t?'+200':'+100',e.x,e.y-14,'#fff')}}
function gemCount(){G.gems++;G.score+=10;SFX.gem();while(G.awarded<Math.floor(G.gems/50)){G.awarded++;G.credits++;pop('+1 CRÉDITO',P.x-10,P.y-14,'#7aff9a');SFX.bonus()}}
function restart(){if(G.credits>0){G.credits--;G.gems=snap.gems;G.arrows=snap.arrows;go(startStage)}else{S='over';setHi();setMenu([{t:'NUEVA PARTIDA',f:()=>{G=newG();go(()=>scene(0))}},{t:'MENÚ PRINCIPAL',f:()=>go(titleMenu)}],140)}}
function update(dt){
 if(pressed.M)musicOn=!musicOn;
 if(fdir){fade+=fdir*dt*2.6;if(fdir>0&&fade>=1){fade=1;fdir=-1;fcb&&fcb()}else if(fdir<0&&fade<=0){fade=0;fdir=0}}
 if(MENU.length&&!fdir){if(pressed.Dn)sel=(sel+1)%MENU.length;if(pressed.U)sel=(sel+MENU.length-1)%MENU.length;if(pressed.E||pressed.A||pressed.S||pressed.D){SFX.jump();MENU[sel].f()}}
 else if((S==='help'||S==='cred')&&(pressed.E||pressed.A||pressed.S||pressed.D||pressed.P))titleMenu();
 else if(S==='scene'&&!fdir&&(pressed.E||pressed.A||pressed.S||pressed.D)){const sc=SCENES[sceneI];if((T-sceneT)*40<sc.t.length)sceneT=-999;else go(sc.next)}
 if(S==='end'){if(pressed.E&&T-endT<10&&!MENU.length)endT=T-10;if(!endF&&T-endT>5){endF=1;SFX.win()}if(T-endT>10&&!MENU.length&&!fdir)setMenu([{t:'JUGAR DE NUEVO',f:()=>{G=newG();go(()=>scene(0))}},{t:'VOLVER AL MENÚ',f:()=>go(titleMenu)}],150)}
 if(S!=='play')return;
 if(pressed.P){paused=!paused;if(paused)setMenu([{t:'REANUDAR',f:()=>{paused=false;MENU=[]}},{t:'MENÚ PRINCIPAL',f:()=>{paused=false;go(titleMenu)}}],104);else MENU=[]}
 if(paused)return;
 const p=P;bannerT-=dt;for(const q of L.sol)if(q.k==='f'){if(q.fall){q.vy+=700*dt;q.y+=q.vy*dt;q.rs-=dt;if(q.rs<=0){q.fall=0;q.t=0;q.y=q.y0}}else if(q.t>0){q.t-=dt;if(q.t<=0){q.fall=1;q.vy=0;q.rs=3}}else if(!p.dead&&p.ground&&ov({x:p.x,y:p.y+p.h,w:p.w,h:2},q))q.t=.6}
 if(p.dead){p.vy+=900*dt;p.vx*=.92;move(p,p.vx*dt,p.vy*dt);p.dt-=dt;if(p.dt<=0&&!fdir){p.dt=99;restart()}}
 else{
  const dir=(keys.R?1:0)-(keys.L?1:0);p.inv-=dt;p.kb-=dt;p.sw-=dt;p.fcd-=dt;
  if(p.kb<=0){const tv=dir*100,a=(p.ground?900:600)*dt;p.vx=p.vx<tv?Math.min(tv,p.vx+a):Math.max(tv,p.vx-a);if(dir)p.face=dir}
  p.coy=p.ground?.1:p.coy-dt;p.buf=pressed.S?.12:p.buf-dt;
  if(!p.wings&&p.buf>0&&p.coy>0){p.vy=-310;p.buf=0;p.coy=0;SFX.jump()}
  if(!p.wings&&!keys.S&&p.vy<-110)p.vy=-110;
  if(pressed.A&&p.sw<=0){p.sw=.25;p.swid++;SFX.sword()}
  if(pressed.D&&p.fcd<=0){if(p.arrows>0){p.arrows--;G.arrows=p.arrows;p.fcd=.3;arrows.push({x:p.x+5+p.face*8,y:p.y+7,vx:p.face*230,w:8,h:3,l:1.5});SFX.arrow()}else{SFX.empty();pop('SIN FLECHAS',p.x-14,p.y-12,'#ff9a9a');p.fcd=.4}}
  if(p.wings&&p.kb<=0){const dy=(keys.Dn?1:0)-((keys.U||keys.S)?1:0),ty=dy?dy*85:25;p.vy+=clamp(ty-p.vy,-600*dt,600*dt)}else p.vy=Math.min(p.vy+(p.wings?400:1000)*dt,400);const pvy=p.vy,pg=p.ground;move(p,p.vx*dt,p.vy*dt);if(p.ground&&!pg&&pvy>140&&!p.wings)p.land=.12;p.land-=dt;p.x=clamp(p.x,0,L.w-p.w);if(p.wings)p.y=Math.max(p.y,0);p.wf+=Math.abs(p.vx)*dt*.12;
  if(p.ground&&p.kb<=0&&supAt(p.x+1,p.y+p.h+1)&&supAt(p.x+p.w-1,p.y+p.h+1)&&!L.E.some(e=>e.hp>0&&Math.abs(e.x-p.x)<50))p.safe={x:p.x,y:p.y};
  if(p.y>(L.h||H)+20){hurt(0,true);if(p.hp>0){p.x=p.safe.x;p.y=p.safe.y;p.vx=p.vy=0;p.kb=0}}
  if(p.sw>.1){const sb={x:p.face>0?p.x+p.w:p.x-18,y:p.y+1,w:18,h:14};for(const e of L.E)if(e.hp>0&&e.sid!==p.swid&&ov(sb,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){e.sid=p.swid;dmg(e,1,p.face)}if(L.boss&&L.boss.sid!==p.swid&&ov(sb,bossBox(L.boss))){L.boss.sid=p.swid;hitBoss(p.face)}}
  for(const g of L.gem)if(!g.got&&Math.abs(g.x-(p.x+5))<11&&Math.abs(g.y-(p.y+8))<13){g.got=1;fxs.push({k:'b',x:g.x,y:g.y,t:0});gemCount()}
  for(const c of L.ch)if(!c.open&&Math.abs(c.x+7-(p.x+5))<26&&Math.abs(c.y-(p.y+16))<24){c.open=1;c.t0=T;if(c.wings){p.wings=1;pop('¡ALAS DE VALQUIRIA!',c.x-100,c.y-24,'#bff3ff');pop('S o ↑ subir, ↓ bajar',c.x-100,c.y-12,'#fff')}else{p.arrows+=5;G.arrows=p.arrows;pop('+5 FLECHAS',c.x-10,c.y-20)}SFX.bonus();burst(c.x+7,c.y-6,'#ffd23f',10);fxs.push({k:'b',x:c.x+7,y:c.y-14,t:0})}
  for(const f of L.food)if(!f.got&&Math.abs(f.x+6-(p.x+5))<12&&Math.abs(f.y-(p.y+8))<14){f.got=1;p.hp=Math.min(p.max,p.hp+1);pop('+1 CORAZÓN',f.x-12,f.y-10,'#ff9a9a');SFX.bonus()}
  if((L.n===3?p.wings&&Math.abs(p.x-192)<50&&p.y<90:p.x>L.goal)&&!p.won){p.won=1;SFX.win();G.stage++;G.score+=500;setHi();persist();go(()=>scene(L.n))}
 }
 for(const e of L.E){if(e.dying>0){e.dying-=dt;continue}if(e.hp<=0)continue;e.hurt-=dt;
  if(e.t===1){const dx=P.x-e.x,near=Math.abs(dx)<90&&Math.abs(P.y+P.h-e.y)<24&&!P.dead;
   if(e.wind>0){e.wind-=dt;if(e.wind<=0)e.ch=.9}else if(e.ch>0){e.x+=e.d*115*dt;e.ch-=dt;if(e.x<e.x0||e.x>e.x1){e.ch=0;e.cd=1.2;e.x=clamp(e.x,e.x0,e.x1)}}
   else{e.cd-=dt;if(near&&e.cd<=0){e.d=dx>0?1:-1;e.wind=.35}else{e.x+=e.d*18*dt;if(e.x<e.x0||e.x>e.x1){e.d*=-1;e.x=clamp(e.x,e.x0,e.x1)}}}}
  else if(e.t===2){e.x+=e.d*32*dt;e.y=e.by+Math.sin(T*2.5+e.x*.05)*14;if(e.x<e.x0||e.x>e.x1){e.d*=-1;e.x=clamp(e.x,e.x0,e.x1)}}else{e.x+=e.d*24*dt;if(e.x<e.x0||e.x>e.x1){e.d*=-1;e.x=clamp(e.x,e.x0,e.x1)}}
  if(!P.dead&&ov(P,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h}))hurt(e.x<P.x?1:-1)}
 for(const a of arrows){a.x+=a.vx*dt;a.l-=dt;if(solidAt(a.x+(a.vx>0?8:0),a.y))a.l=0;for(const e of L.E)if(a.l>0&&e.hp>0&&ov(a,{x:e.x-e.w/2,y:e.y-e.h,w:e.w,h:e.h})){dmg(e,1,Math.sign(a.vx));a.l=0}}
 for(const a of arrows){const B=L.boss;if(B){if(B.h&&ov(a,{x:B.h.x-7,y:B.h.y-7,w:14,h:14})){a.l=0;burst(a.x,a.y,'#d5dde8',5)}if(a.l>0&&B.st!=='dead'&&ov(a,bossBox(B))){hitBoss(Math.sign(a.vx));a.l=0}}for(const bl of bolts)if(bl.t>0&&bl.t<.25&&Math.abs(a.x-bl.x)<8){a.l=0;burst(a.x,a.y,'#fff27a',5)}}
 arrows=arrows.filter(a=>a.l>0);if(L.boss)updateBoss(dt);
 if(L.n===3&&P.wings&&!P.dead){boltT-=dt;if(boltT<=0){boltT=1.7;bolts.push({x:clamp(P.x+(Math.random()-.5)*150,12,372),t:-.9})}}for(const b of bolts){b.t+=dt;if(b.t>0&&b.t<.25&&!P.dead&&Math.abs(P.x+5-b.x)<9)hurt(P.x<b.x?-1:1)}bolts=bolts.filter(b=>b.t<.3);
 fxs.forEach(q=>q.t+=dt);fxs=fxs.filter(q=>q.t<(q.k==='g'?.3:q.k==='h'?.5:.45));
 for(const q of parts){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=400*dt;q.l-=dt}parts=parts.filter(q=>q.l>0);
 for(const q of pops){q.y-=16*dt;q.l-=dt}pops=pops.filter(q=>q.l>0);
 cam=clamp(cam+((P.x+5+P.face*24-W/2)-cam)*Math.min(1,dt*6),0,L.w-W);camY=clamp(camY+((P.y+8-H/2)-camY)*Math.min(1,dt*6),0,(L.h||H)-H)}
/* ---------- RENDER ---------- */
function bg2(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#7ad8ff');g.addColorStop(.7,'#c8f0b0');g.addColorStop(1,'#5ac070');cx.fillStyle=g;cx.fillRect(0,0,W,H);rainbow(130-cam*.1,190,90,Math.PI*1.05,Math.PI*1.95,3);
 for(let i=0;i<6;i++)cloud(((i*170-cam*.15)%(W+120)+W+120)%(W+120)-60,14+(i%3)*18,1);
 const a=clamp((cam-1500)/700,0,1);if(a>0){cx.globalAlpha=a;castle(310,44,.6);if((T%3)<.1)bolt(310,0,46);cx.globalAlpha=1}
 for(let i=-1;i<8;i++){const idx=Math.floor(cam*.3/60)+i,x=idx*60-cam*.3;R(x+24,120,8,56,'#2a6a3a');cx.fillStyle='#2f8a4a';cx.beginPath();cx.arc(x+28,116-((idx*5)%3+3)%3*8,24,0,7);cx.fill()}
 for(let i=-1;i<5;i++){const idx=Math.floor(cam*.6/100)+i,x=idx*100-cam*.6;R(x+20,40,26,136,'#5a3a22');R(x+24,40,4,136,'#7a5232');cx.fillStyle='#1f7a3a';cx.beginPath();cx.arc(x+33,44,34,0,7);cx.arc(x+8,58,22,0,7);cx.arc(x+58,58,22,0,7);cx.fill();cx.fillStyle='#ff7ac0';R(x+12,52,3,3,'#ff7ac0');R(x+50,48,3,3,'#ffd23f')}}
function bg3(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e0a2a');g.addColorStop(1,'#3a2a7a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(let i=0;i<40;i++){const y=(((i*53-camY*.25)%H)+H)%H;if((Math.floor(T*2)+i)%5)R((i*97)%W,y,2,2,'#fff')}
 cx.globalAlpha=.25;for(let i=0;i<5;i++)cloud((i*90)%W,(((i*70-camY*.5)%H)+H)%H,2.5);cx.globalAlpha=1;if((T%4)<.1){R(0,0,W,H,'#ffffff33');bolt(60+(T|0)*40%260,0,H,'#fff')}}
function bg1(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#4aa8f0');g.addColorStop(.65,'#f4b06a');g.addColorStop(1,'#e8774a');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(let i=0;i<6;i++)cloud(((i*170-cam*.15)%(W+120)+W+120)%(W+120)-60,16+(i%3)*18,1);
 castle(290-cam*.04,50,.7);
 for(let i=-1;i<8;i++){const idx=Math.floor(cam*.3/64)+i,x=idx*64-cam*.3;cx.fillStyle='#4a6a8c';cx.beginPath();cx.moveTo(x,176);cx.lineTo(x+32,126-((idx*7)%3+3)%3*12);cx.lineTo(x+64,176);cx.fill()}
 for(let i=-1;i<5;i++){const idx=Math.floor(cam*.6/110)+i,x=idx*110-cam*.6+10,hh=38+((idx*5)%3+3)%3*8,y=176-hh;R(x,y,50,hh,'#5a3a4a');cx.fillStyle='#7a2a3a';cx.beginPath();cx.moveTo(x-5,y);cx.lineTo(x+25,y-18);cx.lineTo(x+55,y);cx.fill();R(x+10,y+12,7,7,'#ffcc55');R(x+32,y+12,7,7,'#ffcc55');
  if(idx%2===0){const f=Math.sin(T*12+idx);R(x+18,y-22-f*2,8,8+f*2,'#ff7a1a');R(x+20,y-20,4,5,'#ffe25a')}cx.globalAlpha=.3;for(let j=0;j<4;j++)R(x+20+Math.sin(T*2+j+idx)*4,y-30-j*11,8,8,'#555');cx.globalAlpha=1}}
function drawSolid(s){const x=s.x,y=s.y;if(hdSolid(s))return;if(L.n===4){R(x,y,s.w,s.h,s.k==='g'?'#3a2a5a':'#8a6aaa');R(x,y,s.w,2,'#d8c0ff');if(s.k==='g')for(let i=0;i<s.w;i+=24)R(x+i,y+2,1,s.h,'#2a1a4a');return}if(L.n===3){R(x,y,s.w,s.h>6?s.h:7,'#f4faff');R(x,y+(s.h>6?3:4),s.w,3,'#b8c8e8');R(x+4,y-3,s.w/3,4,'#fff');R(x+s.w/2,y-3,s.w/4,4,'#fff');return}
 if(s.k==='g'){R(x,y,s.w,s.h,'#6b4a2f');R(x,y,s.w,5,'#58c24a');R(x,y+5,s.w,2,'#3a8a34');for(let i=0;i<s.w;i+=16)for(let j=12;j<s.h;j+=8)R(x+i+(j%16?8:0),y+j,8,1,'#4d3520')}
 else if(s.k==='s'){R(x,y,s.w,s.h,'#8a8fa0');for(let j=0;j<s.h;j+=8){R(x,y+j,s.w,1,'#5a5f70');for(let i=(j%16?6:0);i<s.w;i+=12)R(x+i,y+j,1,8,'#5a5f70')}R(x,y,s.w,3,'#b4b9c8')}
 else if(s.k==='h'){R(x,y,s.w,s.h,'#e8c9a0');R(x,y+8,s.w,3,'#8a5a3a');for(let i=x+8;i<x+s.w-14;i+=26){R(i,y+16,10,10,'#4a3a2a');R(i+1,y+17,8,8,'#7ad0ff');R(i+4,y+17,1,8,'#4a3a2a')}
  R(x+s.w-20,y+16,12,24,'#6a3b1e');R(x-5,y-2,s.w+10,10,'#b03a2e');for(let i=x-5;i<x+s.w+5;i+=6)R(i,y-2,3,10,'#8a2a22');R(x-5,y-4,s.w+10,2,'#e05a4a')}
 else if(s.k==='f'){if(s.fall&&s.y>H+10)return;const o=s.t>0&&!s.fall?Math.round(Math.sin(T*60)):0;R(x+o,y,s.w,s.h,'#8a5a2a');R(x+o,y-2,s.w,3,'#3a9a3a');R(x+o+4,y+s.h,3,3,'#6a3b1e')}
 else{R(x,y,s.w,s.h,'#a8682f');R(x,y+s.h-2,s.w,2,'#6a3b1e');for(let i=8;i<s.w;i+=12)R(x+i,y,1,s.h,'#8a5224')}}
function drawPlayer(){const p=P;if(p.inv>0&&!p.dead&&Math.floor(T*20)%2)return;if(hdOK()){const fl=p.face<0,cxp=p.x+p.w/2,by=p.y+p.h+1,walking=p.ground&&Math.abs(p.vx)>10,wk=walking&&walkOK(),lift=walking&&!wk?Math.abs(Math.sin(p.wf*Math.PI))*1.5:0;
 if(p.wings){const wy=Math.sin(T*14)*3,bx=fl?cxp+3:cxp-12;R(bx,p.y-3+wy,9,6,'#fff');R(bx+(fl?6:-4),p.y-6+wy,6,4,'#bff3ff');R(bx+(fl?3:0),p.y+3+wy,8,4,'#eaf6ff')}
 let im=wk?WALK[Math.floor(p.wf*.8)%6]:HDI;if(jumpOK()&&!p.wings){if(!p.ground){const v=p.vy;im=JUMP[v<-80?1:v<40?2:v<170?3:4]}else if(p.land>0&&!walking)im=JUMP[0]}
 const atk=p.sw>0&&!p.wings&&atkOK();if(atk){const q=1-p.sw/.25;im=ATK[q<.2?0:q<.5?1:q<.75?2:3]}
 if(!p.wings&&!atk&&p.fcd>0&&p.fcd<=.3&&okS(ARC)){const q=1-p.fcd/.3;im=ARC[q<.3?1:q<.7?2:0]}
 if(p.wings&&okS(FLY))im=FLY[[0,1,2,1][Math.floor(T*8)%4]];
 if(okS(DMG)){if(p.dead)im=DMG[p.ground?3:1];else if(p.kb>0)im=DMG[p.kb>.12?0:2]}
 isiHD(cxp,by-lift,fl,1,im);
 if(p.sw>0&&!atk){const q=1-p.sw/.25,s0=-1.2,s1=s0+2.2*q,c0=cxp+(fl?-8:8),cy=p.y+8;cx.strokeStyle='#fff';cx.lineWidth=2;cx.globalAlpha=.85;cx.beginPath();if(fl)cx.arc(c0,cy,17,Math.PI-s1,Math.PI-s0);else cx.arc(c0,cy,17,s0,s1);cx.stroke();cx.globalAlpha=.4;cx.beginPath();if(fl)cx.arc(c0,cy,12,Math.PI-s1,Math.PI-s0);else cx.arc(c0,cy,12,s0,s1);cx.stroke();cx.globalAlpha=1}
 return}
 if(p.wings){const wy=Math.sin(T*14)*3,wx=p.face<0?p.x+9:p.x-8;R(wx,p.y+3+wy,7,4,'#fff');R(wx+(p.face<0?3:-3),p.y+1+wy,4,3,'#bff3ff')}const fr=!p.ground||p.wings&&!p.ground?'j':p.ground&&Math.abs(p.vx)>10?(Math.floor(p.wf)%2?'a':'b'):'st',f=p.face<0,x=p.x-1,y=p.y;
 draw(ISI[fr],x,y,f);
 if(p.sw>0){const q=1-p.sw/.25,fx=f?x-14:x+12;if(q<.4){R(fx+(f?10:0),y-2,2,12,'#d5dde8');R(fx+(f?10:0),y-4,2,2,'#fff')}else{R(f?x-8:x+11,y+7,16,2,'#d5dde8');R(f?x-8:x+11,y+6,16,1,'#fff');if(q<.8){cx.globalAlpha=.6;R(f?x-14:x+22,y+1,3,14,'#fff');cx.globalAlpha=1}}}}
function hud(){const ok=okI(HUDH)&&okI(HUDE)&&okI(HUDC)&&okI(HUDD)&&okI(HUDA);
 if(ok){for(let i=0;i<P.max;i++)dI(i<P.hp?HUDH:HUDE,11+i*11,10);dI(HUDC,W-42,10);txt('x'+G.credits,W-34,6,8,'#ffd23f');dI(HUDD,11,24);txt('x'+G.gems,20,20,8);dI(HUDA,52,24);txt('x'+P.arrows,60,20,8);txt(String(G.score).padStart(6,'0'),W-6,19,8,'#fff','right')}
 else{for(let i=0;i<P.max;i++)draw(i<P.hp?HRT:HRE,6+i*10,6);
 txt('CRÉD x'+G.credits,W-6,6,8,'#ffd23f','right');draw(GEM,6,18);txt('x'+G.gems,17,17,8);R(48,20,12,2,'#b0804a');R(58,19,3,4,'#d5dde8');txt('x'+P.arrows,64,17,8);txt(String(G.score).padStart(6,'0'),W-6,17,8,'#fff','right')}}
function renderPlay(){bgHD()||(L.n===4?bg4():L.n===3?bg3():L.n===2?bg2():bg1());cx.save();cx.translate(-Math.round(cam),-Math.round(camY));if(L.n===3){castle(192,52,1.5);R(186,67,12,18,'#ffd86a')}
 for(const s of L.sol)if(s.x+s.w>cam-20&&s.x<cam+W+20)drawSolid(s);
if(L.n===2){R(L.goal+20,50,30,126,'#5a3a22');cx.fillStyle='#1f7a3a';cx.beginPath();cx.arc(L.goal+35,50,40,0,7);cx.fill();txt('¡MIRA!',L.goal+10,100,8,'#fff','center')}else{if(okI(TX.casa_super))isiHD(2442,176,false,1,TX.casa_super);else{R(2400,112,84,64,'#e8c9a0');R(2394,102,96,12,'#b03a2e');cx.fillStyle='#b03a2e';cx.beginPath();cx.moveTo(2400,102);cx.lineTo(2442,80);cx.lineTo(2484,102);cx.fill();R(2428,136,24,40,'#ffd86a');R(2432,140,16,36,'#fff2b0');R(2408,126,12,12,'#7ad0ff');R(2464,126,12,12,'#7ad0ff')}if(okS(VILL)){[2408,2436,2464].forEach((x,i)=>isiHD(x,176-Math.abs(Math.sin(T*4+i*1.7))*2,false,1,VILL[i]))}else{draw(VIL,2456,164,0);draw(VIL,2466,164,1)}txt('¡SIGUE!',2442,60,8,'#fff','center')}
 for(const c of L.ch){const cs=c.wings?CHW:CHN,hdC=okS(cs);if(hdC)isiHD(c.x+7,c.y,false,1,cs[c.open?1:0]);else if(sOK('arcon')&&sOK('arcon_abierto'))spH(c.open?'arcon_abierto':'arcon',c.x+7,c.y,false);else draw(c.open?CHO:CH,c.x,c.y-7);if(c.open&&!hdC){cx.globalAlpha=.4+.3*Math.sin(T*8);R(c.x+3,c.y-24,8,6,'#fff27a');cx.globalAlpha=1}if(c.wings&&c.open&&T-c.t0<1.6&&okI(ALAS)){cx.globalAlpha=Math.max(0,1-(T-c.t0)/1.6);dI(ALAS,c.x+7,c.y-30-(T-c.t0)*14);cx.globalAlpha=1}}
 for(const f of L.food)if(!f.got){if(okI(HOT))dI(HOT,f.x+6,f.y-3+Math.sin(T*4+f.x)*2);else draw(DOG,f.x,f.y-4+Math.sin(T*4+f.x)*2)}
 for(const g of L.gem)if(!g.got){if(okS(DIA))dI(DIA[Math.floor(T*3+g.x*.1)%6===0?1:0],g.x,g.y+Math.sin(T*5+g.x)*1.5);else draw(GEM,g.x-4,g.y-4+Math.sin(T*5+g.x)*1.5)}
 for(const e of L.E){if(e.hp<=0&&e.dying<=0)continue;const fl=e.d<0;cx.globalAlpha=e.hp<=0?e.dying/.4:1;const bob=e.t&&e.ch>0?0:Math.abs(Math.sin(T*8+e.x))*1.5;
  if(e.hurt>0&&Math.floor(T*30)%2)cx.globalAlpha=.4;const hdE=e.t===1?okS(BOARW)&&okS(BOARC):e.t===2?okS(WPIG):okS(PIGW)&&okS(PIGD);if(hdE){let im;if(e.hp<=0&&e.t===0)im=PIGD[e.dying>.27?0:e.dying>.13?1:2];else if(e.t===1)im=e.ch>0?BOARC[Math.floor(T*14)%3]:BOARW[Math.floor(T*8+e.x*.05)%4];else if(e.t===2)im=WPIG[Math.floor(T*10)%4];else im=PIGW[Math.floor(T*10+e.x*.05)%8];isiHD(e.x,e.y,fl,1,im)}else if(sOK('cerdo_comun')&&sOK('cerdo_guerrero')){const hh=spH(e.t===1?'cerdo_guerrero':'cerdo_comun',e.x,e.y-bob,fl,.5);if(e.t===2){const wy=Math.sin(T*20)*3,bx=fl?e.x+1:e.x-11;R(bx,e.y-hh+2+wy,10,5,'#fff');R(bx+(fl?6:-3),e.y-hh-1+wy,6,4,'#eaf6ff')}}else{draw(e.t===1?PIGB:PIGS,e.x-6,e.y-9-bob,fl);if(e.t===1){R(e.x+(fl?-1:-5),e.y-12-bob,6,3,'#8c96a6');R(e.x+(fl?4:-6),e.y-14-bob,2,3,'#fff')}}
  if(e.t===2&&!hdE&&!(sOK('cerdo_comun')&&sOK('cerdo_guerrero'))){const wy=Math.sin(T*20)*3;R(e.x-7,e.y-13+wy,7,3,'#fff');R(e.x-2,e.y-15+wy,3,3,'#eaf6ff')}if(e.wind>0){txt('!',e.x-3,e.y-28,10,'#ff4040','left')}cx.globalAlpha=1}
if(L.boss){const b=L.boss;if(b.st==='dead')cx.globalAlpha=Math.min(1,b.t/.7);else if(b.hurt>0&&Math.floor(T*30)%2)cx.globalAlpha=.5;const fl=b.d<0,sh=b.st==='dead'?Math.round(Math.sin(T*50)*2):0;
  if(b.st==='wind')R(b.x-20,140,40,36,'#ff40404a');if(b.st==='sum')R(b.x-18,126,36,6,'#fff27a');
  if(okS(PHK)&&okS(PHKD)){let im=PHK[0];if(b.st==='dead'){const pr=1-b.t/2.6;im=PHKD[pr<.3?0:pr<.65?1:2]}else if(b.hurt>0)im=PHK[3];else if(b.st==='throw'&&b.h)im=PHK[1];else if(b.st==='sum'||b.st==='rest')im=PHK[2];isiHD(b.x+sh,176,fl,1,im)}else phork(b.x+(fl?18:-18)+sh,149,3,fl,!!b.h);cx.globalAlpha=1;if(b.st==='wind'||b.st==='sum')txt('!',b.x-3,108,12,'#ff4040','left');
  if(b.h){if(okS(HAM)){const im=HAM[Math.floor(T*16)%4],w=im.width/SC,h=im.height/SC;cx.drawImage(im,Math.round((b.h.x-w/2)*SC)/SC,Math.round((b.h.y-h/2)*SC)/SC,w,h)}else{cx.save();cx.translate(b.h.x,b.h.y);cx.rotate(T*18);R(-7,-4,14,8,'#8c96a6');R(-1,-8,2,16,'#8a5530');cx.restore()}}}
 for(const a of arrows){if(ARW.complete&&ARW.naturalWidth>0){const w=ARW.naturalWidth/SC,h=ARW.naturalHeight/SC;if(a.vx<0){cx.save();cx.translate(Math.round(a.x*SC)/SC+w,a.y-h/2);cx.scale(-1,1);cx.drawImage(ARW,0,0,w,h);cx.restore()}else cx.drawImage(ARW,Math.round(a.x*SC)/SC,a.y-h/2,w,h)}else{R(a.x,a.y,8,1,'#b0804a');R(a.vx>0?a.x+7:a.x-1,a.y-1,2,3,'#d5dde8')}}
 drawPlayer();for(const b of bolts){if(okS(AVI)&&okS(RAY)){if(b.t<0)dT(AVI[Math.floor(T*10)%2],b.x-14,camY,28,H);else dT(RAY[b.t<.08?0:b.t<.18?1:2],b.x-16,camY,32,H)}else if(b.t<0){if(Math.floor(T*14)%2)R(b.x-1,camY,2,H,'#ffe25a88')}else{R(b.x-4,camY,8,H,'#ffffff66');bolt(b.x,camY,camY+H)}}for(const q of fxs){const F_=q.k==='g'?FXG:q.k==='h'?FXH:FXB,d=q.k==='g'?.3:q.k==='h'?.5:.45;if(okS(F_))dI(F_[Math.min(3,Math.floor(q.t/d*4))],q.x,q.y)}for(const q of parts)R(q.x,q.y,2,2,q.c);for(const q of pops)txt(q.s,q.x,q.y,8,q.c);cx.restore();hud();if(L.boss){txt('PHORK',W/2-62,H-16,8,'#ff9a9a');for(let i=0;i<12;i++)draw(i<L.boss.hp?HRT:HRE,W/2-14+i*9,H-16)}
 if(bannerT>0){cx.globalAlpha=Math.min(1,bannerT);txt(L.name,W/2,40,8,'#ffd23f','center');txt(L.sub,W/2,54,8,'#fff','center');cx.globalAlpha=1}}
function menuDraw(){MENU.forEach((m,i)=>{const on=i===sel;if(on){R(W/2-90,MY+i*15-2,180,14,'#ffffff22');draw(HRT,W/2-84,MY+i*15)}txt(m.t,W/2,MY+i*15,8,on?'#ffd23f':'#fff','center')})}
function titleDraw(){if(okI(PORT)&&okI(LOGO)){dT(PORT,0,0,W,H);const lw=130,lh=LOGO.naturalHeight/LOGO.naturalWidth*lw;dT(LOGO,W/2-lw/2,1,lw,lh);R(W/2-100,MY-8,200,MENU.length*15+14,'#1b1024cc');menuDraw();if(hi())txt('RÉCORD '+hi(),W-6,H-10,8,'#ffd23f','right');txt('M: música',6,H-10,8,'#fff','left')}else titleDrawOld()}
function titleDrawOld(){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a98ee');g.addColorStop(1,'#bfe6ff');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 R(0,0,W,H,((T%4)<.1)?'#ffffff55':'#0000');for(let i=0;i<4;i++)cloud(((i*140+T*6)%(W+80))-40,20+(i%2)*40,1.3);
 rainbow(190,230,180,Math.PI*1.02,Math.PI*1.62);castle(262,92+Math.sin(T*1.5)*3,1);if((T%4)<.1)bolt(318,0,80);
 cx.fillStyle='#3e9e3c';cx.beginPath();cx.moveTo(0,H);cx.lineTo(0,176);cx.quadraticCurveTo(100,160,200,184);cx.quadraticCurveTo(300,168,W,180);cx.lineTo(W,H);cx.fill();R(0,200,W,16,'#6b4a2f');R(0,198,W,3,'#58c24a');
 if(!okP()){draw(ISI.st,16,198-64+Math.sin(T*3)*1.5,0,4);R(70,208-28,3,20,'#d5dde8')}phork(342,192,4,1);draw(PIGS,100,190,0,1.5);draw(PIGS,126,190,0,1.5);draw(PIGB,254,190,1,1.5);draw(PIGS,276,190,1,1.5);
 otxt('PRINCESA',W/2,8,22,'#ff7ac0','#3a1060');otxt('ISIDORA',W/2,32,28,'#ffffff','#7a2ab0');otxt('VS LOS CHANCHOS',W/2,66,12,'#ffd23f','#5a2d18');
 R(W/2-100,MY-8,200,MENU.length*15+14,'#1b1024cc');menuDraw();if(hi())txt('RÉCORD '+hi(),W-6,H-10,8,'#ffd23f','right');txt('M: música',6,H-10,8,'#fff','left')}
function panel(lines,title){cx.fillStyle='#1b1024';cx.fillRect(0,0,W,H);R(6,6,W-12,H-12,'#2a1a4a');txt(title,W/2,16,12,'#ffd23f','center');lines.forEach((l,i)=>txt(l,24,42+i*13,8,'#fff'));txt('Pulsa cualquier botón',W/2,H-20,8,'#ff7ac0','center')}
function sceneDraw(){const sc=SCENES[sceneI],n=Math.floor((T-sceneT)*40);
 const SI=[ESC[0],ESC[1],PORT,ESC[2]][sceneI];if(okI(SI))dT(SI,0,0,W,H);else if(sc.d===0){const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#3a1a4a');g.addColorStop(.6,'#e8602a');g.addColorStop(1,'#ffb040');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  for(let i=0;i<7;i++){const x=150+i*34,h=40+(i*13%4)*10;R(x,170-h,28,h,'#2a1020');cx.fillStyle='#2a1020';cx.beginPath();cx.moveTo(x-3,170-h);cx.lineTo(x+14,150-h);cx.lineTo(x+31,170-h);cx.fill();const f=Math.sin(T*10+i);R(x+8,150-h-f*3,10,14+f*3,'#ff7a1a');R(x+11,156-h,4,8,'#ffe25a');cx.globalAlpha=.35;for(let j=0;j<4;j++)R(x+8+Math.sin(T+j+i)*5,140-h-j*14,9,9,'#444');cx.globalAlpha=1}
  cx.fillStyle='#1a3a1a';cx.beginPath();cx.moveTo(0,H);cx.lineTo(0,150);cx.quadraticCurveTo(90,130,200,172);cx.lineTo(W,172);cx.lineTo(W,H);cx.fill();bigI(58,158,0,2)}
 else{const g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a1a4a');g.addColorStop(1,'#5a3a8a');cx.fillStyle=g;cx.fillRect(0,0,W,H);rainbow(200,200,150,Math.PI*1.1,Math.PI*1.6,4);castle(250,70+Math.sin(T)*3,1.3);if((T%2.5)<.12){R(0,0,W,H,'#ffffff44');bolt(250,0,60)}
  for(let i=0;i<14;i++){const x=i*30;cx.fillStyle='#0e2a1a';cx.beginPath();cx.moveTo(x-6,176);cx.lineTo(x+10,100+(i*17%5)*10);cx.lineTo(x+26,176);cx.fill()}R(0,170,W,50,'#0e2a1a');bigI(68,148,0,2)}
 R(10,146,W-20,62,'#1b1024ee');R(10,146,W-20,2,'#ffd23f');R(10,206,W-20,2,'#ffd23f');wrap(sc.t.slice(0,n),W-44).forEach((l,i)=>txt(l,22,154+i*12,8));if(n>=sc.t.length&&Math.floor(T*2)%2)txt('▼',W-24,194,8,'#ffd23f')}
function render(){cx.setTransform(SC,0,0,SC,0,0);cx.imageSmoothingEnabled=false;
 if(S==='title')titleDraw();
 else if(S==='help')panel(['← →  Moverse','S  Saltar (mantén para saltar más alto)','A  Atacar con la espada','D  Disparar flecha (necesitas flechas)','ESC / P  Pausa     M  Música','','Abre los arcones acercándote a ellos.','Los completos recuperan 1 corazón.','50 diamantes = 1 crédito extra.','En pantalla táctil usa los botones.'],'INSTRUCCIONES');
 else if(S==='cred')panel(['Princesa Isidora vs los Chanchos','','Concepto e historia: tu idea original','Programación: Claude (Anthropic)','Arte: pixel art dibujado con Canvas','Música y sonidos: sintetizados en código','','"La valentía también se hereda"'],'CRÉDITOS');
 else if(S==='scene')sceneDraw();
 else if(S==='soon'){cx.fillStyle='#1b1024';cx.fillRect(0,0,W,H);otxt('¡ETAPA '+(G.stage-1)+' COMPLETA!',W/2,30,14,'#ffd23f','#7a2ab0');txt('Diamantes: '+G.gems+'   Créditos: '+G.credits,W/2,70,8,'#fff','center');txt('Puntos: '+G.score,W/2,84,8,'#fff','center');txt('Próxima: ETAPA IV  CASTILLO ARCOÍRIS',W/2,112,8,'#7aff9a','center');txt('(en desarrollo)',W/2,126,8,'#fff','center');menuDraw()}
 else if(S==='end')endDraw();
 else if(S==='over'){cx.fillStyle='#1b1024';cx.fillRect(0,0,W,H);otxt('FIN DEL JUEGO',W/2,40,16,'#ff5a5a','#3a1060');txt('Sin créditos. Puntos: '+G.score,W/2,86,8,'#fff','center');txt('Récord: '+hi(),W/2,100,8,'#ffd23f','center');menuDraw()}
 else if(S==='play'){renderPlay();if(paused){R(0,0,W,H,'#000a');txt('PAUSA',W/2,70,16,'#ffd23f','center');menuDraw()}}
 if(PI){const on=okP()&&S==='title'&&!okI(PORT);PI.style.display=on?'block':'none';if(on){PI.style.opacity=Math.max(0,1-fade);PI.style.transform='translateY('+(Math.sin(T*3)*-1.2)+'%)'}}
 if(fade>0)R(0,0,W,H,'rgba(0,0,0,'+fade+')')}
/* ---------- BUCLE ---------- */
titleMenu();let last=performance.now(),acc=0;
function frame(now){acc+=Math.min(.1,(now-last)/1000);last=now;while(acc>=1/60){T+=1/60;update(1/60);for(const k in pressed)delete pressed[k];acc-=1/60}render();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
