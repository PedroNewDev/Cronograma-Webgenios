import { pgTable, text, timestamp, boolean, integer, jsonb, uniqueIndex, index } from "drizzle-orm/pg-core";

/* ─────────────────────────────────────────────────────────
 * Better Auth core tables
 * Schema derivado de @better-auth/cli generate.
 * Mantenha sincronizado se atualizar plugins.
 * ───────────────────────────────────────────────────────── */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // Preferências (densidade, tema, fuso, etc.)
  preferences: jsonb("preferences").$type<UserPrefs>().default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type UserPrefs = {
  density?: "comfy" | "compact" | "dense";
  theme?: "dark" | "light" | "system";
  timezone?: string;
};

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  // organização ativa atual (Better Auth/organization plugin)
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/* ─────────────────────────────────────────────────────────
 * Organization plugin (= Workspace = WebGenios tenant)
 * ───────────────────────────────────────────────────────── */

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: jsonb("metadata").$type<OrgMetadata>().default({}).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrgMetadata = {
  // configurações de workspace: features ativas, branding, etc.
  aiEnabled?: boolean;
  brandColor?: string;
};

export const member = pgTable(
  "member",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    // Papéis WebGenios: admin | leader | member | reviewer | client
    role: text("role").notNull().default("member"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    uniqueMembership: uniqueIndex("member_org_user_idx").on(t.organizationId, t.userId),
  }),
);

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role").notNull().default("member"),
  status: text("status").notNull().default("pending"), // pending | accepted | rejected | canceled | expired
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

/* ─────────────────────────────────────────────────────────
 * Domain — esqueleto p/ próximas fases
 * (não usado ainda; deixado só como placeholder p/ Drizzle)
 * ───────────────────────────────────────────────────────── */

export const funnel = pgTable(
  "funnel",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#7C5CFF"),
    archived: boolean("archived").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    orgIdx: index("funnel_org_idx").on(t.organizationId),
  }),
);

export const task = pgTable(
  "task",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id").notNull().references(() => organization.id, { onDelete: "cascade" }),
    funnelId: text("funnel_id").notNull().references(() => funnel.id, { onDelete: "cascade" }),
    code: text("code").notNull(), // WG-247
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").notNull().default("backlog"),
    priority: text("priority").notNull().default("media"), // baixa|media|alta|urgente
    assigneeId: text("assignee_id").references(() => user.id, { onDelete: "set null" }),
    reviewerId: text("reviewer_id").references(() => user.id, { onDelete: "set null" }),
    dueAt: timestamp("due_at"),
    estimateMinutes: integer("estimate_minutes"),
    spentMinutes: integer("spent_minutes").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    orgFunnelIdx: index("task_org_funnel_idx").on(t.organizationId, t.funnelId),
    codeIdx: uniqueIndex("task_org_code_idx").on(t.organizationId, t.code),
  }),
);
