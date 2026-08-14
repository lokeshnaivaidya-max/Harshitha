export interface PhotoMemory {
  id: string;
  url: string;
  title: string;
  caption: string;
  date?: string;
  location?: string;
  category: 'all' | 'adventures' | 'smiles' | 'special' | 'candid';
  rotation?: number; // for polaroid look
}

export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  content: string;
  highlight: string;
  iconName: string;
}

export interface ReasonToLove {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface BirthdayData {
  name: string;
  nickname: string;
  birthdayDate: string; // e.g. "Today" or special date
  hero: {
    badge: string;
    titleFirst: string;
    titleHighlight: string;
    titleLast: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    heroPhoto: string;
  };
  quote: {
    text: string;
    author: string;
  };
  storyChapters: StoryChapter[];
  photoGallery: PhotoMemory[];
  reasonsWhySpecial: ReasonToLove[];
  cakeSection: {
    title: string;
    subtitle: string;
    flavor: string;
    candlesCount: number;
    wishPrompt: string;
    afterBlowWishText: string;
  };
  secretLetter: {
    envelopeTitle: string;
    letterDate: string;
    salutation: string;
    paragraphs: string[];
    signOff: string;
    author: string;
    postScript?: string;
  };
  timelineMilestones: {
    year: string;
    title: string;
    description: string;
    tag: string;
  }[];
  musicConfig: {
    audioSrc: string;
    trackTitle: string;
    artist: string;
  };
}

export const harshithaData: BirthdayData = {
  name: "Harshitha",
  nickname: "Harshi",
  birthdayDate: "A Very Special Day",
  hero: {
    badge: "✨ Today is All About You ✨",
    titleFirst: "Happiest Birthday,",
    titleHighlight: "Harshitha",
    titleLast: "❤️",
    subtitle: "To the one who brings the brightest warmth, the sweetest smiles, and endless magic into every single moment. Here's a little world created just to celebrate you.",
    ctaPrimary: "Cut the Birthday Cake 🎂",
    ctaSecondary: "Explore Our Memories 📸",
    heroPhoto: "/images/harshitha/hero.svg"
  },
  quote: {
    text: "Some people make the world brighter just by being in it. You are one of those rare souls.",
    author: "Celebrating You Always"
  },
  storyChapters: [
    {
      id: "chapter-1",
      number: "01",
      title: "The Light You Bring",
      subtitle: "Every room gets brighter with your laugh",
      content: "From the very first conversation to all the quiet, goofy, and wonderful times in between, having you around feels like a warm cup of coffee on a rainy morning. Your kindness is genuine, your presence is comforting, and your laughter is completely contagious.",
      highlight: "Pure Sunshine in Human Form",
      iconName: "Sun"
    },
    {
      id: "chapter-2",
      number: "02",
      title: "The Beautiful Soul",
      subtitle: "Thoughtful, caring, and deeply inspiring",
      content: "You have a way of caring for the people around you that never goes unnoticed. Your patience, your sharp wit, your curiosity about the world, and how passionately you embrace every small joy make you genuinely one of a kind.",
      highlight: "Unmatched Grace & Warmth",
      iconName: "Heart"
    },
    {
      id: "chapter-3",
      number: "03",
      title: "Memories in the Making",
      subtitle: "Unfiltered laughter and cherished moments",
      content: "Looking back at every photo, every road trip, late-night chat, and spontaneous plan, each moment is etched as an unforgettable memory. Life is simply so much richer, funnier, and more colorful with you in it.",
      highlight: "Every Moment is a Treasure",
      iconName: "Sparkles"
    }
  ],
  photoGallery: [
    {
      id: "photo-1",
      url: "/images/harshitha/photo1.svg",
      title: "That Radiant Smile",
      caption: "The smile that can brighten up the gloomiest day in seconds.",
      category: "smiles",
      date: "Forever Favorite",
      location: "Everywhere you go",
      rotation: -2
    },
    {
      id: "photo-2",
      url: "/images/harshitha/photo2.svg",
      title: "Golden Hour Glow",
      caption: "Chasing sunsets and making every single golden hour unforgettable.",
      category: "adventures",
      date: "Sunset Magic",
      location: "Golden Horizons",
      rotation: 3
    },
    {
      id: "photo-3",
      url: "/images/harshitha/photo3.svg",
      title: "Unfiltered Joy",
      caption: "The candid moments where you're laughing your heart out without a care.",
      category: "candid",
      date: "Pure Happiness",
      location: "Unforgettable Days",
      rotation: -1
    },
    {
      id: "photo-4",
      url: "/images/harshitha/photo4.svg",
      title: "Dressed in Elegance",
      caption: "Graceful, stunning, and effortlessly breathtaking as always.",
      category: "special",
      date: "Special Occasion",
      location: "Dressed to Impress",
      rotation: 2
    },
    {
      id: "photo-5",
      url: "/images/harshitha/photo5.svg",
      title: "Adventures & Roadtrips",
      caption: "Exploring new places, singing loudly in the car, and enjoying the ride.",
      category: "adventures",
      date: "Wanderlust",
      location: "Road to Adventure",
      rotation: -3
    },
    {
      id: "photo-6",
      url: "/images/harshitha/photo6.svg",
      title: "Cozy Coffee Moments",
      caption: "Warm sips, endless conversations, and talking about everything under the sun.",
      category: "candid",
      date: "Cafe Vibes",
      location: "Our Favorite Corner",
      rotation: 1
    },
    {
      id: "photo-7",
      url: "/images/harshitha/photo7.svg",
      title: "Celebration Night",
      caption: "When the lights are glowing and the energy is unmatched.",
      category: "special",
      date: "Party Nights",
      location: "City Lights",
      rotation: -2
    },
    {
      id: "photo-8",
      url: "/images/harshitha/photo8.svg",
      title: "The Incomparable Vibe",
      caption: "Just being your authentic, wonderful, effortlessly iconic self.",
      category: "smiles",
      date: "Iconic Harshitha",
      location: "Everywhere",
      rotation: 2
    }
  ],
  reasonsWhySpecial: [
    {
      id: "reason-1",
      title: "Your Contagious Laugh",
      description: "You have that joyful laugh that instantly makes everyone around you smile no matter what.",
      emoji: "✨"
    },
    {
      id: "reason-2",
      title: "A Heart of Pure Gold",
      description: "You genuinely care for others with an empathy and sincerity that is rare and precious.",
      emoji: "💖"
    },
    {
      id: "reason-3",
      title: "Your Incredible Humor",
      description: "Quick wit, playful jokes, and the ability to turn ordinary conversations into hilarious comedy.",
      emoji: "🌸"
    },
    {
      id: "reason-4",
      title: "Unstoppable Strength",
      description: "The way you handle challenges with poise, resilience, and unwavering determination.",
      emoji: "⭐"
    },
    {
      id: "reason-5",
      title: "Effortless Grace & Style",
      description: "You light up every room effortlessly with your natural charm and gorgeous elegance.",
      emoji: "👑"
    },
    {
      id: "reason-6",
      title: "A True Constant in Life",
      description: "Someone you can always rely on, laugh with, and make the most unforgettable memories alongside.",
      emoji: "🥂"
    }
  ],
  cakeSection: {
    title: "Make a Birthday Wish, Harshitha",
    subtitle: "A digital celebration made especially for you. Light the candle, blow it out, and slice the cake!",
    flavor: "Red Velvet with Vanilla Rose Cream & Gold Leaf Sprinkles 🎂",
    candlesCount: 1,
    wishPrompt: "Close your eyes, think of your deepest wish for the year ahead...",
    afterBlowWishText: "May every single wish you made today turn into your most beautiful reality!"
  },
  timelineMilestones: [
    {
      year: "Chapter 1",
      title: "The Spark of Friendship",
      description: "How a simple greeting blossomed into endless conversations and shared laughs.",
      tag: "Beginning"
    },
    {
      year: "Chapter 2",
      title: "Inside Jokes & Adventures",
      description: "Late nights, road trips, goofy moments, and stories only we will ever understand.",
      tag: "Memories"
    },
    {
      year: "Chapter 3",
      title: "Unbreakable Connection",
      description: "Through ups and downs, always knowing there is someone who believes in you 100%.",
      tag: "Together"
    },
    {
      year: "Today",
      title: "Celebrating Harshitha!",
      description: "A brand new year of growth, happiness, breathtaking milestones, and sweet moments.",
      tag: "Birthday"
    }
  ],
  secretLetter: {
    envelopeTitle: "A Private Birthday Letter For Harshitha",
    letterDate: "Today & Always",
    salutation: "Dearest Harshitha,",
    paragraphs: [
      "Happy, happiest Birthday! As you celebrate another fabulous trip around the sun, I wanted to take a quiet moment to remind you just how deeply appreciated, loved, and valued you truly are.",
      "You have an extraordinary spirit that touches everyone lucky enough to know you. Your kindness isn't just an action; it's a way of being. Whether it's the encouraging words you share, the infectious joy you radiate, or just your quiet presence when someone needs comfort, you make this world a much softer and happier place.",
      "My wish for you this year is boundless happiness. I hope the coming chapters bring you everything you've worked for, the courage to chase your wildest dreams, moments of peace when life gets noisy, and endless reasons to laugh till your stomach hurts.",
      "Never forget how truly capable, beautiful, and irreplaceable you are. Keep shining your brilliant light—today and every single day ahead."
    ],
    signOff: "With all my love and warmest wishes,",
    author: "Your Biggest Cheerleader & Well-Wisher",
    postScript: "P.S. Don't forget to eat an extra large slice of cake and make three wishes today!"
  },
  musicConfig: {
    audioSrc: "/audio/birthday.mp3",
    trackTitle: "Birthday Serenade (for Harshitha)",
    artist: "Acoustic Melody & Ambient Celebration"
  }
};
