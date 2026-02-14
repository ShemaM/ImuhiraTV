// db/schema.ts
import { pgTable, text, uuid, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// === DEBATES TABLE ===
export const debates = pgTable('debates', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(), 
  summary: text('summary').notNull(), 
  
  proposerName: text('proposer_name').notNull(),
  proposerArguments: text('proposer_arguments').notNull(),
  
  opposerName: text('opposer_name').notNull(),
  opposerArguments: text('opposer_arguments').notNull(),
  
  youtubeVideoId: text('youtube_video_id'),
  mainImageUrl: text('main_image_url'),
  
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  slug: text('slug').unique(),

  // Swahili (sw) translations
  titleSw: text('title_sw'),
  summarySw: text('summary_sw'),
  proposerArgumentsSw: text('proposer_arguments_sw'),
  opposerArgumentsSw: text('opposer_arguments_sw'),

  // French (fr) translations
  titleFr: text('title_fr'),
  summaryFr: text('summary_fr'),
  proposerArgumentsFr: text('proposer_arguments_fr'),
  opposerArgumentsFr: text('opposer_arguments_fr'),

  // Kinyamulenge (kym) translations
  titleKym: text('title_kym'),
  summaryKym: text('summary_kym'),
  proposerArgumentsKym: text('proposer_arguments_kym'),
  opposerArgumentsKym: text('opposer_arguments_kym'),
});

// === COMMENTS TABLE ===
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  debateId: uuid('debate_id')
    .references(() => debates.id, { onDelete: 'cascade' }),
  articleId: uuid('article_id')
    .references(() => articles.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  isApproved: boolean('is_approved').default(true),
});

// === ARTICLES TABLE (Updated for i18n) ===
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Base Fields (Standard English)
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  
  // Swahili (sw)
  titleSw: text('title_sw'),
  excerptSw: text('excerpt_sw'),
  contentSw: text('content_sw'),

  // French (fr)
  titleFr: text('title_fr'),
  excerptFr: text('excerpt_fr'),
  contentFr: text('content_fr'),

  // Kinyamulenge (kym) - Optimized for special alphabet/vowels
  titleKym: text('title_kym'),
  excerptKym: text('excerpt_kym'),
  contentKym: text('content_kym'),

  // Shared Media & Metadata
  videoUrl: text('video_url'),
  coverImage: text('cover_image'),
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === SUBSCRIBERS TABLE ===
export const subscribers = pgTable('subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// === RELATIONSHIPS ===

export const debatesRelations = relations(debates, ({ many }) => ({
  comments: many(comments),
}));

export const articlesRelations = relations(articles, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  debate: one(debates, {
    fields: [comments.debateId],
    references: [debates.id],
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'replies',
  }),
  replies: many(comments, {
    relationName: 'replies',
  }),
}));