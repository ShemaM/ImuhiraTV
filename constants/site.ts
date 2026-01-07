// constants/site.ts

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

// Category descriptions for empty category pages
// Based on Banyamulenge community context - a Tutsi ethnic group in the South Kivu province of the DRC
export const CATEGORY_DESCRIPTIONS: Record<string, { title: string; description: string; highlights: string[] }> = {
  history: {
    title: "History of the Banyamulenge",
    description: "The Banyamulenge are a Tutsi ethnic group who have lived in the high plateaus of South Kivu in the eastern Democratic Republic of Congo for centuries. Their name derives from Mulenge, a village in the Itombwe highlands where many settled. This section explores their origins, migrations, and the historical events that have shaped their identity and place in the Great Lakes region of Africa.",
    highlights: [
      "Origins and migration to the Itombwe highlands",
      "Colonial era and Belgian rule impact",
      "Post-independence challenges and citizenship debates",
      "Role in regional conflicts and their aftermath"
    ]
  },
  culture: {
    title: "Banyamulenge Culture & Traditions",
    description: "The Banyamulenge have a rich cultural heritage rooted in pastoralism and community values. Their traditions include distinctive music, dance, oral storytelling, and ceremonies that celebrate life's milestones. Living in the mountainous regions of South Kivu, they have developed unique practices adapted to highland life while maintaining connections to broader Tutsi cultural traditions.",
    highlights: [
      "Traditional cattle-herding practices and pastoral lifestyle",
      "Music, dance, and oral traditions",
      "Marriage customs and family structures",
      "Language: Kinyamulenge dialect and its preservation"
    ]
  },
  conflict: {
    title: "Understanding the Conflicts",
    description: "The Banyamulenge have been caught in cycles of violence and displacement for decades. From the aftermath of the 1994 Rwandan genocide to the ongoing instability in eastern DRC, they have faced persecution, forced displacement, and tragic loss of life. This section documents these conflicts, seeking to provide accurate information and preserve the testimonies of those affected.",
    highlights: [
      "Impact of regional conflicts on the community",
      "Displacement and refugee experiences",
      "Human rights concerns and international attention",
      "Efforts toward peace and reconciliation"
    ]
  },
  politics: {
    title: "Politics & Citizenship",
    description: "The question of Banyamulenge citizenship in the Democratic Republic of Congo has been a contentious political issue for generations. Despite living in the country for centuries, they have repeatedly faced challenges to their nationality and political rights. This section examines the political landscape, legal frameworks, and ongoing advocacy for recognition and equality.",
    highlights: [
      "Citizenship debates and legal status",
      "Political representation and participation",
      "Relations with the Congolese government",
      "Diaspora political engagement and advocacy"
    ]
  },
  stories: {
    title: "Stories from the Community",
    description: "Every Banyamulenge person has a story to tell. This section features personal narratives, testimonies, and accounts from community members around the world. From elders sharing wisdom passed down through generations to young people navigating identity in the diaspora, these stories preserve the human experience of the Banyamulenge people.",
    highlights: [
      "Personal testimonies and life experiences",
      "Elder wisdom and generational knowledge",
      "Diaspora voices and identity journeys",
      "Stories of resilience, hope, and community"
    ]
  }
};
