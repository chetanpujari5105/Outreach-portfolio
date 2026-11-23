import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sampleRequests = sqliteTable("sample_requests", {
  id: text("id").primaryKey().notNull(),
  createdAt: integer("created_at").notNull(),
  business: text("business").notNull(),
  replyMethod: text("reply_method").notNull(),
  contact: text("contact").notNull(),
  brief: text("brief").notNull(),
  website: text("website").notNull(),
  industry: text("industry").notNull(),
  project: text("project").notNull(),
  solution: text("solution").notNull(),
  networkHash: text("network_hash").notNull(),
}, (table) => [
  index("sample_requests_created").on(table.createdAt),
  index("sample_requests_network_created").on(table.networkHash, table.createdAt),
  index("sample_requests_contact_created").on(table.contact, table.createdAt),
]);
