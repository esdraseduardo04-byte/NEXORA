function initWhack(container) {
      const status=document.createElement('p');status.className='text-purple-300 font-bold text-lg';status.textContent='Pontos: 0 | Tempo: 30s';
      const grid=document.createElement('div');grid.className='grid grid-cols-3 gap-3';
      const holes=[];let pts=0,timeLeft=30,activeHole=-1;const record=document.createElement('span');record.className='record-badge';record.textContent='Recorde: '+getRecord('whack');
      for(let i=0;i<9;i++){const hole=document.createElement('div');hole.className='mole-hole';hole.textContent='';hole.onclick=()=>{if(i===activeHole){pts++;hole.classList.remove('active');hole.textContent='';activeHole=-1;status.textContent=`Pontos: ${pts} | Tempo: ${timeLeft}s`;}};holes.push(hole);grid.appendChild(hole);}
      function spawnMole(){if(activeHole>=0){holes[activeHole].classList.remove('active');holes[activeHole].textContent='';}activeHole=Math.floor(Math.random()*9);holes[activeHole].classList.add('active');holes[activeHole].textContent='🐹';}
      const moleTimer=setInterval(spawnMole,800);
      const countdown=setInterval(()=>{timeLeft--;status.textContent=`Pontos: ${pts} | Tempo: ${timeLeft}s`;if(timeLeft<=0){clearInterval(moleTimer);clearInterval(countdown);if(activeHole>=0){holes[activeHole].classList.remove('active');holes[activeHole].textContent='';}setRecord('whack',pts);record.textContent='Recorde: '+getRecord('whack');status.textContent=`Fim! Pontos: ${pts}`;}},1000);
      window._whackInterval=moleTimer;window._whackCountdown=countdown;registerCleanup(()=>{clearInterval(moleTimer);clearInterval(countdown);});
      const restartBtn=document.createElement('button');restartBtn.className='mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600';restartBtn.textContent='Reiniciar';restartBtn.onclick=()=>{clearInterval(moleTimer);clearInterval(countdown);container.innerHTML='';initWhack(container);};
      container.append(status,record,grid,restartBtn);
    }
