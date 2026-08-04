function initMemory(container) {
      const emojis=['🎮','🕹️','👾','🎲','🏆','🎯','⭐','🔥'];let cards=[...emojis,...emojis].sort(()=>Math.random()-0.5);let flipped=[],matched=0,locked=false;
      const status=document.createElement('p');status.className='text-purple-300 font-bold';status.textContent='Encontre os pares!';
      const grid=document.createElement('div');grid.className='grid grid-cols-4 gap-2';
      cards.forEach(emoji=>{const card=document.createElement('div');card.className='mem-card';card.innerHTML=`<div class="mem-inner"><div class="mem-front">?</div><div class="mem-back">${emoji}</div></div>`;card.onclick=()=>{if(locked||card.classList.contains('flipped'))return;card.classList.add('flipped');flipped.push({el:card,val:emoji});if(flipped.length===2){locked=true;if(flipped[0].val===flipped[1].val){matched++;flipped=[];locked=false;if(matched===8)status.textContent='Parabéns! 🎉';}else safeTimeout(()=>{flipped.forEach(f=>f.el.classList.remove('flipped'));flipped=[];locked=false;},800);}};grid.appendChild(card);});
      const restartBtn=document.createElement('button');restartBtn.className='mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600';restartBtn.textContent='Reiniciar';restartBtn.onclick=()=>{container.innerHTML='';initMemory(container);};
      container.append(status,grid,restartBtn);
    }
