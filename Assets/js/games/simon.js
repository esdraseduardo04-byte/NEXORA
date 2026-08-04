function initSimon(container) {
      const status=document.createElement('p');status.className='text-purple-300 font-bold text-lg';status.textContent='Observe a sequência!';
      const grid=document.createElement('div');grid.className='grid grid-cols-2 gap-3';
      const colorsArr=['#ef4444','#3b82f6','#22c55e','#eab308'];
      const btns=[];
      colorsArr.forEach((color,i)=>{const btn=document.createElement('button');btn.className='simon-btn';btn.style.background=color;btn.style.color=color;btns.push(btn);btn.onclick=()=>playerPress(i);grid.appendChild(btn);});
      let sequence=[],playerIdx=0,playing=false;const record=document.createElement('span');record.className='record-badge';record.textContent='Recorde: '+getRecord('simon');
      function flash(idx,dur=400){btns[idx].classList.add('lit');safeTimeout(()=>btns[idx].classList.remove('lit'),dur);}
      function playSequence(){playing=true;status.textContent='Observe...';let i=0;const iv=setInterval(()=>{if(i>=sequence.length){clearInterval(iv);playing=false;playerIdx=0;status.textContent='Sua vez!';}else{flash(sequence[i]);i++;}},600);registerCleanup(()=>clearInterval(iv));}
      function nextRound(){sequence.push(Math.floor(Math.random()*4));safeTimeout(()=>playSequence(),500);}
      function playerPress(idx){if(playing)return;if(idx===sequence[playerIdx]){flash(idx,200);playerIdx++;if(playerIdx===sequence.length){status.textContent=`Nível ${sequence.length} completo! 🎉`;safeTimeout(nextRound,1000);}}else{const finalScore=sequence.length-1;setRecord('simon',finalScore);record.textContent='Recorde: '+getRecord('simon');status.textContent=`Errou! Pontuação: ${finalScore}`;sequence=[];safeTimeout(nextRound,1500);}}
      const restartBtn=document.createElement('button');restartBtn.className='mt-4 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600';restartBtn.textContent='Reiniciar';restartBtn.onclick=()=>{sequence=[];container.innerHTML='';initSimon(container);};
      container.append(status,record,grid,restartBtn);nextRound();
    }
