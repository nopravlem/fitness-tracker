export type ProgramExercise={name:string;target:string;note?:string;sets:number;defaultWeight?:string};
export type DayPlan={key:string;label:string;kind:'strength'|'cardio'|'solidcore'|'recovery'|'rest';duration:string;description:string;exercises?:ProgramExercise[];mobility?:string[];cardio?:string};

export const PROGRAM_START='2026-08-28';

export const strengthA:ProgramExercise[]=[
{name:'Assisted Pull-ups',target:'Skill · 10 min',note:'Assisted reps, scapular pull-ups, hangs, controlled negatives. Track assistance.',sets:4},
{name:'Push-up Progression',target:'3 × 6–10',note:'Incline or wall. Lower the incline only after clean reps.',sets:3,defaultWeight:'BW'},
{name:'Bench Press',target:'3 × 3–5',note:'Start at 45 lb. Build reps first; later work toward 3 × 6–8 before the smallest load increase.',sets:3,defaultWeight:'45'},
{name:'Lat Pulldown',target:'3 × 8–12',note:'Recalibrate around ~70 lb; add reps before load.',sets:3},
{name:'Goblet Squat / Leg Press',target:'3 × 8–12',note:'Controlled knees; do not snap into hyperextension.',sets:3},
{name:'DB Overhead Press',target:'3 × 6–10',note:'Reference load: 17.5 lb each hand.',sets:3,defaultWeight:'17.5'},
{name:'Single-leg RDL',target:'3 × 8 / side',note:'Reference load: 15–20 lb.',sets:3},
{name:'Hip Thrust / Glute Bridge',target:'3 × 8–12',note:'Recalibrate. Historical reference ~100 lb; glute bridge is fine when setup is annoying.',sets:3},
{name:'Cable Crunch',target:'3 × 10–15',sets:3},
{name:'Dead Bug',target:'3 × 8 / side',sets:3,defaultWeight:'BW'}
];

export const strengthB:ProgramExercise[]=[
{name:'Assisted Pull-ups',target:'3 × 5–8',note:'Reduce assistance after all sets are clean at the top of the range.',sets:3},
{name:'Push-up Progression',target:'3 × 6–10',sets:3,defaultWeight:'BW'},
{name:'Bench Press',target:'3 × 3–5',note:'45 lb starting reference; progress reps before load.',sets:3,defaultWeight:'45'},
{name:'Hip Thrust',target:'3 × 8–12',sets:3},
{name:'Lat Pulldown',target:'3 × 8–12',sets:3},
{name:'DB Overhead Press',target:'3 × 6–10',sets:3,defaultWeight:'17.5'},
{name:'21s',target:'2 × 5-5-5',note:'20 lb bar. Progress 5-5-5 → 6-6-6 → 7-7-7, then add load.',sets:2,defaultWeight:'20'},
{name:'Leg Press',target:'3 × 8–12',sets:3},
{name:"Captain's Chair Knee Raise",target:'3 × 8–12',sets:3,defaultWeight:'BW'},
{name:'Pallof Press',target:'3 × 10 / side',sets:3}
];

export const strengthC:ProgramExercise[]=[
{name:'Hip Thrust',target:'3 × 8–12',sets:3},
{name:'RDL',target:'3 × 8–10',note:'Comfortable load; dumbbells are fine.',sets:3},
{name:'Lat Pulldown',target:'3 × 8–12',sets:3},
{name:'Bench Press',target:'3 × 3–5',note:'Later progress toward 3 × 5–8 if recovery is good.',sets:3,defaultWeight:'45'},
{name:'Biceps Curl / 21s',target:'2 sets',sets:2},
{name:'Triceps',target:'2 × 10–12',sets:2},
{name:'Plank / Side Plank',target:'2–3 sets',sets:3,defaultWeight:'BW'}
];

export const weeklyPlans:Record<number,DayPlan>={
1:{key:'A',label:'Strength A',kind:'strength',duration:'55–70 min',description:'Pull-up + push-up skills, strength, and core.',exercises:strengthA,mobility:['Hip 90/90','Ankle knee-to-wall','Chin tucks']},
2:{key:'cardio',label:'Easy cardio + mobility',kind:'cardio',duration:'30–45 min',description:'Conversational aerobic work. No sprinting.',cardio:'30–40 min bike, elliptical, or incline walk',mobility:['90/90','Hip flexor','Adductor rock-backs','Ankle/calf','Neck + thoracic']},
3:{key:'solidcore',label:'Solidcore',kind:'solidcore',duration:'Class',description:'Solidcore day. Optional short mobility afterward.',mobility:['Optional 10 min hips/neck/split']},
4:{key:'B',label:'Strength B',kind:'strength',duration:'55–70 min',description:'Skills + upper/lower strength + abs.',exercises:strengthB,mobility:['Hip control','Ankle/calf','Neck + thoracic']},
5:{key:'recovery',label:'Recovery',kind:'recovery',duration:'Flexible',description:'Normal NYC walking + mobility. No make-up workout.',mobility:['10–15 min hips','Ankle/calf','Neck/upper back','Split practice']},
6:{key:'C',label:'Strength C + run',kind:'strength',duration:'60–80 min',description:'Strength followed by knee-aware run/cardio and split work.',exercises:strengthC,cardio:'Run/walk progression below symptom threshold',mobility:['Split practice','Hip flexor','Hamstring','Adductors']},
0:{key:'rest',label:'Rest',kind:'rest',duration:'Rest',description:'Full rest. Walking is fine.'}
};

export const dateOverrides:Record<string,DayPlan>={
'2026-08-28':{key:'launch',label:'Target walk + apartment reset',kind:'recovery',duration:'No gym',description:'Pick up goggles, work, dishes/cleaning, call super. No running. Normal walking counts.'},
'2026-08-29':{key:'A',label:'Strength A',kind:'strength',duration:'55–70 min',description:'First formal strength day back. Conservative loads; skill work first.',exercises:strengthA,mobility:['Hip 90/90','Ankle knee-to-wall','Chin tucks']},
'2026-08-30':{key:'recovery',label:'Recovery + mobility',kind:'recovery',duration:'10–15 min optional',description:'Normal walking plus optional hip/ankle/neck and split work.',mobility:['90/90','Ankle/calf','Neck/upper back','Split practice']},
'2026-08-31':{key:'cardio',label:'Easy cardio + mobility',kind:'cardio',duration:'20–30 min optional',description:'Low impact and easy. Normal NYC walking can count. No sprints.',cardio:'20–30 min easy bike, elliptical, or incline walk',mobility:['Hips','Ankle/calf','Neck/upper back']}
};

export const runStages=[
'2 min easy run / 2 min walk × 5',
'3 min run / 2 min walk × 5',
'5 min run / 2 min walk × 4',
'8 min run / 2 min walk',
'10 min run / 1 min walk',
'Continuous easy mile',
'Build easy distance before speed work'
];

export const trainingBlocks=[
{start:'2026-08-28',end:'2026-08-31',name:'Re-entry',focus:'Ease back in; conservative loads and normal walking.'},
{start:'2026-09-01',end:'2026-09-30',name:'September Re-entry',focus:'Rebuild consistency and movement quality.'},
{start:'2026-10-01',end:'2026-10-24',name:'October Build',focus:'Progress strength, skills, aerobic base, and mobility.'},
{start:'2026-10-25',end:'2026-11-07',name:'India / Recovery',focus:'Flexible movement, walking, mobility; no forced normal schedule.'},
{start:'2026-11-08',end:'2026-11-22',name:'November Rebuild',focus:'Resume strength and cardio gradually.'},
{start:'2026-11-23',end:'2026-11-29',name:'Thanksgiving Deload',focus:'Recovery, walking, mobility.'},
{start:'2026-11-30',end:'2026-12-19',name:'December Build',focus:'Focused build before holidays.'},
{start:'2026-12-20',end:'2027-01-02',name:'Holiday Recovery',focus:'Flexible movement; preserve momentum.'},
{start:'2027-01-03',end:'2027-01-31',name:'January Rebuild',focus:'Return to full weekly rhythm.'},
{start:'2027-02-01',end:'2027-02-28',name:'February Assess',focus:'Assess push-ups, pull-up assistance, run, strength, and mobility.'}
];

export function localDateKey(d=new Date()){const y=d.getFullYear();const m=String(d.getMonth()+1).padStart(2,'0');const day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
export function planForDate(d=new Date()){const key=localDateKey(d);const block=blockForDate(key);if(dateOverrides[key])return dateOverrides[key];if(block&&(block.name.includes('Recovery')||block.name.includes('Deload')||block.name.includes('India')))return {key:'recovery-block',label:block.name,kind:'recovery',duration:'Flexible',description:block.focus,mobility:['Walking','10–15 min mobility','Optional short bodyweight session']};return weeklyPlans[d.getDay()]}
export function blockForDate(key=localDateKey()){return trainingBlocks.find(b=>key>=b.start&&key<=b.end)??null}
