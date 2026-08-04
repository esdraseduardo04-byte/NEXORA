const gameNames = {snake:'Snake Neon',ttt:'Jogo da Velha',memory:'Memória',pong:'Pong',quiz:'Quiz Rápido',breakout:'Breakout',whack:'Whack-a-Mole',simon:'Simon',game2048:'2048',dodge:'Neon Dodge',reaction:'Reflexo Turbo',connect4:'Conecta 4'};
    window._gameCleanups = [];
    let lastFocusedElement = null;
    function registerCleanup(fn) { window._gameCleanups.push(fn); }
    function runCleanups() { window._gameCleanups.splice(0).forEach(fn => { try { fn(); } catch (_) {} }); }
    function safeTimeout(fn, delay) { const id=setTimeout(fn,delay); registerCleanup(()=>clearTimeout(id)); return id; }
    function getRecord(key){try{return Number(localStorage.getItem('jogosOffline:'+key)||0)}catch(_){return 0}}
    function setRecord(key,value){try{const old=getRecord(key);if(value>old){localStorage.setItem('jogosOffline:'+key,String(value));if(window.Arcade)Arcade.onRecord(key,value,old)}}catch(_){}}
    function makePad(onMove){const pad=document.createElement('div');pad.className='control-pad';[['blank',''],['up','▲'],['blank',''],['left','◀'],['down','▼'],['right','▶']].forEach(([dir,label])=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.className=dir==='blank'?'blank':'';if(dir!=='blank'){b.setAttribute('aria-label','Mover '+dir);b.onclick=()=>onMove(dir);}pad.appendChild(b)});return pad}

    function openGame(game) {
      if(window.Arcade) Arcade.onGameOpen(game);
      runCleanups();
      lastFocusedElement = document.activeElement;
      const modal = document.getElementById('game-modal');
      const container = document.getElementById('game-container');
      document.getElementById('modal-game-title').textContent = gameNames[game] || 'Jogo';
      document.body.classList.add('modal-open');
      modal.classList.remove('hidden'); modal.classList.add('flex');
      container.innerHTML = '';
      if (game === 'snake') initSnake(container);
      else if (game === 'ttt') initTTT(container);
      else if (game === 'memory') initMemory(container);
      else if (game === 'pong') initPong(container);
      else if (game === 'quiz') initQuiz(container);
      else if (game === 'breakout') initBreakout(container);
      else if (game === 'whack') initWhack(container);
      else if (game === 'simon') initSimon(container);
      else if (game === 'game2048') init2048(container);
      else if (game === 'dodge') initDodge(container);
      else if (game === 'reaction') initReaction(container);
      else if (game === 'connect4') initConnect4(container);
      requestAnimationFrame(()=>modal.querySelector('.close-btn')?.focus());
    }

    function closeGame() {
      const modal = document.getElementById('game-modal');
      modal.classList.add('hidden'); modal.classList.remove('flex');
      document.body.classList.remove('modal-open');
      document.getElementById('game-container').innerHTML = '';
      runCleanups();
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
      ['_snakeInterval','_pongInterval','_breakoutInterval','_whackInterval','_whackCountdown'].forEach(key => {
        if (window[key]) { clearInterval(window[key]); window[key] = null; }
      });
    }

