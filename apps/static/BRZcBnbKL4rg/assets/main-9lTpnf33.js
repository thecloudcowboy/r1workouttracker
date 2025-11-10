(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const s={currentScreen:"home",exercises:{},categories:{},workouts:{},activeWorkout:null,favorites:new Set,selectedCategory:null,selectedExercise:null,scrollPosition:0,isLoading:!1};async function v(e,t){if(window.creationStorage)try{const a=btoa(JSON.stringify(t));await window.creationStorage.plain.setItem(e,a),console.log(`Saved ${e} to storage`)}catch(a){console.error("Error saving to storage:",a)}else localStorage.setItem(e,JSON.stringify(t))}async function p(e){if(window.creationStorage)try{const t=await window.creationStorage.plain.getItem(e);if(t)return JSON.parse(atob(t))}catch(t){console.error("Error loading from storage:",t)}else{const t=localStorage.getItem(e);if(t)return JSON.parse(t)}return null}async function l(){await v("exercises",s.exercises),await v("categories",s.categories),await v("workouts",s.workouts),await v("favorites",Array.from(s.favorites))}async function E(){const e=await p("exercises"),t=await p("categories"),a=await p("workouts"),i=await p("favorites");e&&(s.exercises=e),t&&(s.categories=t),a&&(s.workouts=a),i&&(s.favorites=new Set(i))}function S(){Object.keys(s.categories).length>0||(s.categories={chest:{id:"chest",name:"Chest",muscleGroup:"Upper Body",isCustom:!1},back:{id:"back",name:"Back",muscleGroup:"Upper Body",isCustom:!1},shoulders:{id:"shoulders",name:"Shoulders",muscleGroup:"Upper Body",isCustom:!1},arms:{id:"arms",name:"Arms",muscleGroup:"Upper Body",isCustom:!1},legs:{id:"legs",name:"Legs",muscleGroup:"Lower Body",isCustom:!1},core:{id:"core",name:"Core",muscleGroup:"Core",isCustom:!1},cardio:{id:"cardio",name:"Cardio",muscleGroup:"Cardio",isCustom:!1}},s.exercises={"bench-press":{id:"bench-press",name:"Bench Press",category:"chest",type:"Free Weights",instructions:"Lie on bench, lower bar to chest, press up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dumbbell-press":{id:"dumbbell-press",name:"Dumbbell Press",category:"chest",type:"Free Weights",instructions:"Press dumbbells from chest level upward",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"chest-fly":{id:"chest-fly",name:"Chest Fly Machine",category:"chest",type:"Machine",instructions:"Bring handles together in front of chest",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},pushup:{id:"pushup",name:"Push-ups",category:"chest",type:"Bodyweight",instructions:"Lower body to ground, push back up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},deadlift:{id:"deadlift",name:"Deadlift",category:"back",type:"Free Weights",instructions:"Lift bar from ground to hip level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},pullup:{id:"pullup",name:"Pull-ups",category:"back",type:"Bodyweight",instructions:"Pull body up until chin over bar",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"lat-pulldown":{id:"lat-pulldown",name:"Lat Pulldown",category:"back",type:"Machine",instructions:"Pull bar down to chest level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"barbell-row":{id:"barbell-row",name:"Barbell Row",category:"back",type:"Free Weights",instructions:"Pull bar to lower chest while bent over",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"shoulder-press":{id:"shoulder-press",name:"Shoulder Press",category:"shoulders",type:"Free Weights",instructions:"Press weight overhead from shoulder level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"lateral-raise":{id:"lateral-raise",name:"Lateral Raise",category:"shoulders",type:"Free Weights",instructions:"Raise dumbbells to sides to shoulder height",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"front-raise":{id:"front-raise",name:"Front Raise",category:"shoulders",type:"Free Weights",instructions:"Raise weight in front to shoulder height",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"bicep-curl":{id:"bicep-curl",name:"Bicep Curl",category:"arms",type:"Free Weights",instructions:"Curl weight up to shoulder level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"tricep-dip":{id:"tricep-dip",name:"Tricep Dips",category:"arms",type:"Bodyweight",instructions:"Lower body by bending elbows, push back up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"tricep-extension":{id:"tricep-extension",name:"Tricep Extension",category:"arms",type:"Free Weights",instructions:"Extend arm overhead with weight",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"hammer-curl":{id:"hammer-curl",name:"Hammer Curl",category:"arms",type:"Free Weights",instructions:"Curl dumbbells with neutral grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},squat:{id:"squat",name:"Squat",category:"legs",type:"Free Weights",instructions:"Lower hips until thighs parallel to ground",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-press":{id:"leg-press",name:"Leg Press",category:"legs",type:"Machine",instructions:"Push platform away with legs",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-curl":{id:"leg-curl",name:"Leg Curl",category:"legs",type:"Machine",instructions:"Curl legs up toward glutes",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-extension":{id:"leg-extension",name:"Leg Extension",category:"legs",type:"Machine",instructions:"Extend legs straight out",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},lunge:{id:"lunge",name:"Lunges",category:"legs",type:"Bodyweight",instructions:"Step forward and lower back knee",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"calf-raise":{id:"calf-raise",name:"Calf Raises",category:"legs",type:"Bodyweight",instructions:"Raise heels off ground",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},plank:{id:"plank",name:"Plank",category:"core",type:"Bodyweight",instructions:"Hold body straight in push-up position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},crunch:{id:"crunch",name:"Crunches",category:"core",type:"Bodyweight",instructions:"Lift shoulders off ground toward knees",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"russian-twist":{id:"russian-twist",name:"Russian Twist",category:"core",type:"Bodyweight",instructions:"Rotate torso side to side while seated",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-raise":{id:"leg-raise",name:"Leg Raises",category:"core",type:"Bodyweight",instructions:"Raise legs while lying on back",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},running:{id:"running",name:"Running",category:"cardio",type:"Cardio",instructions:"Run at steady pace",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},cycling:{id:"cycling",name:"Cycling",category:"cardio",type:"Cardio",instructions:"Cycle at steady pace",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},rowing:{id:"rowing",name:"Rowing Machine",category:"cardio",type:"Machine",instructions:"Pull handle to chest, extend legs",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"jump-rope":{id:"jump-rope",name:"Jump Rope",category:"cardio",type:"Bodyweight",instructions:"Jump over rope continuously",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""}},l())}function g(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}function f(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function u(e){const t=Math.floor(e/3600),a=Math.floor(e%3600/60),i=e%60;return t>0?`${t}h ${a}m`:a>0?`${a}m ${i}s`:`${i}s`}function n(e,t={}){s.currentScreen=e,s.scrollPosition=0,t.category&&(s.selectedCategory=t.category),t.exercise&&(s.selectedExercise=t.exercise),d()}function k(){s.activeWorkout={id:g(),startTime:Date.now(),exercises:[],notes:""},n("workout")}function C(e){s.activeWorkout&&(s.activeWorkout.exercises.push({exerciseId:e,sets:[],notes:""}),l(),d())}function x(e){if(!s.activeWorkout)return;s.activeWorkout.exercises[e].sets.push({reps:0,weight:0,time:0,distance:0,completed:!1}),l(),d()}function $(e,t,a,i){if(!s.activeWorkout)return;const o=s.activeWorkout.exercises[e].sets[t];o[a]=i,l(),d()}function L(){s.activeWorkout&&(s.activeWorkout.endTime=Date.now(),s.activeWorkout.duration=Math.floor((s.activeWorkout.endTime-s.activeWorkout.startTime)/1e3),s.workouts||(s.workouts={}),s.workouts[s.activeWorkout.id]=s.activeWorkout,s.activeWorkout=null,l(),n("home"))}function W(){s.activeWorkout=null,n("home")}function h(e){s.favorites.has(e)?s.favorites.delete(e):s.favorites.add(e),s.exercises[e]&&(s.exercises[e].isFavorite=s.favorites.has(e)),l(),d()}function U(e,t,a,i){const o=g();s.exercises[o]={id:o,name:e,category:t,type:a,instructions:i,imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!0,notes:""},l(),n("library")}function F(e,t){const a=g();s.categories[a]={id:a,name:e,muscleGroup:t,isCustom:!0},l(),d()}function q(e,t){s.exercises[e]&&(s.exercises[e].notes=t,l())}function T(e,t){s.activeWorkout&&s.activeWorkout.exercises[e]&&(s.activeWorkout.exercises[e].notes=t,l())}function A(e){const t=s.workouts[e];if(!t)return"";let a=`WORKOUT REPORT
`;return a+=`Date: ${f(t.startTime)}
`,a+=`Duration: ${u(t.duration)}
`,a+=`
`,t.exercises.forEach((i,o)=>{const r=s.exercises[i.exerciseId];r&&(a+=`${o+1}. ${r.name}
`,i.sets.forEach((c,m)=>{a+=`   Set ${m+1}: `,c.reps>0&&(a+=`${c.reps} reps `),c.weight>0&&(a+=`@ ${c.weight} lbs `),c.time>0&&(a+=`${c.time}s `),c.distance>0&&(a+=`${c.distance}m `),a+=`
`}),i.notes&&(a+=`   Notes: ${i.notes}
`),a+=`
`)}),t.notes&&(a+=`Workout Notes: ${t.notes}
`),a}function B(){const e=Object.values(s.workouts).sort((i,o)=>o.startTime-i.startTime);let t=`PROGRESS REPORT
`;t+=`Total Workouts: ${e.length}
`,t+=`
`;const a={};return e.forEach(i=>{i.exercises.forEach(o=>{const r=s.exercises[o.exerciseId];r&&(a[r.name]=(a[r.name]||0)+1)})}),t+=`Most Frequent Exercises:
`,Object.entries(a).sort((i,o)=>o[1]-i[1]).slice(0,5).forEach(([i,o])=>{t+=`- ${i}: ${o} times
`}),t+=`
`,t+=`Recent Workouts:
`,e.slice(0,5).forEach(i=>{t+=`- ${f(i.startTime)}: ${i.exercises.length} exercises, ${u(i.duration)}
`}),t}function y(e){typeof PluginMessageHandler<"u"?PluginMessageHandler.postMessage(JSON.stringify({message:`Please save this workout report:

${e}`,wantsJournalEntry:!0})):(console.log("Report:",e),alert("Report exported to console (journal entry in R1 device)"))}function M(e){if(typeof PluginMessageHandler<"u"){const t={message:JSON.stringify({query_params:{engine:"google_images",q:`${e} exercise demonstration`,hl:"en",gl:"us",tbs:"sur:cl",ijn:0,num:1},useLocation:!1}),useSerpAPI:!0};PluginMessageHandler.postMessage(JSON.stringify(t))}}window.onPluginMessage=function(e){if(console.log("Received plugin message:",e),e.data)try{const t=typeof e.data=="string"?JSON.parse(e.data):e.data;if(t.images_results&&t.images_results.length>0){const a=t.images_results[0].thumbnail||t.images_results[0].original;s.selectedExercise&&s.exercises[s.selectedExercise]&&(s.exercises[s.selectedExercise].imageUrl=a,l(),d())}}catch(t){console.error("Error parsing plugin message:",t)}};function d(){const e=document.getElementById("app");switch(s.currentScreen){case"home":b(e);break;case"library":P(e);break;case"workout":j(e);break;case"history":J(e);break;case"reports":z(e);break;case"exerciseDetail":I(e);break;case"addExercise":V(e);break;case"addCategory":X(e);break;case"favorites":O(e);break;default:b(e)}}function b(e){e.innerHTML=`
    <div class="screen home-screen">
      <h1>Workout Tracker</h1>
      
      <div class="menu-container">
        ${s.activeWorkout?`
          <button class="menu-btn active-workout" data-action="continueWorkout">
            <span class="icon">▶</span>
            <span>Continue Workout</span>
          </button>
        `:`
          <button class="menu-btn" data-action="startWorkout">
            <span class="icon">+</span>
            <span>Start Workout</span>
          </button>
        `}
        
        <button class="menu-btn" data-action="library">
          <span class="icon">📚</span>
          <span>Exercise Library</span>
        </button>
        
        <button class="menu-btn" data-action="favorites">
          <span class="icon">⭐</span>
          <span>Favorites</span>
        </button>
        
        <button class="menu-btn" data-action="history">
          <span class="icon">📊</span>
          <span>History</span>
        </button>
        
        <button class="menu-btn" data-action="reports">
          <span class="icon">📄</span>
          <span>Reports</span>
        </button>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${Object.keys(s.workouts).length}</div>
          <div class="stat-label">Total Workouts</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Object.keys(s.exercises).length}</div>
          <div class="stat-label">Exercises</div>
        </div>
      </div>
    </div>
  `,R()}function R(){document.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",t=>{switch(t.currentTarget.dataset.action){case"startWorkout":k();break;case"continueWorkout":n("workout");break;case"library":n("library");break;case"favorites":n("favorites");break;case"history":n("history");break;case"reports":n("reports");break}})})}function P(e){const t=Object.values(s.categories),a=Object.values(s.exercises);e.innerHTML=`
    <div class="screen library-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Exercise Library</h2>
        <button class="add-btn" data-action="add">+</button>
      </div>
      
      <div class="scrollable-content">
        ${t.map(i=>{const o=a.filter(r=>r.category===i.id);return`
            <div class="category-section">
              <div class="category-header">
                <h3>${i.name}</h3>
                <span class="count">${o.length}</span>
              </div>
              <div class="exercise-list">
                ${o.map(r=>`
                  <div class="exercise-item" data-exercise="${r.id}">
                    <div class="exercise-info">
                      <div class="exercise-name">${r.name}</div>
                      <div class="exercise-type">${r.type}</div>
                    </div>
                    <div class="exercise-actions">
                      <button class="fav-btn ${r.isFavorite?"active":""}" data-action="favorite" data-id="${r.id}">
                        ${r.isFavorite?"★":"☆"}
                      </button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `,H()}function H(){var e,t;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),(t=document.querySelector('[data-action="add"]'))==null||t.addEventListener("click",()=>n("addExercise")),document.querySelectorAll(".exercise-item").forEach(a=>{a.addEventListener("click",i=>{i.target.closest(".fav-btn")||n("exerciseDetail",{exercise:a.dataset.exercise})})}),document.querySelectorAll('[data-action="favorite"]').forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),h(a.dataset.id)})})}function O(e){const t=Object.values(s.exercises).filter(i=>i.isFavorite),a={};t.forEach(i=>{a[i.category]||(a[i.category]=[]),a[i.category].push(i)}),e.innerHTML=`
    <div class="screen favorites-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Favorites</h2>
      </div>
      
      <div class="scrollable-content">
        ${Object.keys(a).length===0?`
          <div class="empty-state">
            <p>No favorite exercises yet</p>
            <p class="hint">Star exercises in the library to add them here</p>
          </div>
        `:Object.entries(a).map(([i,o])=>`
            <div class="category-section">
              <div class="category-header">
                <h3>${s.categories[i].name}</h3>
                <span class="count">${o.length}</span>
              </div>
              <div class="exercise-list">
                ${o.map(c=>`
                  <div class="exercise-item" data-exercise="${c.id}">
                    <div class="exercise-info">
                      <div class="exercise-name">${c.name}</div>
                      <div class="exercise-type">${c.type}</div>
                    </div>
                    <div class="exercise-actions">
                      <button class="fav-btn active" data-action="favorite" data-id="${c.id}">★</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
      </div>
    </div>
  `,D()}function D(){var e;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),document.querySelectorAll(".exercise-item").forEach(t=>{t.addEventListener("click",a=>{a.target.closest(".fav-btn")||n("exerciseDetail",{exercise:t.dataset.exercise})})}),document.querySelectorAll('[data-action="favorite"]').forEach(t=>{t.addEventListener("click",a=>{a.stopPropagation(),h(t.dataset.id)})})}function I(e){var a;const t=s.exercises[s.selectedExercise];if(!t){n("library");return}e.innerHTML=`
    <div class="screen exercise-detail-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>${t.name}</h2>
        <button class="fav-btn ${t.isFavorite?"active":""}" data-action="favorite">
          ${t.isFavorite?"★":"☆"}
        </button>
      </div>
      
      <div class="scrollable-content">
        <div class="exercise-detail-content">
          <div class="detail-section">
            <div class="label">Type</div>
            <div class="value">${t.type}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Category</div>
            <div class="value">${((a=s.categories[t.category])==null?void 0:a.name)||"Unknown"}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Instructions</div>
            <div class="value">${t.instructions}</div>
          </div>
          
          ${t.imageUrl?`
            <div class="detail-section">
              <div class="label">Visual Guide</div>
              <img src="${t.imageUrl}" alt="${t.name}" class="exercise-image">
            </div>
          `:`
            <button class="action-btn" data-action="searchImage">
              <span class="icon">🔍</span>
              <span>Search Exercise Image</span>
            </button>
          `}
          
          <div class="detail-section">
            <div class="label">Notes</div>
            <textarea class="notes-input" placeholder="Add personal notes..." data-action="updateNotes">${t.notes||""}</textarea>
          </div>
          
          ${s.activeWorkout?`
            <button class="action-btn primary" data-action="addToWorkout">
              <span class="icon">+</span>
              <span>Add to Current Workout</span>
            </button>
          `:""}
        </div>
      </div>
    </div>
  `,N()}function N(){var t,a,i,o;(t=document.querySelector('[data-action="back"]'))==null||t.addEventListener("click",()=>n("library")),(a=document.querySelector('[data-action="favorite"]'))==null||a.addEventListener("click",()=>h(s.selectedExercise)),(i=document.querySelector('[data-action="searchImage"]'))==null||i.addEventListener("click",()=>{const r=s.exercises[s.selectedExercise];M(r.name)}),(o=document.querySelector('[data-action="addToWorkout"]'))==null||o.addEventListener("click",()=>{C(s.selectedExercise),n("workout")});const e=document.querySelector('[data-action="updateNotes"]');e&&e.addEventListener("blur",()=>{q(s.selectedExercise,e.value)})}function j(e){if(!s.activeWorkout){n("home");return}const t=Math.floor((Date.now()-s.activeWorkout.startTime)/1e3);e.innerHTML=`
    <div class="screen workout-screen">
      <div class="header">
        <button class="back-btn" data-action="cancel">✕ Cancel</button>
        <h2>Active Workout</h2>
        <button class="finish-btn" data-action="finish">✓</button>
      </div>
      
      <div class="workout-timer">
        ${u(t)}
      </div>
      
      <div class="scrollable-content">
        ${s.activeWorkout.exercises.length===0?`
          <div class="empty-state">
            <p>No exercises added yet</p>
            <button class="action-btn" data-action="addExercise">
              <span class="icon">+</span>
              <span>Add Exercise</span>
            </button>
          </div>
        `:`
          <div class="workout-exercises">
            ${s.activeWorkout.exercises.map((a,i)=>{const o=s.exercises[a.exerciseId];return o?`
                <div class="workout-exercise-item">
                  <div class="workout-exercise-header">
                    <h3>${o.name}</h3>
                    <button class="icon-btn" data-action="removeExercise" data-index="${i}">✕</button>
                  </div>
                  
                  <div class="sets-list">
                    ${a.sets.map((r,c)=>`
                      <div class="set-item">
                        <div class="set-number">Set ${c+1}</div>
                        <div class="set-inputs">
                          <input type="number" placeholder="Reps" value="${r.reps||""}" 
                                 data-action="updateSet" data-exercise="${i}" data-set="${c}" data-field="reps">
                          <input type="number" placeholder="Weight" value="${r.weight||""}" 
                                 data-action="updateSet" data-exercise="${i}" data-set="${c}" data-field="weight">
                        </div>
                        <button class="icon-btn small" data-action="removeSet" data-exercise="${i}" data-set="${c}">✕</button>
                      </div>
                    `).join("")}
                  </div>
                  
                  <button class="action-btn small" data-action="addSet" data-exercise="${i}">
                    <span class="icon">+</span>
                    <span>Add Set</span>
                  </button>
                  
                  <textarea class="notes-input small" placeholder="Exercise notes..." 
                            data-action="updateExerciseNotes" data-exercise="${i}">${a.notes||""}</textarea>
                </div>
              `:""}).join("")}
          </div>
          
          <button class="action-btn" data-action="addExercise">
            <span class="icon">+</span>
            <span>Add Another Exercise</span>
          </button>
        `}
      </div>
    </div>
  `,G()}function G(){var e,t,a;(e=document.querySelector('[data-action="cancel"]'))==null||e.addEventListener("click",()=>{confirm("Cancel workout? All progress will be lost.")&&W()}),(t=document.querySelector('[data-action="finish"]'))==null||t.addEventListener("click",()=>{if(s.activeWorkout.exercises.length===0){alert("Add at least one exercise before finishing");return}L()}),(a=document.querySelector('[data-action="addExercise"]'))==null||a.addEventListener("click",()=>{n("library")}),document.querySelectorAll('[data-action="addSet"]').forEach(i=>{i.addEventListener("click",()=>{x(parseInt(i.dataset.exercise))})}),document.querySelectorAll('[data-action="updateSet"]').forEach(i=>{i.addEventListener("input",o=>{const r=parseInt(o.target.dataset.exercise),c=parseInt(o.target.dataset.set),m=o.target.dataset.field,w=parseFloat(o.target.value)||0;$(r,c,m,w)})}),document.querySelectorAll('[data-action="updateExerciseNotes"]').forEach(i=>{i.addEventListener("blur",o=>{const r=parseInt(o.target.dataset.exercise);T(r,o.target.value)})}),document.querySelectorAll('[data-action="removeExercise"]').forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.index);s.activeWorkout.exercises.splice(o,1),l(),d()})}),document.querySelectorAll('[data-action="removeSet"]').forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.exercise),r=parseInt(i.dataset.set);s.activeWorkout.exercises[o].sets.splice(r,1),l(),d()})})}function J(e){const t=Object.values(s.workouts).sort((a,i)=>i.startTime-a.startTime);e.innerHTML=`
    <div class="screen history-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Workout History</h2>
      </div>
      
      <div class="scrollable-content">
        ${t.length===0?`
          <div class="empty-state">
            <p>No workouts yet</p>
            <p class="hint">Start your first workout to see it here</p>
          </div>
        `:`
          <div class="history-list">
            ${t.map(a=>`
              <div class="history-item" data-workout="${a.id}">
                <div class="history-date">${f(a.startTime)}</div>
                <div class="history-info">
                  <div class="history-exercises">${a.exercises.length} exercises</div>
                  <div class="history-duration">${u(a.duration)}</div>
                </div>
                <div class="history-preview">
                  ${a.exercises.slice(0,3).map(i=>{const o=s.exercises[i.exerciseId];return o?o.name:"Unknown"}).join(", ")}
                  ${a.exercises.length>3?"...":""}
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `,_()}function _(){var e;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),document.querySelectorAll(".history-item").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.workout,i=A(a);alert(i)})})}function z(e){e.innerHTML=`
    <div class="screen reports-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Reports</h2>
      </div>
      
      <div class="scrollable-content">
        <div class="report-options">
          <button class="action-btn" data-action="progressReport">
            <span class="icon">📈</span>
            <span>Generate Progress Report</span>
          </button>
          
          <button class="action-btn" data-action="exportAll">
            <span class="icon">💾</span>
            <span>Export All Data</span>
          </button>
        </div>
        
        <div id="reportDisplay" class="report-display"></div>
      </div>
    </div>
  `,K()}function K(){var e,t,a;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),(t=document.querySelector('[data-action="progressReport"]'))==null||t.addEventListener("click",()=>{var r;const i=B(),o=document.getElementById("reportDisplay");o.innerHTML=`
      <div class="report-content">
        <pre>${i}</pre>
        <button class="action-btn" data-action="export">Export to Journal</button>
      </div>
    `,(r=o.querySelector('[data-action="export"]'))==null||r.addEventListener("click",()=>{y(i)})}),(a=document.querySelector('[data-action="exportAll"]'))==null||a.addEventListener("click",()=>{const i={exercises:s.exercises,categories:s.categories,workouts:s.workouts,favorites:Array.from(s.favorites)},o=JSON.stringify(i,null,2);y(o)})}function V(e){const t=Object.values(s.categories);e.innerHTML=`
    <div class="screen add-exercise-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Add Exercise</h2>
      </div>
      
      <div class="scrollable-content">
        <form class="add-form" id="addExerciseForm">
          <div class="form-group">
            <label>Exercise Name</label>
            <input type="text" name="name" placeholder="e.g., Dumbbell Curl" required>
          </div>
          
          <div class="form-group">
            <label>Category</label>
            <select name="category" required>
              <option value="">Select category</option>
              ${t.map(a=>`
                <option value="${a.id}">${a.name}</option>
              `).join("")}
            </select>
          </div>
          
          <div class="form-group">
            <label>Type</label>
            <select name="type" required>
              <option value="">Select type</option>
              <option value="Free Weights">Free Weights</option>
              <option value="Machine">Machine</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Instructions</label>
            <textarea name="instructions" placeholder="How to perform this exercise" rows="4" required></textarea>
          </div>
          
          <button type="submit" class="action-btn primary">Add Exercise</button>
          <button type="button" class="action-btn" data-action="addCategory">+ Add New Category</button>
        </form>
      </div>
    </div>
  `,Q()}function Q(){var e,t,a;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("library")),(t=document.querySelector('[data-action="addCategory"]'))==null||t.addEventListener("click",()=>n("addCategory")),(a=document.getElementById("addExerciseForm"))==null||a.addEventListener("submit",i=>{i.preventDefault();const o=new FormData(i.target);U(o.get("name"),o.get("category"),o.get("type"),o.get("instructions"))})}function X(e){e.innerHTML=`
    <div class="screen add-category-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Add Category</h2>
      </div>
      
      <div class="scrollable-content">
        <form class="add-form" id="addCategoryForm">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" name="name" placeholder="e.g., Abs" required>
          </div>
          
          <div class="form-group">
            <label>Muscle Group</label>
            <select name="muscleGroup" required>
              <option value="">Select muscle group</option>
              <option value="Upper Body">Upper Body</option>
              <option value="Lower Body">Lower Body</option>
              <option value="Core">Core</option>
              <option value="Full Body">Full Body</option>
              <option value="Cardio">Cardio</option>
            </select>
          </div>
          
          <button type="submit" class="action-btn primary">Add Category</button>
        </form>
      </div>
    </div>
  `,Y()}function Y(){var e,t;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("addExercise")),(t=document.getElementById("addCategoryForm"))==null||t.addEventListener("submit",a=>{a.preventDefault();const i=new FormData(a.target);F(i.get("name"),i.get("muscleGroup")),n("addExercise")})}window.addEventListener("scrollUp",()=>{console.log("Scroll up detected")});window.addEventListener("scrollDown",()=>{console.log("Scroll down detected")});window.addEventListener("sideClick",()=>{if(console.log("Side button clicked"),s.currentScreen==="home"&&!s.activeWorkout)k();else if(s.currentScreen==="workout"&&s.activeWorkout&&s.activeWorkout.exercises.length>0){const e=s.activeWorkout.exercises.length-1;x(e)}});document.addEventListener("DOMContentLoaded",async()=>{console.log("Workout Tracker initialized"),typeof PluginMessageHandler>"u"&&window.addEventListener("keydown",e=>{e.code==="Space"&&(e.preventDefault(),window.dispatchEvent(new CustomEvent("sideClick")))}),await E(),S(),d(),setInterval(()=>{if(s.activeWorkout&&s.currentScreen==="workout"){const e=document.querySelector(".workout-timer");if(e){const t=Math.floor((Date.now()-s.activeWorkout.startTime)/1e3);e.textContent=u(t)}}},1e3)});
