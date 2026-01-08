(function(){
  // Store opening hours (0 = Sunday, 1 = Monday ... 6 = Saturday)
  const schedule = {
    0: [], // Domenica chiuso
    1: [['15:00','19:00']],
    2: [['09:00','12:30'],['15:00','19:00']],
    3: [['09:00','12:30'],['15:00','19:00']],
    4: [['09:00','12:30'],['15:00','19:00']],
    5: [['09:00','12:30'],['15:00','19:00']],
    6: [['09:00','12:30'],['15:00','19:00']]
  };

  const OPEN_THRESHOLD_MIN = 30; // minutes for "apre/chiude tra poco"

  function hhmmToMinutes(hhmm){
    const [h,m] = hhmm.split(':').map(Number);
    return h*60 + m;
  }

  function minutesToHHMM(min){
    const h = Math.floor(min/60)%24;
    const m = min%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function findNextOpening(nowDay, nowMin){
    // search today and following days up to 7 days
    for(let d=0; d<7; d++){
      const day = (nowDay + d) % 7;
      const periods = schedule[day] || [];
      if(periods.length === 0) continue;
      for(const p of periods){
        const start = hhmmToMinutes(p[0]);
        if(d===0){
          if(start > nowMin) return {day, start};
        } else {
          return {day, start};
        }
      }
    }
    return null;
  }

  function findCurrentPeriod(periods, nowMin){
    for(const p of periods){
      const start = hhmmToMinutes(p[0]);
      const end = hhmmToMinutes(p[1]);
      if(nowMin >= start && nowMin < end) return {start,end};
    }
    return null;
  }

  function renderStatus(){
    const container = document.getElementById('store-status');
    if(!container) return;

    const now = new Date();
    const day = now.getDay();
    const nowMin = now.getHours()*60 + now.getMinutes();

    // Evidenzia il giorno corrente nella tabella degli orari
    const rows = document.querySelectorAll('#orari table tbody tr');
    if(rows.length){
      const dayOrder = [1,2,3,4,5,6,0]; // mapping delle righe (Lun..Dom) ai giorni (0=Dom)
      rows.forEach((r, i) => {
        if(dayOrder[i] === day){
          r.classList.add('table-primary');
          r.setAttribute('aria-current','true');
        } else {
          r.classList.remove('table-primary');
          r.removeAttribute('aria-current');
        }
      });
    }

    const periodsToday = schedule[day] || [];
    const current = findCurrentPeriod(periodsToday, nowMin);

    const badge = document.createElement('div');
    badge.className = 'd-inline-block';

    if(current){
      const closesIn = current.end - nowMin;
      if(closesIn <= OPEN_THRESHOLD_MIN){
        // Closing soon
        badge.innerHTML = `<span class="badge rounded-pill bg-warning text-dark status-badge">Chiude tra poco</span> <div class="small text-muted mt-1">Chiude alle ${minutesToHHMM(current.end)}</div>`;
      } else {
        badge.innerHTML = `<span class="badge rounded-pill bg-success status-badge">Aperto</span> <div class="small text-muted mt-1">Aperto fino alle ${minutesToHHMM(current.end)}</div>`;
      }
    } else {
      // Closed now, find next opening
      const next = findNextOpening(day, nowMin);
      if(next){
        const startsIn = ( (next.day===day) ? (next.start - nowMin) : ((next.day - day + 7)%7)*24*60 + (next.start - nowMin) );
        if(startsIn <= OPEN_THRESHOLD_MIN){
          badge.innerHTML = `<span class="badge rounded-pill bg-info text-dark status-badge">Apre tra poco</span> <div class="small text-muted mt-1">Apre alle ${minutesToHHMM(next.start)}</div>`;
        } else {
          // Find readable next opening day name
          const weekNames = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
          const dayLabel = (next.day === day) ? 'oggi' : (next.day === (day+1)%7 ? 'domani' : weekNames[next.day]);
          badge.innerHTML = `<span class="badge rounded-pill bg-danger status-badge">Chiuso</span> <div class="small text-muted mt-1">Apre ${dayLabel} alle ${minutesToHHMM(next.start)}</div>`;
        }
      } else {
        badge.innerHTML = `<span class="badge rounded-pill bg-danger status-badge">Chiuso</span>`;
      }
    }

    container.innerHTML = '';
    container.appendChild(badge);
  }

  // Re-render every minute to keep status updated
  document.addEventListener('DOMContentLoaded', () => {
    renderStatus();
    setInterval(renderStatus, 60*1000);
  });
})();