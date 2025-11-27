import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role').notNull().default('user'),
  createdAt: text('created_at').notNull(),
});

export const bots = sqliteTable('bots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  domain: text('domain'),
  settings: text('settings', { mode: 'json' }).default('{}'),
  createdAt: text('created_at').notNull(),
});

export const botKnowledge = sqliteTable('bot_knowledge', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  sourceType: text('source_type'),
  sourceUrl: text('source_url'),
  content: text('content'),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
  createdAt: text('created_at').notNull(),
});

export const embeddings = sqliteTable('embeddings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  chunkId: text('chunk_id'),
  vector: text('vector'),
  sourceRef: text('source_ref'),
  textExcerpt: text('text_excerpt'),
  createdAt: text('created_at').notNull(),
});

export const flows = sqliteTable('flows', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  name: text('name').notNull(),
  nodes: text('nodes', { mode: 'json' }).notNull(),
  createdAt: text('created_at').notNull(),
});

export const conversations = sqliteTable('conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  userId: integer('user_id').references(() => users.id),
  sessionId: text('session_id'),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
  createdAt: text('created_at').notNull(),
});

export const messages = sqliteTable('messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversation_id').notNull().references(() => conversations.id),
  role: text('role').notNull(),
  text: text('text').notNull(),
  metadata: text('metadata', { mode: 'json' }).default('{}'),
  createdAt: text('created_at').notNull(),
});

export const integrations = sqliteTable('integrations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  type: text('type').notNull(),
  credentialsEncrypted: text('credentials_encrypted'),
  config: text('config', { mode: 'json' }).default('{}'),
  createdAt: text('created_at').notNull(),
});

export const usage = sqliteTable('usage', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  tokens: integer('tokens').default(0),
  cost: text('cost'),
  date: text('date'),
  createdAt: text('created_at').notNull(),
});

export const billing = sqliteTable('billing', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  botId: integer('bot_id').notNull().references(() => bots.id),
  stripeCustomerId: text('stripe_customer_id'),
  planId: text('plan_id'),
  seats: integer('seats').default(1),
  createdAt: text('created_at').notNull(),
});


// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});