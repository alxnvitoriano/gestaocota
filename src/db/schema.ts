import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("usersTable", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
  usersToCompany: many(usersToCompanyTable),
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  activeCompanyId: uuid("active_company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const companyTable = pgTable("company", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  metadata: text("metadata"),
});

export type Company = typeof companyTable.$inferSelect;

export const usersToCompanyTable = pgTable("users_to_company", {
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const usersToCompanyRelation = relations(
  usersToCompanyTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [usersToCompanyTable.userId],
      references: [usersTable.id],
    }),
    company: one(companyTable, {
      fields: [usersToCompanyTable.companyId],
      references: [companyTable.id],
    }),
  }),
);

export const companyTableRelations = relations(
  companyTable,
  ({ many, one }) => ({
    members: many(member),
    generalManager: one(generalManagerTable),
    manager: one(managerTable),
    pickup: many(pickupTable),
    salesperson: many(salespersonTable),
    appointments: many(appointmentsTable),
    usersToCompany: many(usersToCompanyTable),
  }),
);

export const role = pgEnum("role", [
  "member",
  "salesperson",
  "pickup",
  "general_manager",
  "team_manager",
]);

export type Role = (typeof role.enumValues)[number];

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  role: role("role").default("salesperson").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const memberRelations = relations(member, ({ one }) => ({
  company: one(companyTable, {
    fields: [member.companyId],
    references: [companyTable.id],
  }),
  user: one(usersTable, {
    fields: [member.userId],
    references: [usersTable.id],
  }),
}));

export type Member = typeof member.$inferSelect & {
  user?: typeof usersTable.$inferSelect;
};

export type User = typeof usersTable.$inferSelect;

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => companyTable.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const salespersonTable = pgTable("salesperson", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  // Added relation to pickup (captador)
  pickupId: uuid("pickup_id").references(() => pickupTable.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  availableFromTime: text("available_from_time").default("08:00"),
  availableToTime: text("available_to_time").default("18:00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const salespersonRelations = relations(salespersonTable, ({ one }) => ({
  company: one(companyTable, {
    fields: [salespersonTable.companyId],
    references: [companyTable.id],
  }),
  // Relation to pickup (captador)
  pickup: one(pickupTable, {
    fields: [salespersonTable.pickupId],
    references: [pickupTable.id],
  }),
}));

export const generalManagerTable = pgTable("general_manager", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const generalManagerRelations = relations(
  generalManagerTable,
  ({ one }) => ({
    company: one(companyTable, {
      fields: [generalManagerTable.companyId],
      references: [companyTable.id],
    }),
  }),
);

export const managerTable = pgTable("team_manager", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const managerRelations = relations(managerTable, ({ one }) => ({
  company: one(companyTable, {
    fields: [managerTable.companyId],
    references: [companyTable.id],
  }),
}));

export const pickupTable = pgTable("pickup", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  avatarImageUrl: text("avatar_image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const pickupRelations = relations(pickupTable, ({ one }) => ({
  company: one(companyTable, {
    fields: [pickupTable.companyId],
    references: [companyTable.id],
  }),
  user: one(usersTable, {
    fields: [pickupTable.userId],
    references: [usersTable.id],
  }),
}));

export const clientsTable = pgTable("clients", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  pickupId: uuid("pickup_id").references(() => pickupTable.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  indication: text("indication"),
  annuncio: text("annuncio"),
  desire: text("desire"),
  entrance: integer("entrance_value"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const clientsRelations = relations(clientsTable, ({ one }) => ({
  company: one(companyTable, {
    fields: [clientsTable.companyId],
    references: [companyTable.id],
  }),
  pickup: one(pickupTable, {
    fields: [clientsTable.pickupId],
    references: [pickupTable.id],
  }),
}));

export const negociationsTable = pgTable("negociations", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  clientId: uuid("client_id").references(() => clientsTable.id, {
    onDelete: "cascade",
  }),
  salespersonId: uuid("salesperson_id").references(() => salespersonTable.id, {
    onDelete: "cascade",
  }),
  negociationStatus: text("negociation_status").default("pending").notNull(),
  negociationResult: text("negociation_result"),
  negociationValue: integer("negociation_value"),
  observation: text("observation"),
  credit: integer("credit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const negociationsRelations = relations(
  negociationsTable,
  ({ one }) => ({
    company: one(companyTable, {
      fields: [negociationsTable.companyId],
      references: [companyTable.id],
    }),
    client: one(clientsTable, {
      fields: [negociationsTable.clientId],
      references: [clientsTable.id],
    }),
    salesperson: one(salespersonTable, {
      fields: [negociationsTable.salespersonId],
      references: [salespersonTable.id],
    }),
  }),
);

export const appointmentsTable = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  companyId: uuid("company_id").references(() => companyTable.id, {
    onDelete: "cascade",
  }),
  date: timestamp("date").notNull(),
  clientId: uuid("client_id").references(() => clientsTable.id),
  salespersonId: uuid("salesperson_id").references(() => salespersonTable.id, {
    onDelete: "cascade",
  }),
  generalManagerId: uuid("general_manager_id").references(
    () => generalManagerTable.id,
    {
      onDelete: "cascade",
    },
  ),
  managerId: uuid("manager_id").references(() => managerTable.id, {
    onDelete: "cascade",
  }),
  pickupId: uuid("pickup_id").references(() => pickupTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const appointmentsRelations = relations(
  appointmentsTable,
  ({ one }) => ({
    company: one(companyTable, {
      fields: [appointmentsTable.companyId],
      references: [companyTable.id],
    }),
    client: one(clientsTable, {
      fields: [appointmentsTable.clientId],
      references: [clientsTable.id],
    }),
    salesperson: one(salespersonTable, {
      fields: [appointmentsTable.salespersonId],
      references: [salespersonTable.id],
    }),
  }),
);

export const schema = {
  usersTable,
  negociationsTable,
  negociationsRelations,
  sessionsTable,
  accountsTable,
  verificationsTable,
  member,
  invitation,
  companyTable,
  clientsTable,
  appointmentsTable,
  salespersonTable,
  generalManagerTable,
  managerTable,
  pickupTable,
  appointmentsRelations,
  salespersonRelations,
  generalManagerRelations,
  managerRelations,
  memberRelations,
  pickupRelations,
  // Added missing tables and relations for typed relational queries
  usersToCompanyTable,
  usersToCompanyRelation,
  companyTableRelations,
  clientsRelations,
};
