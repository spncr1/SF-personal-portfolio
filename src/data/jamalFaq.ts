export interface JamalFaqFact {
  topic: string;
  fact: string;
}

export interface JamalInterestFact extends JamalFaqFact {
  category: "personal-interest";
}

const SPENCER_BIRTH_DATE = {
  year: 2004,
  month: 5,
  day: 12,
} as const;

export function getSpencerAge(now = new Date()): number {
  const sydneyDateParts = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const readPart = (type: "year" | "month" | "day") =>
    Number(sydneyDateParts.find((part) => part.type === type)?.value);
  const currentYear = readPart("year");
  const currentMonth = readPart("month");
  const currentDay = readPart("day");
  const birthdayHasPassed =
    currentMonth > SPENCER_BIRTH_DATE.month ||
    (currentMonth === SPENCER_BIRTH_DATE.month && currentDay >= SPENCER_BIRTH_DATE.day);

  return currentYear - SPENCER_BIRTH_DATE.year - (birthdayHasPassed ? 0 : 1);
}

export const jamalFaq = {
  personalFacts: [
    {
      topic: "age",
      get fact() {
        return `Spencer is ${getSpencerAge()} years old.`;
      },
    },
    {
      topic: "birthday",
      fact: "Spencer's birthday is 12 May 2004.",
    },
    {
      topic: "location",
      fact: "Spencer is based in Sydney, Australia, as shown by the location signal on the Central Hub.",
    },
    { topic: "favourite colour", fact: "Spencer's favourite colour is black." },
    {
      topic: "personality",
      fact:
        "Spencer describes himself as ambitious, curious, and highly driven, with a creative streak and a tendency to turn ideas into things he can actually build.",
    },
  ] satisfies JamalFaqFact[],
  portfolioStory: [
    { topic: "MVP build time", fact: "The first working MVP of this portfolio took two weeks to build." },
    {
      topic: "MVP timing",
      fact: "The first working MVP was built in late August 2026, and development is ongoing.",
    },
    {
      topic: "reason for the portfolio",
      fact:
        "Spencer built a custom portfolio to stand out and to demonstrate how he thinks and builds, rather than simply placing his work in a conventional template. The command-centre interface represents his personality, technical interests, and approach to software.",
    },
    {
      topic: "HUD design inspiration",
      fact:
        "The command-centre and HUD direction draws from Spencer's interest in futuristic technology, science fiction, and interfaces seen in Iron Man and TRON. He wanted the portfolio to feel like stepping into his own digital workspace rather than visiting a conventional website.",
    },
    {
      topic: "hardest part",
      fact:
        "The hardest part was balancing the ambitious visual design with usability and responsiveness. Making the custom layouts, animation, and HUD elements cohesive across screen sizes took considerable iteration.",
    },
    {
      topic: "proudest part",
      fact: "Spencer is most proud of the opening HUD-style sequence visitors see when they first land on the site.",
    },
    {
      topic: "continued development",
      fact:
        "The portfolio is still being developed. Spencer is currently refining JAMAL, the site's digital companion for visitors exploring the portfolio.",
    },
    {
      topic: "authorship and AI tools",
      fact:
        "Spencer designed and built the portfolio from the ground up. He used AI development tools, primarily Codex as well as Claude Code and ChatGPT, to assist with implementation, debugging, and iteration. The concept, visual direction, architecture, and final decisions remained Spencer's.",
    },
  ] satisfies JamalFaqFact[],
  interests: [
    {
      category: "personal-interest",
      topic: "football",
      fact:
        "Spencer supports Manchester City and PSV Eindhoven. His favourite player is Raheem Sterling and his favourite football era is the 2010s. He plays locally on Saturdays and built the football sentiment-analysis project Atmos FC.",
    },
    {
      category: "personal-interest",
      topic: "gym and fitness",
      fact:
        "Spencer has trained for roughly one to two years, with a focus on functional strength and staying fit and healthy.",
    },
    {
      category: "personal-interest",
      topic: "music",
      fact:
        "Spencer mainly listens to music. His favourite genres include rap, hip-hop, R&B, and Afrobeats, with artists such as Drake, Kendrick Lamar, J. Cole, Brent Faiyaz, and Burna Boy among his favourites.",
    },
    {
      category: "personal-interest",
      topic: "drawing and visual design",
      fact:
        "Spencer mainly draws animated characters from favourite television shows and films. That creative mindset influences how he establishes a distinct visual identity and carefully considers interface aesthetics for each project.",
    },
  ] satisfies JamalInterestFact[],
  workPreferences: [
    {
      topic: "preferred problems",
      fact: "Spencer most enjoys software problems that genuinely make him think and challenge him cognitively.",
    },
    {
      topic: "development preference",
      fact:
        "Spencer enjoys a mix of backend, frontend, full-stack, data, and design work, but his strengths and primary development preference are on the backend.",
    },
    {
      topic: "learning approach",
      fact: "Spencer jokes that his approach to learning a new technology is treating Google like his best friend.",
    },
    {
      topic: "working style",
      fact:
        "Spencer is comfortable working both independently and collaboratively and sees both styles as essential in software engineering.",
    },
    {
      topic: "opportunities",
      fact:
        "Spencer is interested in graduate and early-career software engineering roles involving meaningful products and growth across AI, backend systems, full-stack development, and emerging technologies. He is also open to startup opportunities, collaborations, and interesting technical projects.",
    },
  ] satisfies JamalFaqFact[],
  projectPreferences: [
    {
      topic: "favourite project",
      fact:
        "Nexa is Spencer's favourite published project. He created its simple, lightweight university-tracking interface after finding the breadth of tools such as Notion overwhelming, and he uses Nexa to help manage completing his degree by the end of 2026.",
    },
    {
      topic: "most difficult project",
      fact:
        "Atmos FC was Spencer's most difficult published project because finding the right APIs and data sources was challenging. Its scope changed several times: it began as a Reddit sentiment-analysis concept before YouTube comments became the primary sentiment source.",
    },
    {
      topic: "future project interest",
      fact: "Spencer would like to build something involving hardware because he is curious about the domain.",
    },
  ] satisfies JamalFaqFact[],
  conversationalStyle: {
    humour:
      "JAMAL may use restrained dry humour, light sarcasm, and occasional playful remarks about Spencer making things more elaborate than necessary.",
    approvedPhrases: [
      "badabing, badaboom",
      "apparently a normal website wasn't dramatic enough",
    ],
  },
} as const;
