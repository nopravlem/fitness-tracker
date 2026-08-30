export type ExerciseReference={id:string;name:string;category:'Mobility'|'Strength';summary:string;howTo:string[];cues?:string[]};

export const exerciseReferences:ExerciseReference[]=[
{id:'hip-90-90',name:'Hip 90/90',category:'Mobility',summary:'Hip rotation drill for internal and external rotation.',howTo:['Sit with both knees bent to about 90° and let both legs fall to one side.','Keep your torso tall and gently lean toward the front shin without forcing range.','Switch sides slowly and repeat.'],cues:['Move from the hips, not by twisting the knee.','Use your hands for support if needed.']},
{id:'ankle-knee-to-wall',name:'Ankle knee-to-wall',category:'Mobility',summary:'Ankle dorsiflexion drill that can help squats, stairs, and running mechanics.',howTo:['Face a wall with one foot flat on the floor.','Drive the knee toward the wall while keeping the heel down.','Move the foot farther away only while the heel can stay planted.'],cues:['Let the knee track over the toes.','Do not force through sharp ankle pain.']},
{id:'chin-tucks',name:'Chin tucks',category:'Mobility',summary:'Gentle neck-position drill for long desk days.',howTo:['Sit or stand tall and look straight ahead.','Glide the chin straight backward as if making a small double chin.','Hold briefly, relax, and repeat without looking down.'],cues:['Keep the movement small.','Do not jam or aggressively stretch the neck.']},
{id:'hip-flexor',name:'Hip flexor',category:'Mobility',summary:'Half-kneeling hip-flexor stretch with the pelvis controlled.',howTo:['Start in a half-kneeling position.','Gently tuck the pelvis and squeeze the glute on the kneeling side.','Shift forward only until you feel a stretch at the front of that hip.'],cues:['Avoid arching the low back.']},
{id:'adductor-rock-backs',name:'Adductor rock-backs',category:'Mobility',summary:'Inner-thigh and hip mobility drill.',howTo:['Start on hands and knees, then extend one leg out to the side with the foot planted.','Keep your spine neutral and slowly rock your hips backward.','Return forward and repeat smoothly.'],cues:['The stretch should be in the inner thigh, not the knee.']},
{id:'ankle-calf',name:'Ankle/calf',category:'Mobility',summary:'A simple ankle and calf mobility block.',howTo:['Use knee-to-wall reps for ankle motion.','Add a straight-knee calf stretch for the gastrocnemius.','Add a slightly bent-knee version for the soleus.'],cues:['Keep the heel down during ankle work.']},
{id:'neck-upper-back',name:'Neck/upper back',category:'Mobility',summary:'Short desk-reset sequence for the neck, shoulders, and thoracic spine.',howTo:['Do gentle chin tucks.','Add open-book or seated thoracic rotations.','Finish with relaxed shoulder-blade retractions.'],cues:['Avoid aggressive neck circles or cracking.']},
{id:'split-practice',name:'Split practice',category:'Mobility',summary:'Gradual flexibility work toward a split without forcing end range.',howTo:['Warm up first with easy movement.','Use hip-flexor, hamstring, and adductor positions.','Ease into your split position, support yourself with your hands, and stop before pain.'],cues:['Consistency matters more than forcing depth.','Measure progress by distance from the floor, not by pushing through pain.']},
{id:'assisted-pull-ups',name:'Assisted Pull-ups',category:'Strength',summary:'Pull-up practice using assistance so clean reps stay the priority.',howTo:['Set enough assistance to control the full range.','Start from a stable shoulder position and pull your chest toward the bar.','Lower under control.'],cues:['Reduce assistance only after clean reps at the top of the target range.']},
{id:'single-leg-rdl',name:'Single-leg RDL',category:'Strength',summary:'Unilateral hip-hinge for hamstrings, glutes, and balance.',howTo:['Stand on one leg with a soft knee.','Push the hips backward as the other leg reaches behind you.','Keep the hips mostly square and return by driving through the standing leg.'],cues:['Think long spine and hips back.','Use a light support for balance if needed.']},
{id:'cable-crunch',name:'Cable Crunch',category:'Strength',summary:'Weighted trunk-flexion exercise using a cable.',howTo:['Kneel facing the cable with the rope near your temples or shoulders.','Keep the hips relatively still and curl the ribcage toward the pelvis.','Return under control instead of letting the stack pull you up.'],cues:['Move through the trunk rather than turning it into a hip hinge.']}
];

const aliases:Record<string,string>={
  '90/90':'hip-90-90','Hips':'hip-90-90','Hip control':'hip-90-90',
  'Ankle knee-to-wall':'ankle-knee-to-wall','Ankle/calf':'ankle-calf',
  'Chin tucks':'chin-tucks','Neck + thoracic':'neck-upper-back','Neck/upper back':'neck-upper-back',
  'Hip flexor':'hip-flexor','Adductor rock-backs':'adductor-rock-backs','Adductors':'adductor-rock-backs',
  'Split practice':'split-practice','Optional split practice':'split-practice','Hamstring':'split-practice'
};

const sectionAliases:Record<string,'mobility'|'strength'>={
  'Walking':'mobility','10–15 min mobility':'mobility','Optional short mobility only if it feels good':'mobility','Optional short bodyweight session':'strength'
};

export function exerciseReferenceHref(label:string){const section=sectionAliases[label];if(section)return `/exercises#${section}`;const id=aliases[label]||exerciseReferences.find(x=>x.name===label)?.id;return id?`/exercises#${id}`:'/exercises'}
