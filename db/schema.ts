// db/schema.ts
import { pgTable, text, uuid, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// === DEBATES TABLE ===
// Note: Translation columns (title_sw, title_fr, title_kym, etc.) are defined 
// in add-translation-columns.sql. Run that migration to enable i18n support.
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

// === ARTICLES TABLE ===
// Note: Translation columns (title_sw, title_fr, title_kym, etc.) are defined 
// in add-translation-columns.sql. Run that migration to enable i18n support.
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Base Fields (Standard English)
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),

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