(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const r of o)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(o){const r={};return o.integrity&&(r.integrity=o.integrity),o.referrerPolicy&&(r.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?r.credentials="include":o.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(o){if(o.ep)return;o.ep=!0;const r=a(o);fetch(o.href,r)}})();const t={currentScreen:"home",exercises:{},categories:{},workouts:{},activeWorkout:null,favorites:new Set,selectedCategory:null,selectedExercise:null,scrollPosition:0,isLoading:!1,stopwatch:{isRunning:!1,startTime:null,elapsed:0,laps:[]}};async function m(e,s){if(window.creationStorage)try{const a=btoa(JSON.stringify(s));await window.creationStorage.plain.setItem(e,a),console.log(`Saved ${e} to storage`)}catch(a){console.error("Error saving to storage:",a)}else localStorage.setItem(e,JSON.stringify(s))}async function p(e){if(window.creationStorage)try{const s=await window.creationStorage.plain.getItem(e);if(s)return JSON.parse(atob(s))}catch(s){console.error("Error loading from storage:",s)}else{const s=localStorage.getItem(e);if(s)return JSON.parse(s)}return null}async function d(){await m("exercises",t.exercises),await m("categories",t.categories),await m("workouts",t.workouts),await m("favorites",Array.from(t.favorites))}async function h(){t.activeWorkout&&await m("activeWorkout",t.activeWorkout)}async function C(){if(window.creationStorage)try{await window.creationStorage.plain.removeItem("activeWorkout")}catch(e){console.error("Error clearing active workout:",e)}else localStorage.removeItem("activeWorkout")}async function R(){const e=await p("exercises"),s=await p("categories"),a=await p("workouts"),i=await p("favorites"),o=await p("activeWorkout");e&&(t.exercises=e),s&&(t.categories=s),a&&(t.workouts=a),i&&(t.favorites=new Set(i)),o&&(t.activeWorkout=o)}function M(){Object.keys(t.categories).length>0||(t.categories={chest:{id:"chest",name:"Chest",muscleGroup:"Upper Body",isCustom:!1},back:{id:"back",name:"Back",muscleGroup:"Upper Body",isCustom:!1},shoulders:{id:"shoulders",name:"Shoulders",muscleGroup:"Upper Body",isCustom:!1},arms:{id:"arms",name:"Arms",muscleGroup:"Upper Body",isCustom:!1},legs:{id:"legs",name:"Legs",muscleGroup:"Lower Body",isCustom:!1},core:{id:"core",name:"Core",muscleGroup:"Core",isCustom:!1},cardio:{id:"cardio",name:"Cardio",muscleGroup:"Cardio",isCustom:!1}},t.exercises={"bench-press":{id:"bench-press",name:"Bench Press",category:"chest",type:"Free Weights",instructions:"Lie on bench, lower bar to chest, press up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"incline-bench":{id:"incline-bench",name:"Incline Bench Press",category:"chest",type:"Free Weights",instructions:"Press on incline bench targeting upper chest",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"decline-bench":{id:"decline-bench",name:"Decline Bench Press",category:"chest",type:"Free Weights",instructions:"Press on decline bench targeting lower chest",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dumbbell-press":{id:"dumbbell-press",name:"Dumbbell Press",category:"chest",type:"Free Weights",instructions:"Press dumbbells from chest level upward",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"incline-dumbbell":{id:"incline-dumbbell",name:"Incline Dumbbell Press",category:"chest",type:"Free Weights",instructions:"Press dumbbells on incline bench",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"chest-fly":{id:"chest-fly",name:"Chest Fly Machine",category:"chest",type:"Machine",instructions:"Bring handles together in front of chest",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dumbbell-fly":{id:"dumbbell-fly",name:"Dumbbell Fly",category:"chest",type:"Free Weights",instructions:"Arc dumbbells from sides to center",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"cable-crossover":{id:"cable-crossover",name:"Cable Crossover",category:"chest",type:"Machine",instructions:"Pull cables from high to low across body",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},pushup:{id:"pushup",name:"Push-ups",category:"chest",type:"Bodyweight",instructions:"Lower body to ground, push back up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"diamond-pushup":{id:"diamond-pushup",name:"Diamond Push-ups",category:"chest",type:"Bodyweight",instructions:"Push-ups with hands forming diamond shape",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"wide-pushup":{id:"wide-pushup",name:"Wide Push-ups",category:"chest",type:"Bodyweight",instructions:"Push-ups with hands wider than shoulders",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"chest-dip":{id:"chest-dip",name:"Chest Dips",category:"chest",type:"Bodyweight",instructions:"Dips with body leaning forward",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"pec-deck":{id:"pec-deck",name:"Pec Deck",category:"chest",type:"Machine",instructions:"Bring pads together using chest muscles",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"svend-press":{id:"svend-press",name:"Svend Press",category:"chest",type:"Free Weights",instructions:"Press plates together and extend forward",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"landmine-press":{id:"landmine-press",name:"Landmine Press",category:"chest",type:"Free Weights",instructions:"Press barbell from chest at angle",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},deadlift:{id:"deadlift",name:"Deadlift",category:"back",type:"Free Weights",instructions:"Lift bar from ground to hip level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"romanian-deadlift":{id:"romanian-deadlift",name:"Romanian Deadlift",category:"back",type:"Free Weights",instructions:"Hinge at hips, lower bar to shins",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},pullup:{id:"pullup",name:"Pull-ups",category:"back",type:"Bodyweight",instructions:"Pull body up until chin over bar",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},chinup:{id:"chinup",name:"Chin-ups",category:"back",type:"Bodyweight",instructions:"Pull-ups with underhand grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"lat-pulldown":{id:"lat-pulldown",name:"Lat Pulldown",category:"back",type:"Machine",instructions:"Pull bar down to chest level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"barbell-row":{id:"barbell-row",name:"Barbell Row",category:"back",type:"Free Weights",instructions:"Pull bar to lower chest while bent over",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dumbbell-row":{id:"dumbbell-row",name:"Dumbbell Row",category:"back",type:"Free Weights",instructions:"Row dumbbell to hip while supported",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"seated-row":{id:"seated-row",name:"Seated Cable Row",category:"back",type:"Machine",instructions:"Pull cable handles to torso",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"t-bar-row":{id:"t-bar-row",name:"T-Bar Row",category:"back",type:"Machine",instructions:"Row T-bar to chest in bent position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"face-pull":{id:"face-pull",name:"Face Pulls",category:"back",type:"Machine",instructions:"Pull rope to face level, elbows high",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"inverted-row":{id:"inverted-row",name:"Inverted Row",category:"back",type:"Bodyweight",instructions:"Row body up to bar from underneath",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},hyperextension:{id:"hyperextension",name:"Hyperextensions",category:"back",type:"Bodyweight",instructions:"Extend back from bent position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"straight-arm-pulldown":{id:"straight-arm-pulldown",name:"Straight Arm Pulldown",category:"back",type:"Machine",instructions:"Pull bar down with straight arms",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},shrug:{id:"shrug",name:"Shrugs",category:"back",type:"Free Weights",instructions:"Raise shoulders toward ears with weight",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"rack-pull":{id:"rack-pull",name:"Rack Pulls",category:"back",type:"Free Weights",instructions:"Deadlift from elevated position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"shoulder-press":{id:"shoulder-press",name:"Shoulder Press",category:"shoulders",type:"Free Weights",instructions:"Press weight overhead from shoulder level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"military-press":{id:"military-press",name:"Military Press",category:"shoulders",type:"Free Weights",instructions:"Strict overhead press with barbell",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dumbbell-shoulder-press":{id:"dumbbell-shoulder-press",name:"Dumbbell Shoulder Press",category:"shoulders",type:"Free Weights",instructions:"Press dumbbells overhead alternately or together",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"arnold-press":{id:"arnold-press",name:"Arnold Press",category:"shoulders",type:"Free Weights",instructions:"Press with rotation from front to sides",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"lateral-raise":{id:"lateral-raise",name:"Lateral Raise",category:"shoulders",type:"Free Weights",instructions:"Raise dumbbells to sides to shoulder height",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"front-raise":{id:"front-raise",name:"Front Raise",category:"shoulders",type:"Free Weights",instructions:"Raise weight in front to shoulder height",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"rear-delt-fly":{id:"rear-delt-fly",name:"Rear Delt Fly",category:"shoulders",type:"Free Weights",instructions:"Raise dumbbells to sides while bent over",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"upright-row":{id:"upright-row",name:"Upright Row",category:"shoulders",type:"Free Weights",instructions:"Pull bar up along body to chin level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"cable-lateral-raise":{id:"cable-lateral-raise",name:"Cable Lateral Raise",category:"shoulders",type:"Machine",instructions:"Raise cable handle to side",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"pike-pushup":{id:"pike-pushup",name:"Pike Push-ups",category:"shoulders",type:"Bodyweight",instructions:"Push-ups with hips raised high",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"handstand-pushup":{id:"handstand-pushup",name:"Handstand Push-ups",category:"shoulders",type:"Bodyweight",instructions:"Push-ups in handstand position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"shoulder-shrug":{id:"shoulder-shrug",name:"Shoulder Shrugs",category:"shoulders",type:"Free Weights",instructions:"Elevate shoulders with dumbbells",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"bicep-curl":{id:"bicep-curl",name:"Bicep Curl",category:"arms",type:"Free Weights",instructions:"Curl weight up to shoulder level",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"hammer-curl":{id:"hammer-curl",name:"Hammer Curl",category:"arms",type:"Free Weights",instructions:"Curl dumbbells with neutral grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"preacher-curl":{id:"preacher-curl",name:"Preacher Curl",category:"arms",type:"Free Weights",instructions:"Curl on preacher bench for isolation",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"concentration-curl":{id:"concentration-curl",name:"Concentration Curl",category:"arms",type:"Free Weights",instructions:"Curl dumbbell while seated, elbow on thigh",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"cable-curl":{id:"cable-curl",name:"Cable Curl",category:"arms",type:"Machine",instructions:"Curl cable bar to shoulders",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"ez-bar-curl":{id:"ez-bar-curl",name:"EZ Bar Curl",category:"arms",type:"Free Weights",instructions:"Curl EZ bar with angled grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"tricep-dip":{id:"tricep-dip",name:"Tricep Dips",category:"arms",type:"Bodyweight",instructions:"Lower body by bending elbows, push back up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"tricep-extension":{id:"tricep-extension",name:"Tricep Extension",category:"arms",type:"Free Weights",instructions:"Extend arm overhead with weight",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"skull-crusher":{id:"skull-crusher",name:"Skull Crushers",category:"arms",type:"Free Weights",instructions:"Lower bar to forehead, extend back up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"tricep-pushdown":{id:"tricep-pushdown",name:"Tricep Pushdown",category:"arms",type:"Machine",instructions:"Push cable bar down to full extension",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"close-grip-bench":{id:"close-grip-bench",name:"Close Grip Bench Press",category:"arms",type:"Free Weights",instructions:"Bench press with narrow grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"overhead-extension":{id:"overhead-extension",name:"Overhead Tricep Extension",category:"arms",type:"Free Weights",instructions:"Extend dumbbell overhead behind head",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"rope-pushdown":{id:"rope-pushdown",name:"Rope Pushdown",category:"arms",type:"Machine",instructions:"Push rope down and apart",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"wrist-curl":{id:"wrist-curl",name:"Wrist Curls",category:"arms",type:"Free Weights",instructions:"Curl wrists with forearms on bench",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"reverse-curl":{id:"reverse-curl",name:"Reverse Curl",category:"arms",type:"Free Weights",instructions:"Curl with overhand grip",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},squat:{id:"squat",name:"Squat",category:"legs",type:"Free Weights",instructions:"Lower hips until thighs parallel to ground",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"front-squat":{id:"front-squat",name:"Front Squat",category:"legs",type:"Free Weights",instructions:"Squat with bar on front of shoulders",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"goblet-squat":{id:"goblet-squat",name:"Goblet Squat",category:"legs",type:"Free Weights",instructions:"Squat holding dumbbell at chest",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-press":{id:"leg-press",name:"Leg Press",category:"legs",type:"Machine",instructions:"Push platform away with legs",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-curl":{id:"leg-curl",name:"Leg Curl",category:"legs",type:"Machine",instructions:"Curl legs up toward glutes",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-extension":{id:"leg-extension",name:"Leg Extension",category:"legs",type:"Machine",instructions:"Extend legs straight out",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},lunge:{id:"lunge",name:"Lunges",category:"legs",type:"Bodyweight",instructions:"Step forward and lower back knee",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"walking-lunge":{id:"walking-lunge",name:"Walking Lunges",category:"legs",type:"Bodyweight",instructions:"Lunge forward alternating legs",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"bulgarian-split-squat":{id:"bulgarian-split-squat",name:"Bulgarian Split Squat",category:"legs",type:"Bodyweight",instructions:"Single leg squat with rear foot elevated",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"calf-raise":{id:"calf-raise",name:"Calf Raises",category:"legs",type:"Bodyweight",instructions:"Raise heels off ground",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"seated-calf-raise":{id:"seated-calf-raise",name:"Seated Calf Raise",category:"legs",type:"Machine",instructions:"Raise heels while seated",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"hack-squat":{id:"hack-squat",name:"Hack Squat",category:"legs",type:"Machine",instructions:"Squat on hack squat machine",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"step-up":{id:"step-up",name:"Step-ups",category:"legs",type:"Bodyweight",instructions:"Step up onto elevated platform",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"glute-bridge":{id:"glute-bridge",name:"Glute Bridge",category:"legs",type:"Bodyweight",instructions:"Raise hips off ground while on back",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"hip-thrust":{id:"hip-thrust",name:"Hip Thrust",category:"legs",type:"Free Weights",instructions:"Thrust hips up with weight on lap",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},plank:{id:"plank",name:"Plank",category:"core",type:"Bodyweight",instructions:"Hold body straight in push-up position",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"side-plank":{id:"side-plank",name:"Side Plank",category:"core",type:"Bodyweight",instructions:"Hold body sideways on one elbow",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},crunch:{id:"crunch",name:"Crunches",category:"core",type:"Bodyweight",instructions:"Lift shoulders off ground toward knees",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"bicycle-crunch":{id:"bicycle-crunch",name:"Bicycle Crunches",category:"core",type:"Bodyweight",instructions:"Crunch with alternating knee to elbow",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"russian-twist":{id:"russian-twist",name:"Russian Twist",category:"core",type:"Bodyweight",instructions:"Rotate torso side to side while seated",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"leg-raise":{id:"leg-raise",name:"Leg Raises",category:"core",type:"Bodyweight",instructions:"Raise legs while lying on back",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"hanging-leg-raise":{id:"hanging-leg-raise",name:"Hanging Leg Raise",category:"core",type:"Bodyweight",instructions:"Raise legs while hanging from bar",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"mountain-climber":{id:"mountain-climber",name:"Mountain Climbers",category:"core",type:"Bodyweight",instructions:"Alternate bringing knees to chest in plank",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"ab-wheel":{id:"ab-wheel",name:"Ab Wheel Rollout",category:"core",type:"Bodyweight",instructions:"Roll ab wheel forward and back",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"cable-crunch":{id:"cable-crunch",name:"Cable Crunch",category:"core",type:"Machine",instructions:"Crunch down against cable resistance",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"wood-chop":{id:"wood-chop",name:"Wood Chops",category:"core",type:"Machine",instructions:"Rotate and pull cable diagonally",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"dead-bug":{id:"dead-bug",name:"Dead Bug",category:"core",type:"Bodyweight",instructions:"Alternate extending opposite arm and leg",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},running:{id:"running",name:"Running",category:"cardio",type:"Cardio",instructions:"Run at steady pace",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},treadmill:{id:"treadmill",name:"Treadmill",category:"cardio",type:"Machine",instructions:"Run or walk on treadmill",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},cycling:{id:"cycling",name:"Cycling",category:"cardio",type:"Cardio",instructions:"Cycle at steady pace",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"stationary-bike":{id:"stationary-bike",name:"Stationary Bike",category:"cardio",type:"Machine",instructions:"Cycle on stationary bike",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},rowing:{id:"rowing",name:"Rowing Machine",category:"cardio",type:"Machine",instructions:"Pull handle to chest, extend legs",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"jump-rope":{id:"jump-rope",name:"Jump Rope",category:"cardio",type:"Bodyweight",instructions:"Jump over rope continuously",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},burpee:{id:"burpee",name:"Burpees",category:"cardio",type:"Bodyweight",instructions:"Drop to plank, push up, jump up",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},elliptical:{id:"elliptical",name:"Elliptical",category:"cardio",type:"Machine",instructions:"Use elliptical machine at steady pace",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"stair-climber":{id:"stair-climber",name:"Stair Climber",category:"cardio",type:"Machine",instructions:"Climb stairs on machine",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""},"jumping-jack":{id:"jumping-jack",name:"Jumping Jacks",category:"cardio",type:"Bodyweight",instructions:"Jump with arms and legs spreading",imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!1,notes:""}},d())}function y(){return Date.now().toString(36)+Math.random().toString(36).substr(2)}function b(e){return new Date(e).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function g(e){const s=Math.floor(e/3600),a=Math.floor(e%3600/60),i=e%60;return s>0?`${s}h ${a}m`:a>0?`${a}m ${i}s`:`${i}s`}function n(e,s={}){t.currentScreen=e,t.scrollPosition=0,s.category&&(t.selectedCategory=s.category),s.exercise&&(t.selectedExercise=s.exercise),l()}function x(){t.activeWorkout={id:y(),startTime:Date.now(),exercises:[],notes:""},n("workout")}function q(e){t.activeWorkout&&(t.activeWorkout.exercises.push({exerciseId:e,sets:[],notes:""}),d(),h(),l())}function F(e){if(!t.activeWorkout)return;t.activeWorkout.exercises[e].sets.push({reps:0,weight:0,time:0,distance:0,completed:!1}),d(),h(),l()}function T(e,s,a,i){if(!t.activeWorkout)return;const o=t.activeWorkout.exercises[e].sets[s];o[a]=i,d(),h(),l()}function D(){t.activeWorkout&&(t.activeWorkout.endTime=Date.now(),t.activeWorkout.duration=Math.floor((t.activeWorkout.endTime-t.activeWorkout.startTime)/1e3),t.workouts||(t.workouts={}),t.workouts[t.activeWorkout.id]=t.activeWorkout,t.activeWorkout=null,d(),C(),n("home"))}function A(){t.activeWorkout=null,C(),n("home")}function w(e){t.favorites.has(e)?t.favorites.delete(e):t.favorites.add(e),t.exercises[e]&&(t.exercises[e].isFavorite=t.favorites.has(e)),d(),l()}function H(e,s,a,i){const o=y();t.exercises[o]={id:o,name:e,category:s,type:a,instructions:i,imageUrl:"",videoUrl:"",isFavorite:!1,isCustom:!0,notes:""},d(),n("library")}function I(e,s){const a=y();t.categories[a]={id:a,name:e,muscleGroup:s,isCustom:!0},d(),l()}function O(e,s){t.exercises[e]&&(t.exercises[e].notes=s,d())}function j(e,s){t.activeWorkout&&t.activeWorkout.exercises[e]&&(t.activeWorkout.exercises[e].notes=s,d(),h())}function N(e){const s=t.workouts[e];if(!s)return"";let a=`WORKOUT REPORT
`;return a+=`Date: ${b(s.startTime)}
`,a+=`Duration: ${g(s.duration)}
`,a+=`
`,s.exercises.forEach((i,o)=>{const r=t.exercises[i.exerciseId];r&&(a+=`${o+1}. ${r.name}
`,i.sets.forEach((c,u)=>{a+=`   Set ${u+1}: `,c.reps>0&&(a+=`${c.reps} reps `),c.weight>0&&(a+=`@ ${c.weight} lbs `),c.time>0&&(a+=`${c.time}s `),c.distance>0&&(a+=`${c.distance}m `),a+=`
`}),i.notes&&(a+=`   Notes: ${i.notes}
`),a+=`
`)}),s.notes&&(a+=`Workout Notes: ${s.notes}
`),a}function G(){const e=Object.values(t.workouts).sort((i,o)=>o.startTime-i.startTime);let s=`PROGRESS REPORT
`;s+=`Total Workouts: ${e.length}
`,s+=`
`;const a={};return e.forEach(i=>{i.exercises.forEach(o=>{const r=t.exercises[o.exerciseId];r&&(a[r.name]=(a[r.name]||0)+1)})}),s+=`Most Frequent Exercises:
`,Object.entries(a).sort((i,o)=>o[1]-i[1]).slice(0,5).forEach(([i,o])=>{s+=`- ${i}: ${o} times
`}),s+=`
`,s+=`Recent Workouts:
`,e.slice(0,5).forEach(i=>{s+=`- ${b(i.startTime)}: ${i.exercises.length} exercises, ${g(i.duration)}
`}),s}function k(e){typeof PluginMessageHandler<"u"?PluginMessageHandler.postMessage(JSON.stringify({message:`Please save this workout report:

${e}`,wantsJournalEntry:!0})):(console.log("Report:",e),alert("Report exported to console (journal entry in R1 device)"))}function J(e){if(typeof PluginMessageHandler<"u"){const s={message:JSON.stringify({query_params:{engine:"google_images",q:`${e} exercise demonstration`,hl:"en",gl:"us",tbs:"sur:cl",ijn:0,num:1},useLocation:!1}),useSerpAPI:!0};PluginMessageHandler.postMessage(JSON.stringify(s))}}window.onPluginMessage=function(e){if(console.log("Received plugin message:",e),e.data)try{const s=typeof e.data=="string"?JSON.parse(e.data):e.data;if(s.images_results&&s.images_results.length>0){const a=s.images_results[0].thumbnail||s.images_results[0].original;t.selectedExercise&&t.exercises[t.selectedExercise]&&(t.exercises[t.selectedExercise].imageUrl=a,d(),l())}}catch(s){console.error("Error parsing plugin message:",s)}};function l(){const e=document.getElementById("app");switch(t.currentScreen){case"home":U(e);break;case"library":z(e);break;case"workout":Y(e);break;case"history":te(e);break;case"reports":ae(e);break;case"exerciseDetail":Q(e);break;case"addExercise":oe(e);break;case"addCategory":ne(e);break;case"favorites":V(e);break;case"stopwatch":ue(e);break;default:U(e)}}function U(e){e.innerHTML=`
    <div class="screen home-screen">
      <div class="home-screen-content">
        <h1>Workout Tracker</h1>
        
        <div class="menu-container">
          ${t.activeWorkout?`
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
          
          <button class="menu-btn" data-action="stopwatch">
            <span class="icon">⏱️</span>
            <span>Stopwatch</span>
          </button>
          
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
            <div class="stat-value">${Object.keys(t.workouts).length}</div>
            <div class="stat-label">Total Workouts</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Object.keys(t.exercises).length}</div>
            <div class="stat-label">Exercises</div>
          </div>
        </div>
      </div>
    </div>
  `,_()}function _(){document.querySelectorAll("[data-action]").forEach(e=>{e.addEventListener("click",s=>{switch(s.currentTarget.dataset.action){case"startWorkout":x();break;case"continueWorkout":n("workout");break;case"stopwatch":n("stopwatch");break;case"library":n("library");break;case"favorites":n("favorites");break;case"history":n("history");break;case"reports":n("reports");break}})})}function z(e){const s=Object.values(t.categories),a=Object.values(t.exercises);e.innerHTML=`
    <div class="screen library-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Exercise Library</h2>
        <button class="add-btn" data-action="add">+</button>
      </div>
      
      <div class="library-toc">
        <div class="toc-title">Quick Navigation</div>
        <div class="toc-items">
          ${s.map(i=>`
            <button class="toc-item" data-action="scrollToCategory" data-category="${i.id}">
              ${i.name}
            </button>
          `).join("")}
        </div>
      </div>
      
      <div class="scrollable-content" id="libraryContent">
        ${s.map(i=>{const o=a.filter(r=>r.category===i.id);return`
            <div class="category-section" id="category-${i.id}">
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
  `,K()}function K(){var e,s;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),(s=document.querySelector('[data-action="add"]'))==null||s.addEventListener("click",()=>n("addExercise")),document.querySelectorAll('[data-action="scrollToCategory"]').forEach(a=>{a.addEventListener("click",()=>{const i=a.dataset.category,o=document.getElementById(`category-${i}`);o&&o.scrollIntoView({behavior:"smooth",block:"start"})})}),document.querySelectorAll(".exercise-item").forEach(a=>{a.addEventListener("click",i=>{i.target.closest(".fav-btn")||n("exerciseDetail",{exercise:a.dataset.exercise})})}),document.querySelectorAll('[data-action="favorite"]').forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),w(a.dataset.id)})})}function V(e){const s=Object.values(t.exercises).filter(i=>i.isFavorite),a={};s.forEach(i=>{a[i.category]||(a[i.category]=[]),a[i.category].push(i)}),e.innerHTML=`
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
                <h3>${t.categories[i].name}</h3>
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
  `,Z()}function Z(){var e;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),document.querySelectorAll(".exercise-item").forEach(s=>{s.addEventListener("click",a=>{a.target.closest(".fav-btn")||n("exerciseDetail",{exercise:s.dataset.exercise})})}),document.querySelectorAll('[data-action="favorite"]').forEach(s=>{s.addEventListener("click",a=>{a.stopPropagation(),w(s.dataset.id)})})}function Q(e){var a;const s=t.exercises[t.selectedExercise];if(!s){n("library");return}e.innerHTML=`
    <div class="screen exercise-detail-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>${s.name}</h2>
        <button class="fav-btn ${s.isFavorite?"active":""}" data-action="favorite">
          ${s.isFavorite?"★":"☆"}
        </button>
      </div>
      
      <div class="scrollable-content">
        <div class="exercise-detail-content">
          <div class="detail-section">
            <div class="label">Type</div>
            <div class="value">${s.type}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Category</div>
            <div class="value">${((a=t.categories[s.category])==null?void 0:a.name)||"Unknown"}</div>
          </div>
          
          <div class="detail-section">
            <div class="label">Instructions</div>
            <div class="value">${s.instructions}</div>
          </div>
          
          ${s.imageUrl?`
            <div class="detail-section">
              <div class="label">Visual Guide</div>
              <img src="${s.imageUrl}" alt="${s.name}" class="exercise-image">
            </div>
          `:`
            <button class="action-btn" data-action="searchImage">
              <span class="icon">🔍</span>
              <span>Search Exercise Image</span>
            </button>
          `}
          
          <div class="detail-section">
            <div class="label">Notes</div>
            <textarea class="notes-input" placeholder="Add personal notes..." data-action="updateNotes">${s.notes||""}</textarea>
          </div>
          
          ${t.activeWorkout?`
            <button class="action-btn primary" data-action="addToWorkout">
              <span class="icon">+</span>
              <span>Add to Current Workout</span>
            </button>
          `:""}
        </div>
      </div>
    </div>
  `,X()}function X(){var s,a,i,o;(s=document.querySelector('[data-action="back"]'))==null||s.addEventListener("click",()=>n("library")),(a=document.querySelector('[data-action="favorite"]'))==null||a.addEventListener("click",()=>w(t.selectedExercise)),(i=document.querySelector('[data-action="searchImage"]'))==null||i.addEventListener("click",()=>{const r=t.exercises[t.selectedExercise];J(r.name)}),(o=document.querySelector('[data-action="addToWorkout"]'))==null||o.addEventListener("click",()=>{q(t.selectedExercise),n("workout")});const e=document.querySelector('[data-action="updateNotes"]');e&&e.addEventListener("blur",()=>{O(t.selectedExercise,e.value)})}function Y(e){if(!t.activeWorkout){n("home");return}const s=Math.floor((Date.now()-t.activeWorkout.startTime)/1e3);e.innerHTML=`
    <div class="screen workout-screen">
      <div class="header">
        <button class="back-btn" data-action="cancel">✕ Cancel</button>
        <h2>Active Workout</h2>
        <button class="finish-btn" data-action="finish">✓</button>
      </div>
      
      <div class="workout-timer">
        ${g(s)}
      </div>
      
      <div class="scrollable-content">
        ${t.activeWorkout.exercises.length===0?`
          <div class="empty-state">
            <p>No exercises added yet</p>
            <button class="action-btn" data-action="addExercise">
              <span class="icon">+</span>
              <span>Add Exercise</span>
            </button>
          </div>
        `:`
          <div class="workout-exercises">
            ${t.activeWorkout.exercises.map((a,i)=>{const o=t.exercises[a.exerciseId];return o?`
                <div class="workout-exercise-item">
                  <div class="workout-exercise-header">
                    <h3>${o.name}</h3>
                    <button class="icon-btn" data-action="removeExercise" data-index="${i}">✕</button>
                  </div>
                  
                  <div class="sets-list">
                    ${a.sets.map((r,c)=>`
                      <div class="set-item">
                        <div class="set-header">
                          <div class="set-number">Set ${c+1}</div>
                          <button class="icon-btn small" data-action="removeSet" data-exercise="${i}" data-set="${c}">✕</button>
                        </div>
                        <div class="set-inputs">
                          <div class="set-input-row">
                            <span class="set-input-label">Reps:</span>
                            <input type="number" placeholder="0" value="${r.reps||""}" 
                                   data-action="updateSet" data-exercise="${i}" data-set="${c}" data-field="reps">
                          </div>
                          <div class="set-input-row">
                            <span class="set-input-label">Weight:</span>
                            <input type="number" placeholder="0" value="${r.weight||""}" 
                                   data-action="updateSet" data-exercise="${i}" data-set="${c}" data-field="weight">
                          </div>
                        </div>
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
  `,ee()}function ee(){var e,s,a;(e=document.querySelector('[data-action="cancel"]'))==null||e.addEventListener("click",()=>{confirm("Cancel workout? All progress will be lost.")&&A()}),(s=document.querySelector('[data-action="finish"]'))==null||s.addEventListener("click",()=>{if(t.activeWorkout.exercises.length===0){alert("Add at least one exercise before finishing");return}D()}),(a=document.querySelector('[data-action="addExercise"]'))==null||a.addEventListener("click",()=>{n("library")}),document.querySelectorAll('[data-action="addSet"]').forEach(i=>{i.addEventListener("click",()=>{F(parseInt(i.dataset.exercise))})}),document.querySelectorAll('[data-action="updateSet"]').forEach(i=>{i.addEventListener("input",o=>{const r=parseInt(o.target.dataset.exercise),c=parseInt(o.target.dataset.set),u=o.target.dataset.field,v=parseFloat(o.target.value)||0;T(r,c,u,v)})}),document.querySelectorAll('[data-action="updateExerciseNotes"]').forEach(i=>{i.addEventListener("blur",o=>{const r=parseInt(o.target.dataset.exercise);j(r,o.target.value)})}),document.querySelectorAll('[data-action="removeExercise"]').forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.index);t.activeWorkout.exercises.splice(o,1),d(),l()})}),document.querySelectorAll('[data-action="removeSet"]').forEach(i=>{i.addEventListener("click",()=>{const o=parseInt(i.dataset.exercise),r=parseInt(i.dataset.set);t.activeWorkout.exercises[o].sets.splice(r,1),d(),l()})})}function te(e){const s=Object.values(t.workouts).sort((a,i)=>i.startTime-a.startTime);e.innerHTML=`
    <div class="screen history-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Workout History</h2>
      </div>
      
      <div class="scrollable-content">
        ${s.length===0?`
          <div class="empty-state">
            <p>No workouts yet</p>
            <p class="hint">Start your first workout to see it here</p>
          </div>
        `:`
          <div class="history-list">
            ${s.map(a=>`
              <div class="history-item" data-workout="${a.id}">
                <div class="history-date">${b(a.startTime)}</div>
                <div class="history-info">
                  <div class="history-exercises">${a.exercises.length} exercises</div>
                  <div class="history-duration">${g(a.duration)}</div>
                </div>
                <div class="history-preview">
                  ${a.exercises.slice(0,3).map(i=>{const o=t.exercises[i.exerciseId];return o?o.name:"Unknown"}).join(", ")}
                  ${a.exercises.length>3?"...":""}
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `,se()}function se(){var e;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),document.querySelectorAll(".history-item").forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.workout,i=N(a);alert(i)})})}function ae(e){e.innerHTML=`
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
  `,ie()}function ie(){var e,s,a;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),(s=document.querySelector('[data-action="progressReport"]'))==null||s.addEventListener("click",()=>{var r;const i=G(),o=document.getElementById("reportDisplay");o.innerHTML=`
      <div class="report-content">
        <pre>${i}</pre>
        <button class="action-btn" data-action="export">Export to Journal</button>
      </div>
    `,(r=o.querySelector('[data-action="export"]'))==null||r.addEventListener("click",()=>{k(i)})}),(a=document.querySelector('[data-action="exportAll"]'))==null||a.addEventListener("click",()=>{const i={exercises:t.exercises,categories:t.categories,workouts:t.workouts,favorites:Array.from(t.favorites)},o=JSON.stringify(i,null,2);k(o)})}function oe(e){const s=Object.values(t.categories);e.innerHTML=`
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
              ${s.map(a=>`
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
  `,re()}function re(){var e,s,a;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("library")),(s=document.querySelector('[data-action="addCategory"]'))==null||s.addEventListener("click",()=>n("addCategory")),(a=document.getElementById("addExerciseForm"))==null||a.addEventListener("submit",i=>{i.preventDefault();const o=new FormData(i.target);H(o.get("name"),o.get("category"),o.get("type"),o.get("instructions"))})}function ne(e){e.innerHTML=`
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
  `,ce()}function ce(){var e,s;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("addExercise")),(s=document.getElementById("addCategoryForm"))==null||s.addEventListener("submit",a=>{a.preventDefault();const i=new FormData(a.target);I(i.get("name"),i.get("muscleGroup")),n("addExercise")})}function S(){t.stopwatch.isRunning=!0,t.stopwatch.startTime=Date.now()-t.stopwatch.elapsed}function E(){t.stopwatch.isRunning=!1,t.stopwatch.elapsed=Date.now()-t.stopwatch.startTime}function le(){t.stopwatch.isRunning=!1,t.stopwatch.startTime=null,t.stopwatch.elapsed=0,t.stopwatch.laps=[]}function de(){const e=t.stopwatch.isRunning?Date.now()-t.stopwatch.startTime:t.stopwatch.elapsed;t.stopwatch.laps.push(e)}function ue(e){const s=t.stopwatch.isRunning?Date.now()-t.stopwatch.startTime:t.stopwatch.elapsed,a=s%1e3,i=Math.floor(s/1e3),o=i%60,r=Math.floor(i/60)%60,u=`${Math.floor(i/3600).toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}.${Math.floor(a/10).toString().padStart(2,"0")}`;e.innerHTML=`
    <div class="screen stopwatch-screen">
      <div class="header">
        <button class="back-btn" data-action="back">‹ Back</button>
        <h2>Stopwatch</h2>
        <button class="icon-btn" data-action="reset">↻</button>
      </div>
      
      <div class="stopwatch-display">
        <div class="stopwatch-time">${u}</div>
        
        <div class="stopwatch-controls">
          ${t.stopwatch.isRunning?`
            <button class="action-btn primary" data-action="stop">
              <span class="icon">⏸</span>
              <span>Stop</span>
            </button>
            <button class="action-btn" data-action="lap">
              <span class="icon">🏁</span>
              <span>Lap</span>
            </button>
          `:`
            <button class="action-btn primary" data-action="start">
              <span class="icon">▶</span>
              <span>Start</span>
            </button>
            ${t.stopwatch.elapsed>0?`
              <button class="action-btn" data-action="reset">
                <span class="icon">↻</span>
                <span>Reset</span>
              </button>
            `:""}
          `}
        </div>
      </div>
      
      ${t.stopwatch.laps.length>0?`
        <div class="scrollable-content">
          <div class="laps-section">
            <h3>Laps</h3>
            <div class="laps-list">
              ${t.stopwatch.laps.map((v,W)=>{const $=v%1e3,f=Math.floor(v/1e3),L=f%60,P=Math.floor(f/60)%60,B=`${Math.floor(f/3600).toString().padStart(2,"0")}:${P.toString().padStart(2,"0")}:${L.toString().padStart(2,"0")}.${Math.floor($/10).toString().padStart(2,"0")}`;return`
                  <div class="lap-item">
                    <span class="lap-number">Lap ${W+1}</span>
                    <span class="lap-time">${B}</span>
                  </div>
                `}).join("")}
            </div>
          </div>
        </div>
      `:""}
    </div>
  `,pe()}function pe(){var e,s,a,i;(e=document.querySelector('[data-action="back"]'))==null||e.addEventListener("click",()=>n("home")),(s=document.querySelector('[data-action="start"]'))==null||s.addEventListener("click",()=>{S(),l()}),(a=document.querySelector('[data-action="stop"]'))==null||a.addEventListener("click",()=>{E(),l()}),document.querySelectorAll('[data-action="reset"]').forEach(o=>{o.addEventListener("click",()=>{le(),l()})}),(i=document.querySelector('[data-action="lap"]'))==null||i.addEventListener("click",()=>{de(),l()})}window.addEventListener("scrollUp",()=>{console.log("Scroll up detected")});window.addEventListener("scrollDown",()=>{console.log("Scroll down detected")});window.addEventListener("sideClick",()=>{if(console.log("Side button clicked"),t.currentScreen==="home"&&!t.activeWorkout)x();else if(t.currentScreen==="workout"){if(t.activeWorkout&&t.activeWorkout.exercises.length>0){const e=t.activeWorkout.exercises.length-1;F(e)}}else t.currentScreen==="stopwatch"&&(t.stopwatch.isRunning?E():S(),l())});document.addEventListener("DOMContentLoaded",async()=>{console.log("Workout Tracker initialized"),typeof PluginMessageHandler>"u"&&window.addEventListener("keydown",e=>{e.code==="Space"&&(e.preventDefault(),window.dispatchEvent(new CustomEvent("sideClick")))}),await R(),M(),l(),setInterval(()=>{if(t.activeWorkout&&t.currentScreen==="workout"){const e=document.querySelector(".workout-timer");if(e){const s=Math.floor((Date.now()-t.activeWorkout.startTime)/1e3);e.textContent=g(s)}}t.stopwatch.isRunning&&t.currentScreen==="stopwatch"&&l()},100),setInterval(async()=>{await d()},3e4)});
