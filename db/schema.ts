// db/schema.ts
import { pgTable, text, uuid, boolean, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';


// === DEBATES TABLE ===
export const debates = pgTable('debates', {
  // Use UUID to match the SQL 'gen_random_uuid()'
  id: uuid('id').defaultRandom().primaryKey(),
  
  title: text('title').notNull(),
  
  // Maps to the SQL column 'category'
  category: text('category').notNull(), 
  
  // Maps to the SQL column 'summary'
  summary: text('summary').notNull(), 
  
  // 🟢 MERGED ARGUMENT COLUMNS
  proposerName: text('proposer_name').notNull(),
  proposerArguments: text('proposer_arguments').notNull(), // HTML text
  
  opposerName: text('opposer_name').notNull(),
  opposerArguments: text('opposer_arguments').notNull(),   // HTML text
  
  // Media & Metadata
  youtubeVideoId: text('youtube_video_id'),
  mainImageUrl: text('main_image_url'),
  
  // Maps to SQL 'is_published'
  isPublished: boolean('is_published').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  
  slug: text('slug').unique(),
});

// === COMMENTS TABLE (Updated for Replies & Likes) ===
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  
  // Foreign Key linking to debates table
  debateId: uuid('debate_id')
    .references(() => debates.id, { onDelete: 'cascade' }),

  // 🟢 NEW: Foreign Key linking to articles table
  articleId: uuid('article_id')
    .references(() => articles.id, { onDelete: 'cascade' }),
    
  // 🟢 NEW: Parent ID for nested replies (Self-referencing)
  parentId: uuid('parent_id'),
    
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  
  // 🟢 NEW: Likes count
  likes: integer('likes').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
  isApproved: boolean('is_approved').default(true), // Defaults to approved
});

// === ARTICLES TABLE ===
export const articles = pgTable('articles', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  videoUrl: text('video_url'),      // Maps to video_url column
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  coverImage: text('cover_image'),  // Maps to cover_image column
  isPublished: boolean('is_published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// === RELATIONSHIPS ===

// 1. A Debate can have MANY comments
export const debatesRelations = relations(debates, ({ many }) => ({
  comments: many(comments),
}));

// 2. An Article can have MANY comments
export const articlesRelations = relations(articles, ({ many }) => ({
  comments: many(comments),
}));

// 3. A Comment relations (Debate link + Self-referencing for replies)
export const commentsRelations = relations(comments, ({ one, many }) => ({
  // Link to the Debate
  debate: one(debates, {
    fields: [comments.debateId],
    references: [debates.id],
  }),
  
  // Link to the Article
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
  }),

  // 🟢 NEW: Link to Parent Comment (if this is a reply)
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'replies', // Named relation for self-referencing
  }),

  // 🟢 NEW: Link to Child Comments (Replies)
  replies: many(comments, {
    relationName: 'replies',
  }),
}));