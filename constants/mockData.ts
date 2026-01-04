// constants/mockData.ts

export const SITE_NAME = "Imuhira TV";
export const SITE_DESCRIPTION = "Imuhira TV is a news platform dedicated to providing accurate and timely information about the Banyamulenge community in the Democratic Republic of Congo. Our mission is to amplify the voices of the Banyamulenge people, share their stories, and shed light on the challenges they face.";
export const SITE_LOGO = "/images/logo.jpg";

export const NAV_LINKS = [
  { name: "History", href: "/category/history" },
  { name: "Culture", href: "/category/culture" },
  { name: "Conflict", href: "/category/conflict" },
  { name: "Politics", href: "/category/politics" },
  { name: "Stories", href: "/category/stories" },
];

export const FEATURED_ARTICLE = {
  id: 1,
  title: "The Banyamulenge: A People's History of Resilience and Conflict",
  slug: "banyamulenge-history-resilience-conflict",
  href: "/articles/banyamulenge-history-resilience-conflict",
  excerpt: "An in-depth look at the history of the Banyamulenge people, from their pastoralist traditions to their current struggle for survival and recognition in the highlands of South Kivu.",
  main_image_url: "https://img.youtube.com/vi/UGI3bJee5wM/maxresdefault.jpg",
  author_name: "Imuhira Staff",
  published_at: "Jan 1, 2026",
  category: { name: "History", href: "/category/history" },
  youtube_video_id: "UGI3bJee5wM", 
  content: [
    "In this exclusive feature, we sit down with Seba Kiyana to discuss the deep-rooted history of the Banyamulenge in the High Plateaux. The conversation delves into the origins of the community, challenging the narratives that have often been used to marginalize them.",
    "Kiyana argues that the current violence is not merely a result of inter-communal skirmishes but a systematic attempt to erase the Banyamulenge presence from their ancestral lands. He draws parallels between historical persecution and the current events unfolding in Minembwe.",
    "This report is essential viewing for anyone trying to understand the complexity of the identity crisis in Eastern DRC and the resilience required to survive it."
  ]
};

export const TRENDING_ARTICLES = [
  {
    id: 2,
    title: "Twirwaneho and the M23: A Controversial Alliance",
    slug: "twirwaneho-m23-alliance",
    href: "/articles/twirwaneho-m23-alliance",
    excerpt: "The Twirwaneho militia has reportedly formed an alliance with the M23 rebels, a move that has been met with both support and condemnation.",
    main_image_url: "https://img.youtube.com/vi/WaZC9Trs7TM/maxresdefault.jpg",
    category: { name: "Conflict", href: "/category/conflict" },
    author_name: "Imuhira Staff",
    published_at: "Jan 2, 2026",
    youtube_video_id: "WaZC9Trs7TM",
    content: [
        "Reports have surfaced regarding a tactical alignment between the Twirwaneho self-defense group and the M23 movement. This development has sparked intense debate within the community.",
        "Critics argue that this alliance could further isolate the Banyamulenge and invite harsher crackdowns from the FARDC. Supporters, however, view it as a necessary survival strategy in the face of overwhelming odds.",
        "Our analysis breaks down the military and political implications of this potential cooperation."
    ]
  },
  {
    id: 3,
    title: "The 'Akagara' Perspective: Voices from within the Pro-Government Faction",
    slug: "akagara-pro-government-perspective",
    href: "/articles/akagara-pro-government-perspective",
    excerpt: "A deep dive into the motivations and goals of the 'Akagara' faction, which advocates for cooperation with the Congolese government.",
    main_image_url: "https://img.youtube.com/vi/lodc-uachuw/maxresdefault.jpg",
    category: { name: "Politics", href: "/category/politics" },
    author_name: "Imuhira Staff",
    published_at: "Jan 3, 2026",
    youtube_video_id: "lodc-uachuw",
    content: [
        "Me Emile and other political leaders discuss the 'Akagara' approach: diplomacy over arms. They believe that the path to peace lies in full integration and cooperation with Kinshasa.",
        "This segment explores their counter-arguments to the armed resistance and their vision for a peaceful South Kivu. Is their strategy viable in the current climate of distrust?",
        "We analyze the reception of their message among the youth and the displaced populations in the camps."
    ]
  },
  {
    id: 4,
    title: "Displaced and Forgotten: The Humanitarian Crisis in Minembwe",
    slug: "minembwe-humanitarian-crisis",
    href: "/articles/minembwe-humanitarian-crisis",
    excerpt: "Thousands of people have been displaced by the conflict in Minembwe, and the humanitarian situation is dire. This article sheds light on their plight.",
    main_image_url: "https://img.youtube.com/vi/l_WEF_EPcJs/maxresdefault.jpg",
    category: { name: "Humanitarian", href: "/category/humanitarian" },
    author_name: "Imuhira Staff",
    published_at: "Jan 4, 2026",
    youtube_video_id: "l_WEF_EPcJs",
    content: []
  },
  {
    id: 5,
    title: "The 'Idubu' Narrative: Self-Defense or Rebellion?",
    slug: "idubu-self-defense-rebellion",
    href: "/articles/idubu-self-defense-rebellion",
    excerpt: "The 'Idubu' faction, which supports the Twirwaneho militia, claims to be acting in self-defense. But is there more to their story?",
    main_image_url: "https://img.youtube.com/vi/CNIBOa-9dsM/maxresdefault.jpg",
    category: { name: "Conflict", href: "/category/conflict" },
    author_name: "Imuhira Staff",
    published_at: "Jan 5, 2026",
    youtube_video_id: "CNIBOa-9dsM",
    content: [
        "Fiston G. explains the origins of the 'Idubu' movement. 'We did not choose this war,' he states, 'it was forced upon us.'",
        "This video traces the timeline from local defense initiatives to the formation of a more organized resistance. What triggered the shift?",
        "The narrative challenges the label of 'rebels,' positioning the group instead as the last line of defense for a community under siege."
    ]
  },
];

export const LATEST_ARTICLES = [
  // HISTORY
  {
    id: 101,
    title: "The Banyamulenge in the Congo Wars: A Story of Shifting Alliances",
    slug: "banyamulenge-congo-wars-alliances",
    href: "/articles/banyamulenge-congo-wars-alliances",
    excerpt: "From the First Congo War to the present day, the Banyamulenge have been both victims and actors in the conflicts that have ravaged the region. This article explores their complex and often misunderstood role.",
    main_image_url: "https://img.youtube.com/vi/MynchGn0Km4/maxresdefault.jpg",
    category: { name: "History", href: "/category/history" },
    author_name: "Imuhira Staff",
    published_at: "2 hours ago",
    youtube_video_id: "MynchGn0Km4",
    content: [
        "Seba Kiyana returns to discuss the historical context of the Congo Wars. How did the Banyamulenge get caught in the middle of regional power struggles?",
        "This detailed history lesson clarifies the shifting alliances of the 90s and 2000s that continue to haunt the region today."
    ]
  },
  {
    id: 102,
    title: "Who Are the Banyamulenge? Debunking the Myths",
    slug: "who-are-the-banyamulenge-myths",
    href: "/articles/who-are-the-banyamulenge-myths",
    excerpt: "Are they Congolese or Rwandan? This article delves into the history of the Banyamulenge people and the origins of the controversy surrounding their identity.",
    main_image_url: "https://img.youtube.com/vi/JD1GX00tKPk/maxresdefault.jpg",
    category: { name: "History", href: "/category/history" },
    author_name: "Imuhira Staff",
    published_at: "5 hours ago",
    youtube_video_id: "JD1GX00tKPk",
    content: [
        "The question of identity is central to the conflict. In this video, we debunk the myths surrounding the origins of the Banyamulenge.",
        "Using historical records and oral tradition, we establish the timeline of migration and settlement that proves their Congolese nationality beyond doubt."
    ]
  },

  // CONFLICT
  {
    id: 201,
    title: "The 'Idubu' vs. 'Akagara' Divide: A New Fault Line in the Banyamulenge Community",
    slug: "idubu-akagara-divide-banyamulenge",
    href: "/articles/idubu-akagara-divide-banyamulenge",
    excerpt: "A new generation of Banyamulenge is divided. On one side, the 'Idubu', who support the Twirwaneho militia. On the other, the 'Akagara', who advocate for cooperation with the government.",
    main_image_url: "https://img.youtube.com/vi/jlVoGg5Sisc/maxresdefault.jpg",
    category: { name: "Conflict", href: "/category/conflict" },
    author_name: "Imuhira Staff",
    published_at: "3 hours ago",
    youtube_video_id: "jlVoGg5Sisc",
    content: [
        "Internal cohesion has always been a strength of the community, but recent events show a fracturing. The 'Idubu' and 'Akagara' divide is not just political; it's tearing families apart.",
        "We explore the rhetoric used by both sides and the potential for reconciliation."
    ]
  },
  {
    id: 202,
    title: "Life Under Siege: A Report from Minembwe",
    slug: "life-under-siege-minembwe",
    href: "/articles/life-under-siege-minembwe",
    excerpt: "For months, the town of Minembwe has been under siege, cut off from the rest of the world. This is a report from inside the besieged town, where the population is struggling to survive.",
    main_image_url: "https://img.youtube.com/vi/zHfMhAwuZOE/maxresdefault.jpg",
    category: { name: "Conflict", href: "/category/conflict" },
    author_name: "Imuhira Staff",
    published_at: "1 day ago",
    youtube_video_id: "zHfMhAwuZOE",
    content: [
        "Minembwe is effectively an island, surrounded by hostile forces. Kingungwa reports on the daily struggle for food and safety.",
        "The siege mentality has taken hold, but so has a remarkable spirit of endurance."
    ]
  },

  // CULTURE
  {
    id: 301,
    title: "Inanga: The Sound of the Banyamulenge",
    slug: "inanga-sound-of-banyamulenge",
    href: "/articles/inanga-sound-of-banyamulenge",
    excerpt: "The inanga, a traditional stringed instrument, is at the heart of Banyamulenge culture. This article explores the history of the inanga and its role in Banyamulenge society.",
    main_image_url: "https://img.youtube.com/vi/yRfRPOqppfA/maxresdefault.jpg",
    category: { name: "Culture", href: "/category/culture" },
    author_name: "Imuhira Staff",
    published_at: "4 hours ago",
    youtube_video_id: "yRfRPOqppfA",
    content: [
        "The Banyamulenge Mutuality gathering brought together elders and youth to celebrate their heritage.",
        "At the center of it all was the Inanga, the instrument that carries the history of the people in its strings. Listen to the sounds that define a culture."
    ]
  },
  {
    id: 302,
    title: "The Banyamulenge Diaspora: A Story of Exile and Resilience",
    slug: "banyamulenge-diaspora-exile-resilience",
    href: "/articles/banyamulenge-diaspora-exile-resilience",
    excerpt: "Forced to flee their homeland, the Banyamulenge diaspora has spread across the globe. This article tells the story of their exile and their efforts to preserve their culture and traditions.",
    main_image_url: "https://img.youtube.com/vi/cdvGbbf_ODA/maxresdefault.jpg",
    category: { name: "Culture", href: "/category/culture" },
    author_name: "Imuhira Staff",
    published_at: "8 hours ago",
    youtube_video_id: "cdvGbbf_ODA",
    content: [
        "From the refugee camps to Arizona, the call to return home ('Gutaha') is growing louder.",
        "This video explores the diaspora's role in supporting those back home and the longing for the hills of Mulenge."
    ]
  },

  // STORIES
  {
    id: 401,
    title: "My Father, the Mulao",
    slug: "my-father-the-mulao",
    href: "/articles/my-father-the-mulao",
    excerpt: "A personal story about growing up as the son of a Banyamulenge chief and the challenges of leadership in a time of conflict.",
    main_image_url: "https://img.youtube.com/vi/8w6RB-EmNPY/maxresdefault.jpg",
    category: { name: "Stories", href: "/category/stories" },
    author_name: "Gatete",
    published_at: "1 day ago",
    youtube_video_id: "8w6RB-EmNPY",
    content: [
        "Kibongi Madame shares a powerful testimony. It is a story of loss, but also of incredible strength.",
        "Her words paint a vivid picture of the personal cost of the conflict, moving beyond the statistics to the human heart."
    ]
  },
  {
    id: 402,
    title: "The Day the Cows Didn't Come Home",
    slug: "the-day-the-cows-didnt-come-home",
    href: "/articles/the-day-the-cows-didnt-come-home",
    excerpt: "A moving story about the impact of cattle raiding on a Banyamulenge family and their struggle to survive.",
    main_image_url: "https://img.youtube.com/vi/B3HChp1i7JE/maxresdefault.jpg",
    category: { name: "Stories", href: "/category/stories" },
    author_name: "Mabenga",
    published_at: "2 days ago",
    youtube_video_id: "B3HChp1i7JE",
    content: [
        "Col. Nyamushebwa speaks with deep sorrow about the loss of livestock—the economic and cultural backbone of the community.",
        "This isn't just about cows; it's about the destruction of a way of life."
    ]
  },
];