import { Exercise, WorkoutPlan } from '../types/workout.types';

export const EXERCISES: Exercise[] = [
  // ─── STRENGTH EXERCISES (Gym-focused) ───
  {
    id: 'bench_001',
    name: 'Bench Press',
    category: 'strength',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    difficulty: 'intermediate',
    sets: 4,
    reps: 10,
    restSeconds: 90,
    instructions: [
      'Lie flat on the bench, feet flat on the floor',
      'Grip the barbell slightly wider than shoulder-width',
      'Lower the barbell slowly to your mid-chest',
      'Press the bar straight up, extending arms fully'
    ],
    tips: [
      'Keep your shoulder blades retracted and down',
      'Avoid bouncing the barbell off your chest',
      'Keep elbows at a 45-degree angle to protect shoulders'
    ],
    aiReady: false,
    thumbnailEmoji: '🏋️',
    equipment: 'Barbell',
    homeGymType: 'gym',
    caloriesEstimate: 120,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-with-barbell-on-bench-press-42289-large.mp4'
  },
  {
    id: 'deadlift_001',
    name: 'Deadlift',
    category: 'strength',
    muscleGroups: ['back', 'glutes', 'hamstrings', 'core'],
    difficulty: 'advanced',
    sets: 4,
    reps: 6,
    restSeconds: 120,
    instructions: [
      'Stand with feet hip-width apart, shins close to the barbell',
      'Hinge at hips, bend knees slightly, and grip the bar',
      'Flatten your back, pull shoulders down, and brace core',
      'Drive through your heels to stand up, pulling the bar up',
      'Squeeze glutes at the top, then hinge back down with control'
    ],
    tips: [
      'Keep the bar close to your body at all times',
      'Do not round your lower back — maintain a neutral spine',
      'Look forward and slightly down to avoid neck strain'
    ],
    aiReady: true,
    thumbnailEmoji: '⚡',
    equipment: 'Barbell',
    homeGymType: 'gym',
    caloriesEstimate: 150,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-powerlifter-performing-a-heavy-deadlift-48560-large.mp4'
  },
  {
    id: 'squat_001',
    name: 'Barbell Squat',
    category: 'strength',
    muscleGroups: ['quads', 'glutes', 'core'],
    difficulty: 'intermediate',
    sets: 4,
    reps: 12,
    restSeconds: 90,
    instructions: [
      'Place barbell on upper back (traps), stand feet shoulder-width apart',
      'Inhale, brace your core, and push your hips back and down',
      'Lower until thighs are parallel to the floor or deeper',
      'Drive through your heels to return to the starting position'
    ],
    tips: [
      'Keep your chest up and back straight',
      'Knees should track in line with toes, not cave inward',
      'Aim for a knee bend of 90 degrees or lower'
    ],
    aiReady: true,
    thumbnailEmoji: '🏋️',
    equipment: 'Barbell',
    homeGymType: 'gym',
    caloriesEstimate: 130,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-barbell-squats-in-slow-motion-48562-large.mp4'
  },
  {
    id: 'pullup_001',
    name: 'Pull Up',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    difficulty: 'advanced',
    sets: 3,
    reps: 8,
    restSeconds: 90,
    instructions: [
      'Hang from a pull-up bar with an overhand grip, hands wider than shoulders',
      'Engage your core, pull your shoulder blades down and back',
      'Pull your chest up toward the bar, leading with your elbows',
      'Lower yourself slowly back to a dead hang position'
    ],
    tips: [
      'Minimize swinging or using momentum (no kipping)',
      'Aim to bring your chin fully over the bar',
      'Focus on pulling through your back muscles, not just arms'
    ],
    aiReady: true,
    thumbnailEmoji: '🔝',
    equipment: 'Pull-up Bar',
    homeGymType: 'gym',
    caloriesEstimate: 90,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-pull-ups-in-the-gym-48559-large.mp4'
  },
  {
    id: 'shoulder_press_001',
    name: 'Shoulder Press',
    category: 'strength',
    muscleGroups: ['shoulders', 'triceps'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restSeconds: 90,
    instructions: [
      'Hold a barbell at shoulder height, hands shoulder-width apart',
      'Brace core and press the bar straight overhead until arms lock',
      'Avoid arching your lower back as you lift',
      'Lower the bar slowly back to the starting chest position'
    ],
    tips: [
      'Squeeze your glutes and abs to stabilize your body',
      'Move your head back slightly as the bar passes your face',
      'Keep your forearms vertical throughout the lift'
    ],
    aiReady: false,
    thumbnailEmoji: '🏋️',
    equipment: 'Barbell',
    homeGymType: 'gym',
    caloriesEstimate: 100
  },
  {
    id: 'bicep_curl_001',
    name: 'Bicep Curl',
    category: 'strength',
    muscleGroups: ['biceps'],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    restSeconds: 60,
    instructions: [
      'Stand holding dumbbells at your sides, palms facing forward',
      'Keep elbows close to your torso, curl weights up toward shoulders',
      'Squeeze biceps at the top of the contraction',
      'Lower dumbbells slowly back to the starting position'
    ],
    tips: [
      'Keep your upper arms stationary; only move your forearms',
      'Do not swing your body or use hips to raise the weight',
      'Keep your wrists straight throughout the curl'
    ],
    aiReady: false,
    thumbnailEmoji: '💪',
    equipment: 'Dumbbells',
    homeGymType: 'gym',
    caloriesEstimate: 60
  },
  {
    id: 'tricep_dip_001',
    name: 'Tricep Dip',
    category: 'strength',
    muscleGroups: ['triceps', 'chest'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restSeconds: 90,
    instructions: [
      'Grip the parallel dip bars and lift your body up',
      'Bend your arms to lower your body, leaning slightly forward',
      'Lower until your shoulders are below your elbows',
      'Push through your hands to return to the starting position'
    ],
    tips: [
      'Keep your shoulders down and away from your ears',
      'Do not let your elbows flare out too wide',
      'If too difficult, use an assisted dip machine'
    ],
    aiReady: false,
    thumbnailEmoji: '💪',
    equipment: 'Parallel Bars',
    homeGymType: 'gym',
    caloriesEstimate: 80
  },
  {
    id: 'row_001',
    name: 'Barbell Row',
    category: 'strength',
    muscleGroups: ['back', 'biceps'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restSeconds: 90,
    instructions: [
      'Hinge forward at hips, keeping back flat and knees slightly bent',
      'Hold barbell with a shoulder-width overhand grip, arms hanging',
      'Pull the bar up toward your lower chest, squeezing back muscles',
      'Lower the bar slowly back to the starting position'
    ],
    tips: [
      'Focus on pulling with your elbows rather than hands',
      'Keep your torso stable — do not bounce or stand up',
      'Keep your neck neutral, aligned with your spine'
    ],
    aiReady: false,
    thumbnailEmoji: '🏋️',
    equipment: 'Barbell',
    homeGymType: 'gym',
    caloriesEstimate: 110
  },
  {
    id: 'lunges_001',
    name: 'Lunges',
    category: 'strength',
    muscleGroups: ['quads', 'glutes'],
    difficulty: 'beginner',
    sets: 3,
    reps: 12,
    restSeconds: 60,
    instructions: [
      'Stand with feet hip-width apart, holding dumbbells (optional)',
      'Step forward with one leg and lower hips until knees are at 90°',
      'Push back up through your front heel to return to stand',
      'Repeat on the opposite leg'
    ],
    tips: [
      'Keep your torso upright and shoulders pulled back',
      'Your front knee should not push forward past your toes',
      'Distribute weight evenly between both legs'
    ],
    aiReady: true,
    thumbnailEmoji: '🦵',
    equipment: 'Dumbbells',
    homeGymType: 'gym',
    caloriesEstimate: 80
  },
  {
    id: 'leg_press_001',
    name: 'Leg Press',
    category: 'strength',
    muscleGroups: ['quads', 'glutes'],
    difficulty: 'intermediate',
    sets: 3,
    reps: 10,
    restSeconds: 90,
    instructions: [
      'Sit in the leg press machine, feet shoulder-width on the platform',
      'Release safety locks and slowly lower platform by bending knees',
      'Lower until knees reach a 90-degree angle',
      'Push platform away by extending knees, without locking them out'
    ],
    tips: [
      'Keep your lower back pressed firmly against the seat back',
      'Do not let your knees cave inward — keep them aligned with feet',
      'Push through your heels, not your toes'
    ],
    aiReady: false,
    thumbnailEmoji: '🏋️',
    equipment: 'Sled Machine',
    homeGymType: 'gym',
    caloriesEstimate: 100
  },

  // ─── CARDIO EXERCISES ───
  {
    id: 'running_001',
    name: 'Running',
    category: 'cardio',
    muscleGroups: ['full_body', 'calves'],
    difficulty: 'intermediate',
    durationSeconds: 600,
    restSeconds: 0,
    instructions: [
      'Run at a steady, moderate pace on the treadmill or outdoors',
      'Maintain upright posture, gaze forward, relaxed shoulders',
      'Land on your mid-foot and roll forward to push off'
    ],
    tips: [
      'Swing arms forward and back, not across your body',
      'Keep a steady breathing rhythm (e.g., inhale 3 steps, exhale 3)',
      'Wear supportive, comfortable running shoes'
    ],
    aiReady: false,
    thumbnailEmoji: '🏃',
    equipment: 'Treadmill',
    homeGymType: 'gym',
    caloriesEstimate: 250,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-on-treadmill-in-gym-48566-large.mp4'
  },
  {
    id: 'jump_rope_001',
    name: 'Jump Rope',
    category: 'cardio',
    muscleGroups: ['full_body', 'calves'],
    difficulty: 'beginner',
    durationSeconds: 300,
    restSeconds: 30,
    instructions: [
      'Hold handles with elbows tucked, rotate rope using wrists',
      'Jump just high enough for the rope to pass under feet',
      'Land softly on the balls of your feet'
    ],
    tips: [
      'Keep your knees slightly bent to absorb impact',
      'Use small, quick jumps rather than big high jumps',
      'Rhythm is key — keep wrists relaxed and circular'
    ],
    aiReady: false,
    thumbnailEmoji: '🔥',
    equipment: 'Jump Rope',
    homeGymType: 'home',
    caloriesEstimate: 120
  },
  {
    id: 'cycling_001',
    name: 'Cycling',
    category: 'cardio',
    muscleGroups: ['quads', 'calves'],
    difficulty: 'beginner',
    durationSeconds: 600,
    restSeconds: 0,
    instructions: [
      'Sit comfortably on a stationary bike, feet in pedal straps',
      'Pedal at a constant speed, keeping resistance moderate',
      'Keep back flat and hold handlebars lightly'
    ],
    tips: [
      'Adjust seat height so knee has a slight bend at bottom pedal',
      'Push down and pull up in a smooth, circular pedaling motion',
      'Brace core to stabilize your upper body'
    ],
    aiReady: false,
    thumbnailEmoji: '🚴',
    equipment: 'Stationary Bike',
    homeGymType: 'gym',
    caloriesEstimate: 180
  },
  {
    id: 'burpees_001',
    name: 'Burpees',
    category: 'cardio',
    muscleGroups: ['full_body'],
    difficulty: 'advanced',
    sets: 3,
    reps: 15,
    restSeconds: 60,
    instructions: [
      'Stand feet hip-width, drop into a squat, place hands on floor',
      'Jump feet back into a plank position, perform a quick push-up',
      'Jump feet forward back into the squat stance',
      'Explode upward, jumping high and reaching arms overhead'
    ],
    tips: [
      'Land softly on your feet during the jump to protect joints',
      'Maintain a solid core plank; do not let your back sag',
      'Pace yourself — it is better to stay constant than burn out'
    ],
    aiReady: false,
    thumbnailEmoji: '🔥',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 140
  },
  {
    id: 'mountain_climbers_001',
    name: 'Mountain Climbers',
    category: 'cardio',
    muscleGroups: ['core', 'shoulders'],
    difficulty: 'intermediate',
    durationSeconds: 120,
    restSeconds: 30,
    instructions: [
      'Start in a push-up plank position with hands under shoulders',
      'Pull your right knee in toward chest as far as possible',
      'Switch legs quickly, extending right and pulling left knee in',
      'Keep hips low and drive legs in a rapid running motion'
    ],
    tips: [
      'Keep weight shifted forward over your hands',
      'Abdominal muscles should be braced and active throughout',
      'Do not let your hips bounce up into the air'
    ],
    aiReady: false,
    thumbnailEmoji: '🏃',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 90
  },
  {
    id: 'high_knees_001',
    name: 'High Knees',
    category: 'cardio',
    muscleGroups: ['quads', 'core'],
    difficulty: 'beginner',
    durationSeconds: 120,
    restSeconds: 30,
    instructions: [
      'Run in place, lifting knees as high toward chest as possible',
      'Pump arms in sync with your legs',
      'Stay on the balls of your feet and keep a fast tempo'
    ],
    tips: [
      'Keep your chest upright — do not lean backward',
      'Aim to get thighs parallel to the ground',
      'Engage your lower abs to lift your knees'
    ],
    aiReady: false,
    thumbnailEmoji: '🏃',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 80
  },
  {
    id: 'treadmill_walk_001',
    name: 'Treadmill Walk',
    category: 'cardio',
    muscleGroups: ['calves', 'glutes'],
    difficulty: 'beginner',
    durationSeconds: 600,
    restSeconds: 0,
    instructions: [
      'Walk at a brisk pace on the treadmill',
      'Add a slight incline (2-5%) to increase lower body activation',
      'Let your arms swing naturally at your sides'
    ],
    tips: [
      'Avoid holding onto the handrails unless for balance',
      'Take long, smooth strides',
      'Keep your shoulders relaxed and back straight'
    ],
    aiReady: false,
    thumbnailEmoji: '🚶',
    equipment: 'Treadmill',
    homeGymType: 'gym',
    caloriesEstimate: 100
  },
  {
    id: 'rowing_machine_001',
    name: 'Rowing',
    category: 'cardio',
    muscleGroups: ['back', 'biceps', 'quads'],
    difficulty: 'intermediate',
    durationSeconds: 300,
    restSeconds: 0,
    instructions: [
      'Secure feet in straps, slide forward, and grip handle',
      'Drive legs backward strongly, extending knees',
      'Hinge torso back slightly, pull handle to lower ribs',
      'Extend arms, hinge torso forward, and slide back to start'
    ],
    tips: [
      'Rowing is 60% legs, 20% core, 20% arms',
      'Do not rush the return slide forward — make it controlled',
      'Keep your spine tall and avoid rounding the shoulders'
    ],
    aiReady: false,
    thumbnailEmoji: '🚣',
    equipment: 'Rowing Machine',
    homeGymType: 'gym',
    caloriesEstimate: 150
  },

  // ─── HOME / BODYWEIGHT EXERCISES ───
  {
    id: 'pushup_001',
    name: 'Push Up',
    category: 'strength', // also in strength, but categorized here too
    muscleGroups: ['chest', 'triceps', 'shoulders', 'core'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    restSeconds: 60,
    instructions: [
      'Start in a plank position with hands shoulder-width apart',
      'Lower your chest until it nearly touches the floor',
      'Keep your body in a straight line from head to heels',
      'Push back up to the starting position'
    ],
    tips: [
      'Elbows should track back at 45 degrees, not flare out wide',
      'Squeeze your glutes and abs to prevent lower back sagging',
      'If too difficult, drop to knees for assisted pushups'
    ],
    aiReady: true,
    thumbnailEmoji: '💪',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 80,
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-pushups-in-the-gym-48554-large.mp4'
  },
  {
    id: 'bodyweight_squat_001',
    name: 'Bodyweight Squat',
    category: 'strength',
    muscleGroups: ['quads', 'glutes', 'core'],
    difficulty: 'beginner',
    sets: 3,
    reps: 20,
    restSeconds: 60,
    instructions: [
      'Stand with feet shoulder-width apart, arms extended forward',
      'Hinge at hips and bend knees, lowering thighs to parallel',
      'Keep knees behind toes and weight in your heels',
      'Push through feet to return to a standing position'
    ],
    tips: [
      'Keep chest tall and gaze forward',
      'Ensure knees track over your middle toes',
      'Engage glutes at the top of the movement'
    ],
    aiReady: true,
    thumbnailEmoji: '🏋️',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 70
  },
  {
    id: 'plank_001',
    name: 'Plank',
    category: 'strength',
    muscleGroups: ['core', 'shoulders'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 45,
    instructions: [
      'Place forearms on the floor, elbows aligned under shoulders',
      'Extend legs straight behind you, resting weight on toes',
      'Keep your neck neutral and body in a straight line',
      'Hold this position while bracing your abs and glutes'
    ],
    tips: [
      'Do not let your hips sag toward floor or pike up to ceiling',
      'Keep breathing steadily — do not hold your breath',
      'Actively press the floor away with your forearms'
    ],
    aiReady: true,
    thumbnailEmoji: '🤸',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 60
  },
  {
    id: 'walking_lunges_001',
    name: 'Walking Lunges',
    category: 'strength',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'beginner',
    sets: 3,
    reps: 16,
    restSeconds: 60,
    instructions: [
      'Stand tall, then take a wide step forward with right leg',
      'Lower hips until both knees bend at a 90-degree angle',
      'Drive through right heel to stand and step left leg forward',
      'Repeat the movement as you walk forward'
    ],
    tips: [
      'Do not let front knee collapse inward; keep it stable',
      'Keep your hands on your hips or side to maintain balance',
      'Take consistent, moderate-sized steps forward'
    ],
    aiReady: true,
    thumbnailEmoji: '🦵',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 80
  },
  {
    id: 'jumping_jacks_001',
    name: 'Jumping Jacks',
    category: 'cardio',
    muscleGroups: ['full_body'],
    difficulty: 'beginner',
    durationSeconds: 180,
    restSeconds: 30,
    instructions: [
      'Stand feet together, arms at sides',
      'Jump feet out to the sides while raising arms overhead',
      'Jump feet back together and return arms to sides',
      'Repeat in a quick, rhythmic tempo'
    ],
    tips: [
      'Land softly on the balls of your feet to protect knees',
      'Keep arms straight as you swing them overhead',
      'Maintain a brisk, steady cadence'
    ],
    aiReady: false,
    thumbnailEmoji: '🔥',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 70
  },
  {
    id: 'glute_bridge_001',
    name: 'Glute Bridge',
    category: 'strength',
    muscleGroups: ['glutes', 'core', 'hamstrings'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    restSeconds: 60,
    instructions: [
      'Lie on your back, knees bent, feet flat on the floor close to hips',
      'Squeeze glutes and press heels to lift hips toward ceiling',
      'Form a straight line from knees to shoulders',
      'Lower hips slowly back to the ground'
    ],
    tips: [
      'Do not arch your lower back too much at the top',
      'Push through your heels, not the balls of your feet',
      'Pause and squeeze glutes at the top for 1-2 seconds'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 50
  },
  {
    id: 'situp_001',
    name: 'Sit Up',
    category: 'strength',
    muscleGroups: ['core'],
    difficulty: 'beginner',
    sets: 3,
    reps: 15,
    restSeconds: 45,
    instructions: [
      'Lie flat, knees bent, feet flat on floor, hands behind head',
      'Engage abdominal muscles, curl your upper body up to knees',
      'Keep neck relaxed and lead with your chest',
      'Lower your back down slowly to the start position'
    ],
    tips: [
      'Do not pull or tug on your neck with your hands',
      'Exhale as you sit up; inhale on the way down',
      'Keep your feet anchored flat on the floor'
    ],
    aiReady: false,
    thumbnailEmoji: '🤸',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 50
  },
  {
    id: 'wall_sit_001',
    name: 'Wall Sit',
    category: 'strength',
    muscleGroups: ['quads', 'glutes'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 45,
    instructions: [
      'Lean back flat against a wall, feet shoulder-width',
      'Slide down until thighs are parallel to ground (90° knee angle)',
      'Keep hands on thighs or cross them over chest',
      'Hold this position, pushing back into the wall'
    ],
    tips: [
      'Ensure your knees are directly above your ankles, not in front',
      'Keep your head and back flat against the wall',
      'Focus on steady, deep breathing'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Bodyweight',
    homeGymType: 'home',
    caloriesEstimate: 60
  }
];

export const YOGA_EXERCISES: Exercise[] = [
  {
    id: 'yoga_001',
    name: 'Downward Dog',
    category: 'yoga',
    muscleGroups: ['shoulders', 'calves', 'hamstrings'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Start on hands and knees, hands shoulder-width, knees hip-width',
      'Tuck toes, lift hips up, and push body back into an inverted V-shape',
      'Press heels toward floor, straighten legs, and relax head',
      'Spread fingers wide and press palms flat into mat'
    ],
    tips: [
      'Keep your spine long; bend knees slightly if hamstrings are tight',
      'Push your chest toward your thighs to lengthen the back',
      'Rotate shoulders outward to broaden across upper back'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 30
  },
  {
    id: 'yoga_002',
    name: 'Warrior I',
    category: 'yoga',
    muscleGroups: ['quads', 'shoulders', 'core'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'From standing, step left foot back 3-4 feet, turning heel in 45°',
      'Bend front right knee to 90°, directly above your ankle',
      'Raise arms straight overhead, palms facing, shoulders down',
      'Square your hips to the front, lift chest, and hold'
    ],
    tips: [
      'Keep outer edge of your back foot pressed firmly into mat',
      'Engage your core to protect the lower back',
      'Keep gaze lifted up toward hands'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 40
  },
  {
    id: 'yoga_003',
    name: 'Child Pose',
    category: 'yoga',
    muscleGroups: ['back', 'shoulders'],
    difficulty: 'beginner',
    durationSeconds: 90,
    restSeconds: 0,
    instructions: [
      'Kneel on the floor, touch big toes together, sit on heels',
      'Separate knees about hip-width apart',
      'Lay torso down between thighs, extending arms forward',
      'Rest your forehead gently down on the mat'
    ],
    tips: [
      'Allow shoulders to relax completely away from spine',
      'Take slow, deep breaths, expanding the back ribs',
      'If hips do not touch heels, place a cushion between them'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 20
  },
  {
    id: 'yoga_004',
    name: 'Cobra Pose',
    category: 'yoga',
    muscleGroups: ['back', 'shoulders'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Lie prone on the mat, tops of feet flat, hands under shoulders',
      'Press thighs and pelvic bone down into floor',
      'Inhale, straighten arms slowly to lift chest forward and up',
      'Keep shoulders down and elbows tucked close to body'
    ],
    tips: [
      'Do not push higher if lower back begins to pinch',
      'Draw shoulder blades down and back, opening chest',
      'Keep your neck long — look forward, not up'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 30
  },
  {
    id: 'yoga_005',
    name: 'Tree Pose',
    category: 'yoga',
    muscleGroups: ['core', 'calves'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 10,
    instructions: [
      'Stand tall on right leg, lifting left foot off floor',
      'Place sole of left foot on inner right calf or thigh',
      'Avoid placing the foot directly on the side of the knee joint',
      'Bring hands to prayer at chest or raise arms overhead',
      'Balance while focusing on a stable spot ahead'
    ],
    tips: [
      'Press foot into leg, and leg into foot to create stability',
      'Keep hips squared and tailbone tucked down',
      'If wobbly, stand close to a wall for support'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 25
  },
  {
    id: 'yoga_006',
    name: 'Cat Cow',
    category: 'yoga',
    muscleGroups: ['back', 'core'],
    difficulty: 'beginner',
    durationSeconds: 120,
    restSeconds: 10,
    instructions: [
      'Start on hands and knees, hands under shoulders, knees under hips',
      'Inhale: drop belly, arch back, lift chest and gaze up (Cow)',
      'Exhale: tuck chin, round spine, pull navel in to spine (Cat)',
      'Flow smoothly between these positions with your breathing'
    ],
    tips: [
      'Let the movement begin at your tailbone and flow up',
      'Keep fingers spread wide to protect your wrists',
      'Press firmly away from mat in Cat to open shoulder blade space'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 30
  },
  {
    id: 'yoga_007',
    name: 'Bridge Pose',
    category: 'yoga',
    muscleGroups: ['glutes', 'core'],
    difficulty: 'beginner',
    durationSeconds: 60,
    restSeconds: 15,
    instructions: [
      'Lie flat, knees bent, feet flat hip-width, arms at sides',
      'Press feet into floor, lift hips, chest rolls toward chin',
      'Clasp hands under back, roll shoulders underneath to open',
      'Hold position while pressing thighs parallel'
    ],
    tips: [
      'Keep knees pointing forward, not flaring out',
      'Lift chest, but keep chin tucked slightly to protect neck',
      'Engage glutes and hamstrings to hold lift height'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 35
  },
  {
    id: 'yoga_008',
    name: 'Sun Salutation',
    category: 'yoga',
    muscleGroups: ['full_body'],
    difficulty: 'intermediate',
    durationSeconds: 180,
    restSeconds: 20,
    instructions: [
      'Stand at front of mat, inhale arms overhead, exhale fold forward',
      'Inhale to flat back, step back to plank, lower (Chaturanga)',
      'Inhale up to Cobra/Upward Dog, exhale back to Downward Dog',
      'Step forward to flat back, fold, inhale rise to stand'
    ],
    tips: [
      'Sync each movement strictly with an inhale or exhale',
      'Focus on full range of motion in the folds and lunges',
      'Transition smoothly — do not rush between postures'
    ],
    aiReady: false,
    thumbnailEmoji: '🧘',
    equipment: 'Yoga Mat',
    homeGymType: 'home',
    caloriesEstimate: 50
  }
];

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan_ppl',
    name: 'Push Pull Legs Split',
    description: 'Advanced muscle-building routine focusing on compound compound movements.',
    category: 'strength',
    difficulty: 'intermediate',
    durationMinutes: 45,
    exercises: [
      EXERCISES[0], // Bench Press
      EXERCISES[1], // Deadlift
      EXERCISES[2], // Barbell Squat
      EXERCISES[3], // Pull Up
    ],
    thumbnailEmoji: '🏋️',
    isAIRecommended: true,
    tags: ['strength', 'muscle-gain', 'compound']
  },
  {
    id: 'plan_hiit',
    name: 'HIIT Cardio Burner',
    description: 'High-intensity interval training designed to maximize fat loss and stamina.',
    category: 'cardio',
    difficulty: 'advanced',
    durationMinutes: 20,
    exercises: [
      EXERCISES[13], // Burpees
      EXERCISES[14], // Mountain Climbers
      EXERCISES[15], // High Knees
      EXERCISES[22], // Jumping Jacks
    ],
    thumbnailEmoji: '🔥',
    isAIRecommended: true,
    tags: ['cardio', 'fat-loss', 'high-intensity']
  },
  {
    id: 'plan_morning_yoga',
    name: 'Morning Vinyasa Flow',
    description: 'Mindful breathing and active postures to energize your body and focus the mind.',
    category: 'yoga',
    difficulty: 'beginner',
    durationMinutes: 15,
    exercises: [
      YOGA_EXERCISES[0], // Downward Dog
      YOGA_EXERCISES[1], // Warrior I
      YOGA_EXERCISES[3], // Cobra Pose
      YOGA_EXERCISES[5], // Cat Cow
    ],
    thumbnailEmoji: '🧘',
    isAIRecommended: false,
    tags: ['yoga', 'flexibility', 'recovery']
  }
];
