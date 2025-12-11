// constants/mockData.ts

export const SITE_NAME = "The Kivu Monitor";

export const NAV_LINKS = [
  { name: "Conflict Monitor", href: "/category/conflict" },
  { name: "Humanitarian", href: "/category/humanitarian" },
  { name: "Regional Politics", href: "/category/politics" },
  { name: "Community & Culture", href: "/category/culture" },
];


export const FEATURED_ARTICLE = {
  id: 1,
  title: "Siege on the High Plateaux: Minembwe Isolated as Clashes Intensify",
  slug: "minembwe-siege-intensifies-dec-2025",
  href: "/articles/minembwe-siege-intensifies-dec-2025", // Standardized to /articles/
  excerpt: "The road to Uvira remains cut off for the 45th consecutive day. With aid blockades tightening, local leaders report critical shortages of medicine for the 150,000 civilians trapped in the highlands.",
  main_image_url: "https://picsum.photos/seed/minembwe-highlands/1200/600",
  author_name: "Jean-Paul Mwilambwe",
  published_at: "Dec 8, 2025",
  category: { name: "Conflict Monitor", href: "/category/conflict" },
};

export const TRENDING_ARTICLES = [
  { 
    id: 2, 
    title: "Mikalati Attack: 4 Civilians Killed Returning from Bijombo Market", 
    slug: "mikalati-attack-civilians",
    href: "/articles/mikalati-attack-civilians"
  },
  { 
    id: 3, 
    title: "Cholera Outbreak in Fizi: 652 Cases Reported Since October", 
    slug: "fizi-cholera-outbreak-msf",
    href: "/articles/fizi-cholera-outbreak-msf"
  },
  { 
    id: 4, 
    title: "Uvira-Bukavu Road (RN5) Paralyzed by New Wazalendo Checkpoints", 
    slug: "rn5-road-blockades-uvira",
    href: "/articles/rn5-road-blockades-uvira"
  },
  { 
    id: 5, 
    title: "Burundian Military Involvement: New Allegations in South Kivu", 
    slug: "burundi-sandf-south-kivu",
    href: "/articles/burundi-sandf-south-kivu"
  },
];

export const LATEST_ARTICLES = [
  // POLITICS & DIPLOMACY
  {
    id: 101,
    title: "Kinshasa and Kigali Trade Accusations Over M23 Southern Advance",
    slug: "kinshasa-kigali-tensions-m23-south",
    href: "/articles/kinshasa-kigali-tensions-m23-south",
    excerpt: "As M23 elements push south towards Mwenga, the fragile ceasefire fractures. Regional observers warn of a direct confrontation between state armies.",
    main_image_url: "https://picsum.photos/seed/diplomacy/800/600",
    category: { name: "Regional Politics", href: "/category/politics" },
    author_name: "Sarah Jenkins",
    published_at: "2 hours ago",
  },
  {
    id: 102,
    title: "South Kivu Governor Calls for Calm Amidst 'Balkanization' Fears",
    slug: "governor-balkanization-speech",
    href: "/articles/governor-balkanization-speech",
    excerpt: "In a chaotic press conference in Bukavu, provincial authorities denied losing control of the Ruzizi Plain despite the fall of Luvungi.",
    main_image_url: "https://picsum.photos/seed/governor/800/600",
    category: { name: "Regional Politics", href: "/category/politics" },
    author_name: "Dieudonné Kabila",
    published_at: "5 hours ago",
  },

  // SECURITY & TECH
  {
    id: 201,
    title: "Surveillance Drones Spotted Over Twirwaneho Positions",
    slug: "drones-minembwe-conflict",
    href: "/articles/drones-minembwe-conflict",
    excerpt: "Local defense groups in Minembwe claim foreign-made drones are coordinating artillery strikes against their cattle camps.",
    main_image_url: "https://picsum.photos/seed/drones/800/600",
    category: { name: "Security", href: "/category/security" },
    author_name: "Mike Ross",
    published_at: "3 hours ago",
  },
  {
    id: 202,
    title: "Communication Blackout: The Battle for Network Towers",
    slug: "network-blackout-uvira-fizi",
    href: "/articles/network-blackout-uvira-fizi",
    excerpt: "Sabotage of Vodacom and Airtel towers in Fizi territory has left 40,000 residents without contact to the outside world for 72 hours.",
    main_image_url: "https://picsum.photos/seed/tower/800/600",
    category: { name: "Security", href: "/category/security" },
    author_name: "Alain Makambo",
    published_at: "1 day ago",
  },

  // HUMANITARIAN
  {
    id: 301,
    title: "MSF Launches Emergency Response in Baraka",
    slug: "msf-emergency-baraka-malaria",
    href: "/articles/msf-emergency-baraka-malaria",
    excerpt: "With 19,000 malaria cases treated in three months, medical teams are overwhelmed as displacement camps swell with new arrivals from the highlands.",
    main_image_url: "https://picsum.photos/seed/hospital/800/600",
    category: { name: "Humanitarian", href: "/category/humanitarian" },
    author_name: "Dr. Elise Dubus",
    published_at: "4 hours ago",
  },
  {
    id: 302,
    title: "Peace Tournament in Uvira Cancelled Due to Shelling",
    slug: "uvira-peace-football-cancelled",
    href: "/articles/uvira-peace-football-cancelled",
    excerpt: "A football match intended to reconcile Bafuliiru and Banyamulenge youth was abandoned after mortar fire struck the stadium perimeter.",
    main_image_url: "https://picsum.photos/seed/stadium/800/600",
    category: { name: "Humanitarian", href: "/category/humanitarian" },
    author_name: "Serena W.",
    published_at: "8 hours ago",
  },

  // CULTURE & SOCIETY
  {
    id: 401,
    title: "The vanishing cattle: Economic warfare in the Hauts-Plateaux",
    slug: "cattle-raids-economy-war",
    href: "/articles/cattle-raids-economy-war",
    excerpt: "For the Banyamulenge, cows are life. Recent systematic raids have seen over 2,000 head of cattle looted this month alone, devastating the local economy.",
    main_image_url: "https://picsum.photos/seed/cattle/800/600",
    category: { name: "Culture", href: "/category/culture" },
    author_name: "Michel Rugema",
    published_at: "1 day ago",
  },
  {
    id: 402,
    title: "Radio Maendeleo: The Voice Keeping Hope Alive",
    slug: "radio-maendeleo-bukavu",
    href: "/articles/radio-maendeleo-bukavu",
    excerpt: "How a community radio station in Bukavu is fighting disinformation and hate speech spreading across the Ruzizi Plain.",
    main_image_url: "https://picsum.photos/seed/radio/800/600",
    category: { name: "Culture", href: "/category/culture" },
    author_name: "Rolling Stone",
    published_at: "2 days ago",
  },
];
