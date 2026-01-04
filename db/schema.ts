// db/schema.ts
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ... (Articles table stays the same) ...

export const debates = pgTable('debates', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  
  // Basic Info
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  topic: text('topic').notNull(),
  summary: text('summary'), // This will now hold HTML (Rich Text)
  
  // 🔴 REMOVED: verdict
  
  // 🟢 ADDED: Custom Faction Names (Defaults to your original ones)
  faction1Label: text('faction1_label').default('Idubu'), 
  faction2Label: text('faction2_label').default('Akagara'),

  youtubeVideoId: text('youtube_video_id'),
  youtubeVideoTitle: text('youtube_video_title'),
  mainImageUrl: text('main_image_url'),
  authorName: text('author_name').default('Imuhira Staff'),
  publishedAt: timestamp('published_at'),
  status: text('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const debatesRelations = relations(debates, ({ many }) => ({
  arguments: many(debateArguments),
}));

export const debateArguments = pgTable('debate_arguments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  debateId: integer('debate_id').references(() => debates.id),
  
  // 🟢 CHANGED: strictly 'faction1' or 'faction2'. The UI maps these to the labels above.
  faction: text('faction').notNull(), 
  
  speakerName: text('speaker_name'),
  argument: text('argument').notNull(),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const debateArgumentsRelations = relations(debateArguments, ({ one }) => ({
  debate: one(debates, {
    fields: [debateArguments.debateId],
    references: [debates.id],
  }),
}));