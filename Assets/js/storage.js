(() => {
  const KEY='arcadePro:v3';
  const defaults={profile:{name:'Jogador',avatar:'🎮',favorite:'snake'},xp:0,coins:150,plays:0,wins:0,time:0,lastGame:'snake',theme:'neon',sound:true,music:false,volume:.7,achievements:[],gamePlays:{},ownedSkins:['classic'],equippedSkin:'classic',missions:{date:'',progress:{play3:0,score50:0,explore2:0},claimed:[]}};
  const clone=o=>JSON.parse(JSON.stringify(o));
  function merge(base,data){const out={...base,...data};out.profile={...base.profile,...(data.profile||{})};out.missions={...base.missions,...(data.missions||{}),progress:{...base.missions.progress,...((data.missions||{}).progress||{})}};out.ownedSkins=Array.isArray(data.ownedSkins)?data.ownedSkins:base.ownedSkins;return out}
  function load(){try{return merge(clone(defaults),JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('arcadePro:v2')||'{}'))}catch{return clone(defaults)}}
  let state=load();
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  window.ArcadeStore={get:()=>state,set(p){state=merge(state,p);save();return state},update(fn){fn(state);save();return state},reset(){state=clone(defaults);save();return state}};
})();