function init2048(container) {
      const status=document.createElement('p');status.className='text-purple-300 font-bold text-lg';status.textContent='Pontos: 0';
      const grid=document.createElement('div');grid.className='grid grid-cols-4 gap-1 p-2 rounded-lg';grid.style.background='#2d1b69';
      let board=Array(16).fill(0),pts=0;const record=document.createElement('span');record.className='record-badge';record.textContent='Recorde: '+getRecord('2048');
      const tileColors={0:'#1a1a2e',2:'#6b21a8',4:'#7c3aed',8:'#a855f7',16:'#c084fc',32:'#ec4899',64:'#f43f5e',128:'#f59e0b',256:'#eab308',512:'#22c55e',1024:'#06b6d4',2048:'#3b82f6'};
      function hasMoves(){if(board.includes(0))return true;for(let r=0;r<4;r++)for(let c=0;c<4;c++){const i=r*4+c;if(c<3&&board[i]===board[i+1])return true;if(r<3&&board[i]===board[i+4])return true}return false;}function render(){grid.innerHTML='';board.forEach(v=>{const t=document.createElement('div');t.className='tile-2048';t.style.background=tileColors[v]||'#1e40af';t.style.color=v===0?'transparent':'#fff';t.textContent=v||'';grid.appendChild(t);});setRecord('2048',pts);record.textContent='Recorde: '+getRecord('2048');status.textContent=hasMoves()?'Pontos: '+pts:'Fim de jogo! Pontos: '+pts;}
      function addTile(){const empty=board.map((v,i)=>v===0?i:null).filter(i=>i!==null);if(empty.length===0)return;const idx=empty[Math.floor(Math.random()*empty.length)];board[idx]=Math.random()<0.9?2:4;}
      function slide(row){let arr=row.filter(v=>v!==0);for(let i=0;i<arr.length-1;i++){if(arr[i]===arr[i+1]){arr[i]*=2;pts+=arr[i];arr.splice(i+1,1);}}while(arr.length<4)arr.push(0);return arr;}
      function move(dir){let moved=false;const old=JSON.stringify(board);if(dir==='left'){for(let r=0;r<4;r++){const row=board.slice(r*4,r*4+4);const n=slide(row);for(let c=0;c<4;c++)board[r*4+c]=n[c];}}else if(dir==='right'){for(let r=0;r<4;r++){const row=board.slice(r*4,r*4+4).reverse();const n=slide(row).reverse();for(let c=0;c<4;c++)board[r*4+c]=n[c];}}else if(dir==='up'){for(let c=0;c<4;c++){const col=[board[c],board[c+4],board[c+8],board[c+12]];const n=slide(col);for(let r=0;r<4;r++)board[r*4+c]=n[r];}}else if(dir==='down'){for(let c=0;c<4;c++){const col=[board[c],board[c+4],board[c+8],board[c+12]].reverse();const n=slide(col).reverse();for(let r=0;r<4;r++)board[r*4+c]=n[r];}}if(JSON.stringify(board)!==old){addTile();render();}}
      const game2048KeyHandler=e=>{const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(map[e.key]){e.preventDefault();move(map[e.key]);}};document.addEventListener('keydown',game2048KeyHandler);registerCleanup(()=>document.removeEventListener('keydown',game2048KeyHandler));
      const restartBtn=document.createElement('button');restartBtn.className='mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600';restartBtn.textContent='Reiniciar';restartBtn.onclick=()=>{board=Array(16).fill(0);pts=0;addTile();addTile();render();};
      const info=document.createElement('p');info.className='text-white/80 text-sm';info.textContent='Use as setas ou deslize para mover';let touchStart=null;grid.addEventListener('touchstart',e=>{touchStart=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});grid.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];if(Math.max(Math.abs(dx),Math.abs(dy))>25)move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));touchStart=null},{passive:true});container.append(status,record,info,grid,makePad(move),restartBtn);addTile();addTile();render();
    }
  

    const filterButtons = document.querySelectorAll('[data-filter]');
    const gameCards = document.querySelectorAll('[data-game-card]');
    filterButtons.forEach(button => button.addEventListener('click', () => {
      filterButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      gameCards.forEach(card => {
        const visible = filter === 'all' || card.dataset.category === filter;
        card.hidden = !visible;
      });
    }));

    document.getElementById('game-modal').addEventListener('click', event => {
      if (event.target.id === 'game-modal') closeGame();
    });
    document.addEventListener('keydown', event => {
      const modal=document.getElementById('game-modal');
      if(event.key==='Tab'&&!modal.classList.contains('hidden')){const focusable=[...modal.querySelectorAll('button,[tabindex]:not([tabindex="-1"])')];if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}}
      if (event.key === 'Escape' && !document.getElementById('game-modal').classList.contains('hidden')) closeGame();
    });

    const canvasObserver = new MutationObserver(() => {
      document.querySelectorAll('#game-container canvas').forEach(canvas => { canvas.setAttribute('aria-label', 'Área interativa do jogo'); canvas.setAttribute('role','img'); });
    });
    canvasObserver.observe(document.getElementById('game-container'), {childList:true, subtree:true});
