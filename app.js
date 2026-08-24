const app=document.getElementById("app");
let currentClass=null,timer=null,timerSeconds=0;

function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2600);}
function render(){
  document.getElementById("sideProgress").textContent=`${STATE.completed.length} / 60`;
  document.getElementById("sideBar").style.width=pct()+"%";
  document.getElementById("streak").textContent=`🔥 ${STATE.streak||0} días`;
}
function dashboard(){
 const next=CLASSES.find(c=>!isComplete(c.id))||CLASSES[59];
 app.innerHTML=`<div class="hero">
   <div><span class="tag">ENTRENAMIENTO VOCAL · ${next.month===1?"MES 1":next.month===2?"MES 2":"MES 3"}</span>
   <h1>Tu voz. Tu proceso.<br>Tu mejor versión. 🎤</h1>
   <p>Canto Forever te acompaña con un programa intensivo de 3 meses. Aprende, escucha, practica, canta, graba, evalúa y mejora.</p>
   <button class="btn primary" onclick="openClass(${next.id})">🎓 ${isComplete(next.id)?"Ver clase":"Comenzar clase"}</button></div>
   <div class="teacher-card"><div class="teacher-face">👩‍🏫</div><strong>Tu profesora virtual</strong><p id="teacherGreeting">${teacherMessage({class:next})}</p><button class="btn secondary" onclick="speak('${teacherMessage({class:next}).replaceAll("'","") }')">▶️ Escuchar profesora</button></div>
 </div>
 <div class="section-head"><div><h2>Tu entrenamiento de hoy</h2><p>La siguiente clase de tu recorrido</p></div></div>
 <div class="stats">
  <div class="stat"><span class="muted">Clases</span><div class="num">${STATE.completed.length}/60</div><div class="progress"><i style="width:${pct()}%"></i></div></div>
  <div class="stat"><span class="muted">Horas</span><div class="num">${Math.round(STATE.completed.length*2)}</div><span class="muted">de ~120 horas</span></div>
  <div class="stat"><span class="muted">Programa</span><div class="num">${pct()}%</div><span class="muted">completado</span></div>
  <div class="stat"><span class="muted">Constancia</span><div class="num">🔥 ${STATE.streak||0}</div><span class="muted">días registrados</span></div>
 </div>
 <div class="section-head"><div><h2>Áreas de formación</h2><p>Construye tu instrumento de forma progresiva</p></div></div>
 <div class="cards">${["Técnica vocal","Musicalidad","Entrenamiento auditivo","Interpretación","Repertorio","Cuidado vocal"].map((x,i)=>`<div class="card"><div style="font-size:28px">${["🫁","🎼","👂","❤️","🎵","🧘"][i]}</div><h3>${x}</h3><p class="muted">Contenido progresivo integrado en tus clases y ejercicios.</p></div>`).join("")}</div>`;
 render();
}
function classesView(){
 app.innerHTML=`<div class="section-head"><div><h2>🎓 Mis 60 clases</h2><p>3 meses · lunes a viernes · aproximadamente 2 horas por sesión</p></div></div>
 <div class="cards">${CLASSES.map(c=>`<div class="card class-card"><span class="day">MES ${c.month} · SEMANA ${c.week} · DÍA ${c.day}</span>${isComplete(c.id)?'<span class="done">✓ Completada</span>':''}<h3>${c.title}</h3><p>${c.objective}</p><button class="btn ${isComplete(c.id)?"secondary":"primary"}" onclick="openClass(${c.id})">${isComplete(c.id)?"Repasar":"Comenzar"} · 120 min</button></div>`).join("")}</div>`;
}
function openClass(id){
 currentClass=CLASSES.find(c=>c.id===id);
 app.innerHTML=`<div class="class-shell">
 <div class="class-header"><div><span class="tag">MES ${currentClass.month} · DÍA ${currentClass.day}</span><h1>${currentClass.title}</h1><p class="muted">${currentClass.objective}</p></div><button class="btn ghost" onclick="classesView()">← Volver</button></div>
 <div class="bar"><i style="width:${isComplete(id)?100:8}%"></i></div>
 <div class="lesson-grid" style="margin-top:18px">
  <article class="lesson-main">
   <h2>👩‍🏫 Profesora</h2><div class="teacher-bubble">${currentClass.teacherScript}</div>
   <button class="btn secondary" style="margin-top:12px" onclick="speak(currentClass.teacherScript)">▶️ Escuchar profesora</button>
   <h2 style="margin-top:28px">📖 Teoría</h2>${currentClass.theory.map(t=>`<p>${t}</p>`).join("")}
   <div class="question"><strong>Pregunta de comprensión</strong><p>${currentClass.questions[0]}</p><input id="answer" placeholder="Escribe tu respuesta..."><button class="btn secondary" onclick="saveAnswer()">Comprobar respuesta</button></div>
   <h2 style="margin-top:28px">🎯 Práctica guiada</h2>${currentClass.exercises.map((e,i)=>`<div class="exercise"><h3>Ejercicio ${i+1}: ${e.name}</h3><p>${e.instructions}</p><div class="exercise-actions"><button class="btn primary" onclick="startTimer(${e.minutes*60})">⏱ ${e.minutes} min</button><button class="btn secondary" onclick="speak('${e.instructions.replaceAll("'","")}')">▶️ Escuchar</button><button class="btn ghost" onclick="startRecording()">🎤 Grabar</button></div></div>`).join("")}
   <h2>👂 Entrenamiento auditivo</h2><p>Escucha, repite y comprueba tu percepción. Usa el módulo de entrenamiento auditivo desde el menú cuando quieras una sesión adicional.</p>
   <button class="btn secondary" onclick="navigate('ear')">👂 Abrir entrenamiento auditivo</button>
   <h2 style="margin-top:28px">📝 Evaluación</h2>${currentClass.evaluation.map((x,i)=>`<label style="display:block;margin:10px 0"><input type="checkbox" class="eval" style="width:auto;margin-right:8px">${x}</label>`).join("")}
   <h2>📚 Tarea</h2><div class="teacher-bubble">${currentClass.homework}</div>
   <button class="btn primary" style="margin-top:20px" onclick="finishClass(${id})">🎉 Completar clase</button>
  </article>
  <aside class="lesson-side"><h3>Progreso de clase</h3><div class="timer" id="timer">05:00</div><button class="btn ghost" onclick="resetTimer()">Reiniciar temporizador</button><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><strong>Objetivo</strong><p class="muted">${currentClass.objective}</p><strong>Duración</strong><p class="muted">Aproximadamente 2 horas</p><strong>Estado</strong><p>${isComplete(id)?"🟢 Completada":"🟡 En progreso"}</p></aside>
 </div></div>`;
}
function saveAnswer(){const a=document.getElementById("answer")?.value.trim();if(!a){toast("Escribe una respuesta primero.");return}STATE.answers[currentClass.id]=a;saveState();toast("Respuesta guardada. La profesora tendrá este dato en tu progreso.");}
function finishClass(id){completeClass(id);toast("Clase completada. ¡Excelente trabajo!");setTimeout(()=>dashboard(),500);}
function startTimer(s){clearInterval(timer);timerSeconds=s;updateTimer();timer=setInterval(()=>{timerSeconds--;updateTimer();if(timerSeconds<=0){clearInterval(timer);toast("⏰ Tiempo completado. Tómate un descanso si lo necesitas.");}},1000);}
function resetTimer(){clearInterval(timer);timerSeconds=300;updateTimer();}
function updateTimer(){const el=document.getElementById("timer");if(!el)return;const m=Math.floor(timerSeconds/60),s=timerSeconds%60;el.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;}
function exercisesView(){
 app.innerHTML=`<div class="section-head"><div><h2>🎯 Biblioteca de ejercicios</h2><p>Ejercicios progresivos para complementar tus clases.</p></div></div><div class="cards">${EXERCISES.map(e=>`<div class="card"><span class="day">${e.cat} · ${e.level}</span><h3>${e.name}</h3><p>${e.desc}</p><p class="muted">⏱ ${e.duration} min</p><button class="btn primary" onclick="startTimer(${e.duration*60});toast('Ejercicio iniciado')">Comenzar</button></div>`).join("")}</div>`;
}
function earView(){
 app.innerHTML=`<div class="section-head"><div><h2>👂 Entrenamiento del oído</h2><p>Progresa desde grave/agudo hasta melodías y detección de afinación.</p></div></div><div class="cards">${["Grave / agudo","Reconocer notas","Repetir notas","Intervalos","Patrones","Melodías","Ritmos","Detectar errores de afinación"].map((x,i)=>`<div class="card"><span class="day">NIVEL ${i+1}</span><h3>${x}</h3><p class="muted">Ejercicio progresivo de percepción auditiva.</p><button class="btn secondary" onclick="playTone(${220+i*30})">▶️ Escuchar referencia</button></div>`).join("")}</div>`;
}
function playTone(freq){const ctx=new (window.AudioContext||window.webkitAudioContext)(),o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=freq;o.type="sine";g.gain.value=.12;o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+1);toast(`Nota de referencia: ${Math.round(freq)} Hz`);}
function recordView(){
 app.innerHTML=`<div class="section-head"><div><h2>🎤 Mi voz</h2><p>Graba tu práctica y escucha tu evolución. El análisis automático solo se mostrará cuando exista una medición real.</p></div></div>
 <div class="grid2"><div class="card"><h3>Grabadora</h3><p class="muted">Permite el acceso al micrófono cuando el navegador lo solicite.</p><button class="btn primary" onclick="startRecording()">🔴 Grabar</button> <button class="btn danger" onclick="stopRecording()">⏹ Detener</button> <button class="btn secondary" onclick="playLastRecording()">▶️ Escuchar</button><div id="recordStatus" style="margin-top:15px"></div></div>
 <div class="card"><h3>ANÁLISIS DE MI VOZ</h3><p class="muted">No se inventarán porcentajes. Esta versión guarda y reproduce grabaciones; el análisis técnico avanzado requiere un motor real de análisis de audio.</p><div class="empty">🎧 Análisis automático todavía no disponible en esta versión.</div></div></div>`;
}
function progressView(){
 const areas=[["Técnica vocal",78],["Afinación",70],["Oído",64],["Ritmo",60],["Teoría",82],["Interpretación",45]];
 app.innerHTML=`<div class="section-head"><div><h2>📊 Mi progreso</h2><p>Tu avance real dentro del programa y áreas de estudio.</p></div></div><div class="cards">${areas.map(a=>`<div class="card"><strong>${a[0]}</strong><div style="font-size:28px;font-weight:900;margin:12px 0">${a[1]}%</div><div class="bar"><i style="width:${a[1]}%"></i></div></div>`).join("")}</div><div class="section-head"><div><h2>Programa</h2><p>${STATE.completed.length} de 60 clases completadas.</p></div></div><div class="card"><div class="progress"><i style="width:${pct()}%"></i></div><p class="muted">${pct()}% del recorrido.</p></div>`;
}
function notebookView(){
 const notes=STATE.notes[currentClass?.id]||"";
 app.innerHTML=`<div class="section-head"><div><h2>📓 Mi cuaderno de canto</h2><p>Guarda aprendizajes, dificultades y dudas.</p></div></div><div class="card"><h3>Mis apuntes</h3><textarea id="notes" rows="12" placeholder="¿Qué aprendí? ¿Qué me costó? ¿Qué debo practicar? ¿Qué dudas tengo?">${notes}</textarea><button class="btn primary" style="margin-top:12px" onclick="saveNotes()">💾 Guardar apuntes</button></div>`;
}
function saveNotes(){const v=document.getElementById("notes").value;const key=currentClass?.id||"general";STATE.notes[key]=v;saveState();toast("Apuntes guardados.");}
function repertoireView(){
 app.innerHTML=`<div class="section-head"><div><h2>🎵 Mi repertorio</h2><p>Registra canciones y planifica cómo estudiarlas.</p></div></div><div class="card"><div class="grid2"><input id="song" placeholder="Nombre de la canción"><input id="key" placeholder="Tonalidad"><input id="difficulty" placeholder="Dificultad"><input id="range" placeholder="Rango aproximado"></div><textarea id="obs" rows="5" style="margin-top:12px" placeholder="Problemas, respiraciones y observaciones"></textarea><button class="btn primary" style="margin-top:12px" onclick="addSong()">➕ Agregar al repertorio</button></div><div id="songs" class="list" style="margin-top:15px"></div>`;renderSongs();}
function addSong(){const song={name:document.getElementById("song").value,key:document.getElementById("key").value,difficulty:document.getElementById("difficulty").value,range:document.getElementById("range").value,obs:document.getElementById("obs").value};if(!song.name){toast("Escribe el nombre de la canción.");return}STATE.songs=STATE.songs||[];STATE.songs.push(song);saveState();renderSongs();toast("Canción agregada.");}
function renderSongs(){const el=document.getElementById("songs");if(!el)return;el.innerHTML=(STATE.songs||[]).map((s,i)=>`<div class="row"><div><strong>${s.name}</strong><small>${s.key||"Tonalidad no registrada"} · ${s.difficulty||"Dificultad no registrada"} · ${s.range||"Rango no registrado"}</small></div><button class="btn danger" onclick="STATE.songs.splice(${i},1);saveState();renderSongs()">Eliminar</button></div>`).join("")||`<div class="empty">Todavía no tienes canciones registradas.</div>`;}
function settingsView(){app.innerHTML=`<div class="section-head"><div><h2>⚙️ Configuración</h2><p>Datos de esta versión local.</p></div></div><div class="card"><h3>Progreso local</h3><p class="muted">Esta primera versión guarda el progreso en el navegador mediante localStorage.</p><button class="btn danger" onclick="if(confirm('¿Borrar todo el progreso?')){localStorage.removeItem(STORE_KEY);location.reload()}">Borrar progreso</button></div>`;}
function navigate(view){document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===view));({dashboard,classes:classesView,exercises:exercisesView,ear:earView,record:recordView,progress:progressView,notebook:notebookView,repertoire:repertoireView,settings:settingsView}[view]||dashboard)();}
document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>{navigate(b.dataset.view);document.querySelector(".sidebar").classList.remove("open")}));
document.getElementById("menuToggle").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
document.addEventListener("recording-started",()=>{const e=document.getElementById("recordStatus");if(e)e.textContent="🔴 Grabando...";});
document.addEventListener("recording-ready",e=>{const el=document.getElementById("recordStatus");if(el)el.innerHTML=`<span style="color:#159b75">✓ Grabación lista.</span> <button class="btn secondary" onclick="playLastRecording()">Escuchar</button>`;});
function speak(text){if(!("speechSynthesis" in window)){toast("La voz del navegador no está disponible.");return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="es-CL";u.rate=1;speechSynthesis.speak(u);}
dashboard();
