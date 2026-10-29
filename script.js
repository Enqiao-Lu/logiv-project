const backbones=['π₀.₅','AHA-WAM','Light-WAM'];
const methods=['Backbone','VeriGraph-PDDL','LERa-PDDL','VLM-RP-BT','LOGIV'];
// Paper Table main: RoboTwin C/P/R followed by BiCoord C/P/R.
const values=[
 [[56,32,18,39,31,21],[68,56,66,46,39,56],[67,57,64,47,43,63],[63,58,68,45,45,59],[72,60,72,50,48,68]],
 [[85,60,35,45,43,37],[90,78,81,56,46,77],[88,79,82,52,48,73],[91,80,80,57,48,80],[93,83,85,62,53,84]],
 [[74,58,28,43,39,31],[76,68,65,56,46,67],[76,67,70,51,45,65],[78,70,62,58,43,68],[82,72,79,61,49,74]]
];
const metrics={
 clean:{offset:0,title:'Task success without injected disturbances',note:'Each value is a task success rate (%). Gains are percentage points, averaged across the three backbones.'},
 perturbed:{offset:1,title:'Task success under predefined perturbations',note:'Each value is a full-task success rate (%) after predefined execution-time perturbations. Gains are percentage points, averaged across the three backbones.'},
 recovery:{offset:2,title:'Restoring invalidated physical conditions',note:'Recovery success (%) among valid, recoverable perturbation events. This measures condition restoration, separately from full-task completion.'}
};
function renderChart(key){
 const m=metrics[key];
 document.querySelector('#chart-title').textContent=m.title;
 document.querySelector('#metric-note').textContent=m.note;
 document.querySelector('#benchmark-charts').innerHTML=['RoboTwin V2','BiCoord'].map((name,bench)=>{
  const index=bench*3+m.offset;
  const gain=values.reduce((total,row)=>total+row[4][index]-row[0][index],0)/3;
  return `<div class="benchmark-chart"><div class="benchmark-title"><h4>${name}</h4><span class="gain">+${gain.toFixed(2)} pp mean</span></div>${values.map((row,i)=>`<div class="bar-group" aria-label="${backbones[i]}: backbone ${row[0][index]} percent, LOGIV ${row[4][index]} percent"><span class="bar-label">${backbones[i]}</span><div class="bar-line" aria-hidden="true"><div class="bar-track"><div class="bar" style="width:${row[0][index]}%"></div></div><span class="bar-number">${row[0][index]}%</span></div><div class="bar-line" aria-hidden="true"><div class="bar-track"><div class="bar logiv" style="width:${row[4][index]}%"></div></div><span class="bar-number">${row[4][index]}%</span></div></div>`).join('')}</div>`;
 }).join('');
 document.querySelectorAll('[data-metric]').forEach(button=>{const selected=button.dataset.metric===key;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
}
document.querySelectorAll('[data-metric]').forEach(button=>button.addEventListener('click',()=>renderChart(button.dataset.metric)));
renderChart('clean');
document.querySelector('#full-results-table tbody').innerHTML=values.map((rows,b)=>rows.map((row,m)=>`<tr class="${m===4?'highlight':''}"><th scope="row">${m===0?backbones[b]:''}</th><td>${methods[m]}</td>${row.map(n=>`<td>${n}</td>`).join('')}</tr>`).join('')).join('');
const dialog=document.querySelector('#figure-dialog');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{const image=document.querySelector('#figure-large');image.src=button.dataset.image;image.alt=button.querySelector('img').alt;document.querySelector('#figure-caption').textContent=button.dataset.caption;dialog.showModal();}));
document.querySelector('#close-figure').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.querySelectorAll('video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==video)other.pause();})));
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.nav-links a').forEach(a=>{if(a.getAttribute('href')==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px'});document.querySelectorAll('#top,#insight,#method,#results,#demos').forEach(section=>observer.observe(section));}
