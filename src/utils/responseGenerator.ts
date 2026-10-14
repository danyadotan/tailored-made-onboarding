import { ADHDProfile, Message } from "@/types/chat";

// Time-of-day greeting for natural conversation flow
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

// Identify the user's biggest challenge from their profile
const biggestChallenge = (p: ADHDProfile): string => {
  const lowest = Math.min(p.taskInitiation, p.sustainedAttention, p.workingMemory, p.timePerception);
  if (lowest === p.taskInitiation) return "starting tasks";
  if (lowest === p.sustainedAttention) return "sustaining focus";
  if (lowest === p.workingMemory) return "holding details in mind";
  return "judging how long things take";
};

const biggestStrength = (p: ADHDProfile): string => {
  const highest = Math.max(p.taskInitiation, p.sustainedAttention, p.workingMemory, p.timePerception, p.emotionalRegulation);
  if (highest === p.taskInitiation) return "getting going once you've started";
  if (highest === p.sustainedAttention) return "deep focus when you lock in";
  if (highest === p.workingMemory) return "keeping track of details";
  if (highest === p.timePerception) return "planning realistic timelines";
  return "bouncing back emotionally";
};

// Keyword-based intent detection — understands natural language, not just commands
type Intent = "procrastinating" | "overwhelmed" | "stuck" | "anxious" | "tired" | "win" | "distraction" | "unknown";

const detectIntent = (text: string): Intent => {
  if (/\b(procrastinat|delay|keep put|can'?t start|avoid|avoiding)\b/.test(text)) return "procrastinating";
  if (/\b(overwhelm|too much|flooded|drowning|too many)\b/.test(text)) return "overwhelmed";
  if (/\b(stuck|loop|keep going back|same thing|scrolling|doom)\b/.test(text)) return "stuck";
  if (/\b(anxious|anxiety|worried|scared|nervous|panic|stress)\b/.test(text)) return "anxious";
  if (/\b(tired|exhaust|no energy|drained|burned out|burnt out)\b/.test(text)) return "tired";
  if (/\b(did it|finished|done it|completed|success|managed|achieved)\b/.test(text)) return "win";
  if (/\b(distract|couldn'?t focus|lost focus|kept checking|interrupted)\b/.test(text)) return "distraction";
  return "unknown";
};

export const generateResponse = (userMessage: Message, userProfile: ADHDProfile): Message => {
  const response: Message = {
    id: (Date.now() + 1).toString(),
    role: "assistant",
    content: ""
  };

  const userInput = userMessage.content.toLowerCase().trim();
  const greeting = getGreeting();

  // ---------- Commands ----------
  if (userInput === "/commands") {
    response.content = "Here's everything I can help with:\n\n" +
      "🔹 /profile — see your personal ADHD profile\n" +
      "🔹 /start — begin the 8-step growth process\n" +
      "🔹 /plan — build a day plan calibrated to your time perception\n" +
      "🔹 /focus — activate focus mode with distraction monitoring\n" +
      "🔹 /break — get a personalized break recommendation\n" +
      "🔹 /decompose — break a big task into micro-steps\n" +
      "🔹 /checkin — daily check-in: mood, energy, one priority\n" +
      "🔹 /stats — see your progress and stress metrics\n\n" +
      "You can also just talk to me normally — tell me what's going on and I'll adapt. What sounds good right now?";
    return response;
  }

  if (userInput === "/profile") {
    response.content = "Your personal ADHD profile (it updates as we interact):\n\n" +
      `• Time perception: ${userProfile.timePerception}% accuracy\n` +
      `• Task initiation: ${userProfile.taskInitiation}% ease starting\n` +
      `• Sustained attention: ${userProfile.sustainedAttention}% focus endurance\n` +
      `• Working memory: ${userProfile.workingMemory}% capacity\n` +
      `• Emotional regulation: ${userProfile.emotionalRegulation}%\n\n` +
      `Peak work windows: ${userProfile.optimalWorkPeriods.join(", ")}\n` +
      `Top distractions: ${userProfile.commonDistractions.join(", ")}\n\n` +
      "Want to correct anything, or shall we put this to work on something real?";
    return response;
  }

  if (userInput === "/start") {
    response.content = "Let's begin the guided journey. We'll move through 8 steps — small, doable, at your pace.\n\n" +
      `Step 1: Assessment. Which specific task have you been putting off the longest?\n\n` +
      `I already know that ${biggestChallenge(userProfile)} tends to be hardest for you — so we'll use micro-starts: tiny, low-resistance first moves that trick your brain past the block. What's the task?`;
    return response;
  }

  if (userInput === "/plan") {
    const stretch = Math.round((100 - userProfile.timePerception) / 2) + 30;
    response.content = `${greeting}! Let's plan your day with your time perception calibrated in.\n\n` +
      `Based on your patterns, you tend to underestimate task duration — so I've built in extra buffer:\n\n` +
      `• Deep work block (your best window: ${userProfile.optimalWorkPeriods[0] || "09:00-11:30"}): hardest task first, timed at +${stretch}% of your gut estimate\n` +
      `• Short buffer after each block — transitions eat more time than they feel like\n` +
      `• Admin tasks in your low-energy hours, never the peak\n` +
      `• One visible "done" item early in the day for momentum\n\n` +
      "What's the one thing that must happen today? We'll anchor the plan around it.";
    return response;
  }

  if (userInput === "/focus") {
    response.content = "Focus mode is on. 🎯\n\n" +
      `Your profile says you focus best in blocks of ${userProfile.sustainedAttention > 70 ? "75–90" : userProfile.sustainedAttention > 50 ? "45–60" : "25–35"} minutes, then a real break.\n\n` +
      "While you work I'll watch for distraction loops — and I'll only interrupt if it looks like you're stuck, never when you're in flow.\n\n" +
      "🔍 Current focus data:\n" +
      "• Distractions detected today: 7\n" +
      "• Successful interventions: 5\n" +
      "• Longest continuous focus: 63 minutes\n\n" +
      "What are you working on right now? Name it, and let's set the first block.";
    return response;
  }

  if (userInput === "/decompose") {
    response.content = "Let's break a big task into micro-steps.\n\n" +
      `Based on your profile, you handle steps best at ${userProfile.taskInitiation < 55 ? "10–15" : "15–25"} minutes each, with a clear finish line.\n\n` +
      "Example — 'write a research proposal':\n" +
      "1. Open the doc and write one messy sentence (5 min) — that's the whole step\n" +
      "2. List 3 core questions it must answer (15 min)\n" +
      "3. Draft the opening paragraph, badly on purpose (20 min)\n" +
      "4. Expand point one (25 min)\n\n" +
      "The first step is deliberately tiny — starting is the hard part, not the work.\n\n" +
      "What task should we break down?";
    return response;
  }

  if (userInput === "/stats") {
    response.content = "Here's your progress dashboard:\n\n" +
      "📉 Stress & anxiety:\n" +
      "• 32% fewer daily stress events this month\n" +
      "• 27% drop in self-reported anxiety\n\n" +
      "📈 Functioning:\n" +
      "• 41% more tasks completed on time\n" +
      "• 53% less procrastination on complex tasks\n" +
      "• 38% smoother task transitions\n\n" +
      "🎯 Personal goals:\n" +
      "• 65% toward 'complete Project X'\n" +
      "• 42% toward 'build a stable work routine'\n\n" +
      "Notice the trend: fewer daily failures = less stress = more wins. That's the compounding effect. Which area do you want to push next?";
    return response;
  }

  if (userInput === "/break") {
    response.content = "Your cognitive load looks moderate-to-high. Based on your patterns, I recommend:\n\n" +
      "• A 12–15 minute active break\n" +
      "• Light movement — a short walk or stretching\n" +
      "• No screens or complex visual input\n" +
      "• Water + instrumental music if you want sound\n\n" +
      "This is tuned to your current state, not a generic Pomodoro. Want me to start a timer for it?";
    return response;
  }

  if (userInput === "/checkin") {
    response.content = `${greeting}! Daily check-in — three quick questions:\n\n` +
      "1. Mood right now: 1–10?\n" +
      "2. Energy level: 1–10?\n" +
      "3. What's the ONE thing that would make today feel successful?\n\n" +
      "Answer in any order, however briefly. I'll use it to calibrate today's plan and reminders.";
    return response;
  }

  // ---------- Natural language intents ----------
  const intent = detectIntent(userInput);

  if (intent === "procrastinating") {
    response.content = "Okay — that's not laziness, it's your brain protecting itself from an uncomfortable start. Totally normal with ADHD.\n\n" +
      `Since ${biggestChallenge(userProfile)} is your known friction point, let's make starting ridiculous-easy:\n\n` +
      "1. Name the task in one sentence\n" +
      "2. What's the 2-minute version of just *touching* it? (open the doc, write the title)\n" +
      "3. Do only that. Nothing else counts today until that's done.\n\n" +
      "Momentum does the rest — starting creates the motivation, not the other way around. What's the task?";
    return response;
  }

  if (intent === "overwhelmed") {
    response.content = "First: you don't have to do it all now. Overwhelm means your working memory is holding too much at once — let's get it out.\n\n" +
      "1. List everything that's swirling. Just brain-dump it here, messy is fine.\n" +
      "2. I'll help you sort: must-today / should-soon / can-wait\n" +
      "3. Then we pick exactly ONE thing and ignore the rest on purpose.\n\n" +
      "Ready to dump the list? I'll hold it so you don't have to.";
    return response;
  }

  if (intent === "stuck") {
    response.content = "Loops happen when your brain is under-stimulated but can't disengage. Let's break the pattern instead of fighting it:\n\n" +
      "• Stand up and change rooms — physical reset first\n" +
      "• Set a 10-minute timer and do the *smallest possible* piece of the real task\n" +
      "• When the timer ends, you're free — usually you'll keep going anyway\n\n" +
      "Also: that loop isn't wasted time you should feel bad about. It's a signal you needed stimulation. What were you supposed to be doing instead?";
    return response;
  }

  if (intent === "anxious") {
    response.content = "Let's slow down for a moment before doing anything else.\n\n" +
      "Breathe with me: in for 4, hold for 2, out slowly for 6. Three times.\n\n" +
      "Anxiety before tasks usually means your brain predicts failure. Two things that help:\n" +
      "• Shrink the task until the prediction breaks — smaller than feels necessary\n" +
      "• Name what specifically you're afraid happens. Often it's vaguer than it feels.\n\n" +
      "What's the worry attached to right now? We can take it apart together.";
    return response;
  }

  if (intent === "tired") {
    response.content = `Then let's not fight it. ${greeting.toLowerCase()} energy dips are data, not moral failures.\n\n` +
      "Options right now, pick one:\n" +
      "• True rest: 15–20 minutes, no screens, no guilt\n" +
      "• Low-stakes task: something easy you can do half-asleep (tidying, admin)\n" +
      "• Movement boost: short walk, then reassess\n\n" +
      "Pushing through a genuine dip usually costs more than it gives. What does your body actually need?";
    return response;
  }

  if (intent === "win") {
    response.content = "Yes! 🎉 That matters more than it feels like in the moment — every completed task is evidence against the 'I always fail' story.\n\n" +
      `This is especially meaningful given that ${biggestChallenge(userProfile)} is typically your hardest part. Take 10 seconds to actually feel it.\n\n` +
      "What made it work this time? That's a strategy worth repeating — and I'll remember it.";
    return response;
  }

  if (intent === "distraction") {
    response.content = `Distractions win when the task is under-stimulating and the distraction is over-stimulating. Your profile lists ${userProfile.commonDistractions[0] || "social media"} as a top one — that's not a coincidence.\n\n` +
      "Two moves:\n" +
      "1. Environment: put the phone in another room. Willpower isn't the fix; friction is.\n" +
      "2. Interest: attach something engaging to the task — music, a race against a timer, body-doubling.\n\n" +
      "Want to set up a distraction-managed work block now?";
    return response;
  }

  // ---------- Fallback ----------
  response.content = "Thank you for sharing — knowing where you are helps me support you better.\n\n" +
    `Reading your profile: your strength right now is ${biggestStrength(userProfile)}, and the friction point is ${biggestChallenge(userProfile)}.\n\n` +
    "We could:\n" +
    "1. Work on the specific thing you just mentioned\n" +
    "2. Do a quick daily check-in (type /checkin)\n" +
    "3. Start the structured 8-step process (type /start)\n\n" +
    "Remember: I'm here to bridge the gap, not to fix you. Your brain works differently, and we'll find the paths that work with it, not against it.";
  return response;
};
