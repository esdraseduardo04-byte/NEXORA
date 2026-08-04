(() => {
 const names={snake:'Snake Neon',ttt:'Jogo da Velha',memory:'Memória',pong:'Pong',quiz:'Quiz Rápido',breakout:'Breakout',whack:'Whack-a-Mole',simon:'Simon',game2048:'2048',dodge:'Neon Dodge',reaction:'Reflexo Turbo',connect4:'Conecta 4'};
 const achievements=[
  {id:'first',icon:'🚀',title:'Primeira partida',desc:'Abra seu primeiro jogo',test:s=>s.plays>=1},
  {id:'explorer',icon:'🧭',title:'Explorador',desc:'Jogue cinco jogos diferentes',test:s=>Object.keys(s.gamePlays||{}).length>=5},
  {id:'snake20',icon:'🐍',title:'Serpente Neon',desc:'Faça 20 pontos no Snake',test:()=>getRecordSafe('snake')>=20},
  {id:'simon10',icon:'🎵',title:'Memória sonora',desc:'Alcance nível 10 no Simon',test:()=>getRecordSafe('simon')>=10},
  {id:'2048',icon:'🔢',title:'Mestre dos números',desc:'Alcance 2048 pontos',test:()=>getRecordSafe('2048')>=2048},
  {id:'veteran',icon:'🏆',title:'Veterano',desc:'Jogue 50 partidas',test:s=>s.plays>=50},
  {id:'collector',icon:'🎨',title:'Colecionador',desc:'Desbloqueie três skins',test:s=>(s.ownedSkins||[]).length>=3},
  {id:'dodge100',icon:'🚀',title:'Piloto Neon',desc:'Faça 100 pontos no Neon Dodge',test:()=>getRecordSafe('dodge')>=100}
 ];
 let audioCtx,sessionStart=Date.now(),paused=false;
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 function getRecordSafe(k){try{return Number(localStorage.getItem('jogosOffline:'+k)||0)}catch{return 0}}
 function level(xp){return Math.floor(Math.sqrt(xp/100))+1} function levelStart(l){return (l-1)*(l-1)*100} function nextLevel(l){return l*l*100}
 function beep(type='click'){const s=ArcadeStore.get();if(!s.sound)return;try{audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);const map={click:420,score:660,win:880,unlock:1040};o.frequency.value=map[type]||420;g.gain.value=.055*s.volume;o.start();g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.12);o.stop(audioCtx.currentTime+.13)}catch{}}
 function toast(title,desc=''){const el=document.createElement('div');el.className='toast';el.innerHTML=`<strong>${title}</strong>${desc?`<small>${desc}</small>`:''}`;$('#toast-stack').append(el);setTimeout(()=>el.remove(),3200)}
 function unlock(){const s=ArcadeStore.get();for(const a of achievements){if(!s.achievements.includes(a.id)&&a.test(s)){ArcadeStore.update(v=>{v.achievements.push(a.id);v.coins+=50;v.xp+=75});beep('unlock');toast('Conquista desbloqueada',`${a.icon} ${a.title} · +75 XP · +50 moedas`)}}}
 function render(){const s=ArcadeStore.get(),l=level(s.xp),start=levelStart(l),next=nextLevel(l),pct=Math.max(0,Math.min(100,(s.xp-start)/(next-start)*100));
  $('#profile-avatar').textContent=s.profile.avatar;$('#profile-name').textContent=s.profile.name;$('#profile-level').textContent=`Nível ${l} · ${s.xp} XP`;$('#profile-progress').style.width=pct+'%';$('#stat-xp').textContent=s.xp.toLocaleString('pt-BR');$('#stat-coins').textContent=s.coins.toLocaleString('pt-BR');$('#stat-achievements').textContent=`${s.achievements.length}/${achievements.length}`;$('#stat-plays').textContent=s.plays;$('#continue-name').textContent=names[s.lastGame]||names.snake;$('#continue-record').textContent=`Recorde: ${getRecordSafe(s.lastGame)}`;document.body.dataset.theme=s.theme||'neon';
  $$('.theme-chip').forEach(b=>b.classList.toggle('active',b.dataset.theme===s.theme));$$('.avatar-chip').forEach(b=>b.classList.toggle('active',b.dataset.avatar===s.profile.avatar));
  $('#profile-input').value=s.profile.name;$('#favorite-select').value=s.profile.favorite;$('#sound-toggle').checked=s.sound;$('#music-toggle').checked=s.music;$('#volume-range').value=s.volume;
  $('#achievement-list').innerHTML=achievements.map(a=>`<div class="achievement ${s.achievements.includes(a.id)?'unlocked':''}"><span class="achievement-icon">${a.icon}</span><span><strong>${a.title}</strong><small>${a.desc}</small></span></div>`).join('');
 }
 function reward(xp=10,coins=2){ArcadeStore.update(s=>{s.xp+=xp;s.coins+=coins});unlock();render()}

 const skins=[
  {id:'classic',name:'Clássica',icon:'🐍',price:0},{id:'plasma',name:'Plasma',icon:'⚡',price:120},{id:'cybercat',name:'Cyber Cat',icon:'🐱',price:180},{id:'dragon',name:'Dragão',icon:'🐉',price:260},{id:'ghost',name:'Fantasma',icon:'👻',price:320}
 ];
 const missions=[
  {id:'play3',title:'Arcade diário',desc:'Jogue 3 partidas',goal:3,reward:60},
  {id:'score50',title:'Caçador de pontos',desc:'Supere 50 pontos em qualquer recorde',goal:1,reward:80},
  {id:'explore2',title:'Explorador',desc:'Jogue 2 jogos diferentes hoje',goal:2,reward:70}
 ];
 function dailyReset(){const today=new Date().toISOString().slice(0,10),s=ArcadeStore.get();if(s.missions.date!==today)ArcadeStore.update(v=>v.missions={date:today,progress:{play3:0,score50:0,explore2:0},claimed:[],games:[]})}
 function renderShop(){const s=ArcadeStore.get();$('#shop-list').innerHTML=skins.map(k=>{const owned=s.ownedSkins.includes(k.id),equipped=s.equippedSkin===k.id;return `<div class="shop-item"><span class="skin-preview skin-${k.id}">${k.icon}</span><span><strong>${k.name}</strong><small>${owned?'Desbloqueada':k.price+' moedas'}</small></span><button data-buy="${k.id}" ${equipped?'disabled':''}>${equipped?'Equipada':owned?'Equipar':'Comprar'}</button></div>`}).join('');$$('[data-buy]').forEach(b=>b.onclick=()=>buySkin(b.dataset.buy));}
 function buySkin(id){const k=skins.find(x=>x.id===id),s=ArcadeStore.get();if(s.ownedSkins.includes(id)){ArcadeStore.update(v=>v.equippedSkin=id);toast('Skin equipada',k.name)}else if(s.coins>=k.price){ArcadeStore.update(v=>{v.coins-=k.price;v.ownedSkins.push(id);v.equippedSkin=id});toast('Nova skin desbloqueada',k.name);beep('unlock')}else toast('Moedas insuficientes','Jogue mais para ganhar moedas');render();renderShop();unlock()}
 function renderMissions(){dailyReset();const s=ArcadeStore.get();$('#mission-list').innerHTML=missions.map(m=>{const n=Math.min(m.goal,s.missions.progress[m.id]||0),done=n>=m.goal,claimed=s.missions.claimed.includes(m.id);return `<div class="mission-item"><span><strong>${m.title}</strong><small>${m.desc} · ${n}/${m.goal}</small><span class="mission-bar"><i style="width:${n/m.goal*100}%"></i></span></span><button data-claim="${m.id}" ${!done||claimed?'disabled':''}>${claimed?'Recebido':'+'+m.reward+' 🪙'}</button></div>`}).join('');$$('[data-claim]').forEach(b=>b.onclick=()=>claimMission(b.dataset.claim));}
 function claimMission(id){const m=missions.find(x=>x.id===id),s=ArcadeStore.get();if((s.missions.progress[id]||0)>=m.goal&&!s.missions.claimed.includes(id)){ArcadeStore.update(v=>{v.missions.claimed.push(id);v.coins+=m.reward;v.xp+=m.reward});toast('Missão concluída',`+${m.reward} moedas e XP`);render();renderMissions()}}
 function openHub(tab='missions'){dailyReset();$('#hub-modal').classList.add('open');$('#hub-title').textContent=tab==='shop'?'Loja de skins':'Missões diárias';$('#shop-list').hidden=tab!=='shop';$('#mission-list').hidden=tab==='shop';renderShop();renderMissions()}
 window.Arcade={
  onGameOpen(game){dailyReset();ArcadeStore.update(s=>{s.lastGame=game;s.plays++;s.gamePlays[game]=(s.gamePlays[game]||0)+1;s.missions.progress.play3=(s.missions.progress.play3||0)+1;s.missions.games=s.missions.games||[];if(!s.missions.games.includes(game)){s.missions.games.push(game);s.missions.progress.explore2=s.missions.games.length}});reward(8,2);beep('click')},
  onRecord(key,value,old){if(value>=50)ArcadeStore.update(s=>s.missions.progress.score50=1);const gain=Math.max(10,Math.min(120,(value-old)*4));reward(gain,Math.ceil(gain/8));beep('score');toast('Novo recorde!',`${value} pontos · +${gain} XP`)},beep,reward
 };
 function openSettings(){render();$('#profile-modal').classList.add('open')} function closeSettings(){$('#profile-modal').classList.remove('open')}
 function togglePause(force){paused=typeof force==='boolean'?force:!paused;document.body.classList.toggle('paused',paused);$('#pause-label').textContent=paused?'Continuar':'Pausar'}
 function saveProfile(){const name=$('#profile-input').value.trim().slice(0,18)||'Jogador',favorite=$('#favorite-select').value,avatar=$('.avatar-chip.active')?.dataset.avatar||'🎮';ArcadeStore.update(s=>{s.profile={name,avatar,favorite};s.sound=$('#sound-toggle').checked;s.music=$('#music-toggle').checked;s.volume=Number($('#volume-range').value)});closeSettings();render();toast('Perfil salvo','Suas preferências foram atualizadas')}
 function randomGame(){const keys=Object.keys(names);openGame(keys[Math.floor(Math.random()*keys.length)])}
 function fullscreen(){const panel=$('.modal-panel');if(!document.fullscreenElement)panel.requestFullscreen?.();else document.exitFullscreen?.()}
 function init(){dailyReset();render();unlock();renderShop();renderMissions();$('#profile-card').onclick=openSettings;$('#close-profile').onclick=closeSettings;$('#save-profile').onclick=saveProfile;$('#continue-btn').onclick=()=>openGame(ArcadeStore.get().lastGame);$('#random-btn').onclick=randomGame;$('#records-btn').onclick=openSettings;$('#settings-btn').onclick=openSettings;$('#shop-btn').onclick=()=>openHub('shop');$('#missions-btn').onclick=()=>openHub('missions');$('#close-hub').onclick=()=>$('#hub-modal').classList.remove('open');$('#pause-btn').onclick=()=>togglePause();$('#fullscreen-btn').onclick=fullscreen;$('#resume-btn').onclick=()=>togglePause(false);$('#profile-modal').onclick=e=>{if(e.target.id==='profile-modal')closeSettings()};
  $$('.theme-chip').forEach(b=>b.onclick=()=>{ArcadeStore.update(s=>s.theme=b.dataset.theme);render();beep()});$$('.avatar-chip').forEach(b=>b.onclick=()=>{$$('.avatar-chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');beep()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&!$('#game-modal').classList.contains('hidden'))togglePause(true)});
  document.addEventListener('click',()=>{if(audioCtx?.state==='suspended')audioCtx.resume()},{once:true});
  window.addEventListener('beforeunload',()=>ArcadeStore.update(s=>s.time+=Math.floor((Date.now()-sessionStart)/1000)));
 }
 document.addEventListener('DOMContentLoaded',init);
})();
