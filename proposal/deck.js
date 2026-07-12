/* ============================================================
   ZONKEL MEDIA — Pitch Deck Engine (shared by every deck)
   Reads the CONFIG object defined in each deck's .html file:
     - fills {{tokens}} (business name, phone, city, prices...)
     - renders dynamic sections (roi cards, pricing, steps...)
     - handles navigation, dots, keyboard, and print
   You normally never need to touch this file.
   ============================================================ */
(function(){
  const C = window.CONFIG || {};

  /* ---- Icon library (stroke-based, 24x24) ---- */
  const ICONS = {
    check:'<path stroke-width="3" d="M20 6L9 17l-5-5"/>',
    x:'<path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    users:'<path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4z"/><path d="M3 21v-1a5 5 0 0 1 5-5h2"/><path d="M19 16v6M22 19h-6"/>',
    building:'<path d="M3 21V7l8-4v18M11 21V11l8-3v13M3 21h18"/>',
    home:'<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5"/>',
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7A2 2 0 0 1 22 16.9z"/>',
    sms:'<path d="M21 11.5a8.4 8.4 0 0 1-12 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>',
    star:'<path d="M12 2l3 6.3 6.9.9-5 4.8 1.2 6.9L12 17.8 5.9 21l1.2-6.9-5-4.8 6.9-.9z"/>',
    bolt:'<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>',
    shield:'<path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
    dollar:'<path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    chart:'<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    megaphone:'<path d="M3 11v2a1 1 0 0 0 1 1h2l3 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M14 6s4 1 4 6-4 6-4 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    robot:'<rect x="4" y="8" width="16" height="11" rx="2"/><path d="M12 8V4M9 4h6"/><circle cx="9" cy="13" r="1.2"/><circle cx="15" cy="13" r="1.2"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
    pin:'<path d="M12 21s-7-5.7-7-11a7 7 0 0 1 14 0c0 5.3-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    trending:'<path d="M3 17l6-6 4 4 7-7"/><path d="M17 8h4v4"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.3"/><path d="M21 4v5h-5"/>',
    mobile:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    funnel:'<path d="M3 4h18l-7 8v6l-4 2v-8z"/>',
    photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-4 4-2-2-7 6"/>',
    thumbsup:'<path d="M7 22V10l5-8a2.5 2.5 0 0 1 2.5 3l-1 5H21a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 19.8 22z"/><path d="M7 10H3v12h4"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    gear:'<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.3 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.6 14H4.5a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 6.2 7.3l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.6V4.5a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8z"/>'
  };
  function icon(n){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'+(ICONS[n]||ICONS.check)+'</svg>'; }

  /* ---- Builders ---- */
  function buildRoi(r){ return '<div class="roi"><div class="ic">'+icon(r.icon)+'</div><div><h3>'+r.title+'</h3><p>'+r.text+'</p></div></div>'; }
  function buildPillar(p){ const items=(p.items||[]).map(i=>'<li>'+icon('check')+i+'</li>').join(''); return '<div class="pillar"><div class="pic">'+icon(p.icon)+'</div><h3>'+p.title+'</h3><ul>'+items+'</ul></div>'; }
  function buildStep(s,i){ return '<div class="step"><div class="n">'+(i+1)+'</div><div><h4>'+s.title+'</h4><p>'+s.text+'</p></div></div>'; }
  function buildChecklist(s){ // string, or {t,sub}
    if(typeof s==='string'){ const m=s.charAt(0)==='~'; return '<li><span class="ck">'+icon(m?'x':'check')+'</span><span class="t">'+(m?s.slice(1):s)+'</span></li>'; }
    return '<li><span class="ck">'+icon('check')+'</span><span class="t"><b>'+s.t+'</b>'+(s.sub?'<small>'+s.sub+'</small>':'')+'</span></li>';
  }
  function buildCard(p){
    const feat=p.featured?' feature':'';
    const ribbon=p.ribbon?'<span class="ribbon">'+p.ribbon+'</span>':'';
    const unit=p.unit?'<small> '+p.unit+'</small>':'';
    const feats=(p.features||[]).map(f=>{ const m=f.charAt(0)==='~'; const t=m?f.slice(1):f;
      return '<li class="'+(m?'muted':'')+'"><span class="ck">'+icon(m?'x':'check')+'</span>'+t+'</li>'; }).join('');
    return '<div class="pcard'+feat+'">'+ribbon+'<div class="pname">'+p.name+'</div><div class="pprice">'+p.price+unit+'</div><div class="punder">'+(p.sub||'')+'</div><ul>'+feats+'</ul></div>';
  }

  /* ---- Render dynamic sections ---- */
  function render(){
    document.querySelectorAll('[data-render]').forEach(el=>{
      const type=el.dataset.render, key=el.dataset.key, data=key?C[key]:null;
      if(type==='roi'){ el.innerHTML=(C[key||'roi']||[]).map(buildRoi).join(''); }
      else if(type==='pillars'){ const d=C[key]||[]; el.style.gridTemplateColumns='repeat('+d.length+',1fr)'; el.innerHTML=d.map(buildPillar).join(''); }
      else if(type==='steps'){ el.innerHTML=(C[key||'steps']||[]).map(buildStep).join(''); }
      else if(type==='checklist'){ el.innerHTML=(C[key]||[]).map(buildChecklist).join(''); }
      else if(type==='cards'){ const d=C[key]||[]; el.style.gridTemplateColumns='repeat('+d.length+',1fr)'; el.innerHTML=d.map(buildCard).join(''); }
      else if(type==='compare'){ const d=C[key]||{}; let h='<div class="crow head"><div class="human">'+(d.left||'')+'</div><div class="ai">'+(d.right||'')+'</div></div>';
        (d.rows||[]).forEach(r=>{ h+='<div class="crow"><div class="human">'+r[0]+'</div><div class="ai">'+icon('check')+'<span>'+r[1]+'</span></div></div>'; }); el.innerHTML=h; }
      else if(type==='icon'){ el.innerHTML=icon(key); }
    });
  }

  /* ---- Token replacement {{key}} from scalar CONFIG fields ---- */
  function tokenMap(){ const m={}; for(const k in C){ const v=C[k]; if(typeof v==='string'||typeof v==='number') m[k]=v; } return m; }
  function applyTokens(){
    const map=tokenMap(), re=/\{\{(\w+)\}\}/g, rep=(s)=>s.replace(re,(m,k)=> (k in map)?map[k]:m);
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT), nodes=[];
    while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{ if(n.nodeValue.indexOf('{{')>-1) n.nodeValue=rep(n.nodeValue); });
    document.querySelectorAll('*').forEach(el=>{ for(const a of el.attributes){ if(a.value.indexOf('{{')>-1) a.value=rep(a.value); } });
  }

  /* ---- Branding (accent + logo) ---- */
  function brand(){
    const root=document.documentElement.style;
    if(C.accent){ root.setProperty('--accent',C.accent); }
    if(C.accentDark){ root.setProperty('--accent-600',C.accentDark); }
    const img=document.querySelector('.cover-logo'), mark=document.querySelector('.brandmark');
    if(C.logo){ if(img) img.src=C.logo; if(mark) mark.src=C.logo; }
    else {
      const plate=document.querySelector('.logo-plate'); if(plate) plate.innerHTML='<span class="wordmark">'+(C.business||'Your Business')+'</span>';
      if(mark) mark.classList.add('hide');
    }
  }

  /* ---- Navigation ---- */
  function nav(){
    const slides=[].slice.call(document.querySelectorAll('.slide'));
    const dotsWrap=document.getElementById('dots');
    const curEl=document.getElementById('cur'), totEl=document.getElementById('tot');
    let i=0; if(totEl) totEl.textContent=slides.length;
    slides.forEach((_,n)=>{ const b=document.createElement('button'); b.className='dot'+(n===0?' on':''); b.onclick=()=>go(n); dotsWrap.appendChild(b); });
    const dots=[].slice.call(dotsWrap.children);
    function go(n){
      i=Math.max(0,Math.min(slides.length-1,n));
      slides.forEach((s,k)=>s.classList.toggle('active',k===i));
      dots.forEach((d,k)=>d.classList.toggle('on',k===i));
      if(curEl) curEl.textContent=i+1;
      document.body.classList.toggle('light-bg',slides[i].classList.contains('light'));
    }
    const prev=document.getElementById('prev'), next=document.getElementById('next');
    if(prev) prev.onclick=()=>go(i-1); if(next) next.onclick=()=>go(i+1);
    document.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' ') go(i+1);
      else if(e.key==='ArrowLeft'||e.key==='PageUp') go(i-1);
      else if(e.key==='Home') go(0);
      else if(e.key==='End') go(slides.length-1);
      else if(e.key.toLowerCase()==='p') window.print();
    });
    window.__go=go; go(0);
  }

  /* ---- Boot ---- */
  function boot(){ render(); applyTokens(); brand(); nav();
    const y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
