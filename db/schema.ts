
import { pgTable, serial, text, varchar, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});

// Enum for debate status
export const debateStatusEnum = pgEnum('debate_status', ['draft', 'published']);

// Enum for argument faction (Idubu = pro-Twirwaneho, Akagara = pro-government/FARDC)
export const factionEnum = pgEnum('faction', ['idubu', 'akagara']);

// Main debates table - stores the debate posts derived from YouTube interviews
export const debates = pgTable('debates', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  topic: text('topic').notNull(), // The main topic/question being debated
  summary: text('summary'), // Brief summary of the debate
  verdict: text('verdict').notNull(), // The judge's verdict/conclusion
  youtubeVideoId: varchar('youtube_video_id', { length: 50 }), // YouTube video ID for embedded interview
  youtubeVideoTitle: varchar('youtube_video_title', { length: 500 }), // Title of the YouTube interview
  mainImageUrl: text('main_image_url'), // Featured image URL
  authorName: varchar('author_name', { length: 255 }).default('Imuhira Staff'),
  status: debateStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  publishedAt: timestamp('published_at'),
});

// Arguments table - stores individual arguments from both factions
export const debateArguments = pgTable('debate_arguments', {
  id: serial('id').primaryKey(),
  debateId: integer('debate_id').references(() => debates.id, { onDelete: 'cascade' }).notNull(),
  faction: factionEnum('faction').notNull(), // 'idubu' or 'akagara'
  speakerName: varchar('speaker_name', { length: 255 }), // Name of the person making the argument (optional)
  argument: text('argument').notNull(), // The key point/argument made
  orderIndex: integer('order_index').default(0), // For ordering arguments within a faction
  createdAt: timestamp('created_at').defaultNow(),
});
        