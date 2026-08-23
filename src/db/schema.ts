import { pgTable, uuid, varchar, date, timestamp, boolean, index, jsonb, integer, text } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    gender: varchar("gender", { length: 20 }),
    dateOfBirth: date("date_of_birth"),
    phone: varchar("phone", { length: 20 }),
    socialHandle: varchar("social_handle", { length: 255 }),
    role: varchar("role", { length: 20 }).default("user").notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    
    // Advanced Security Tracking
    ipAddress: varchar("ip_address", { length: 45 }),
    country: varchar("country", { length: 100 }),
    deviceFingerprint: varchar("device_fingerprint", { length: 255 }),
    termsAccepted: boolean("terms_accepted").default(false).notNull(),

    lastLogin: timestamp("last_login"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: index("username_idx").on(table.username),
    deviceFingerprintIdx: index("device_fingerprint_idx").on(table.deviceFingerprint),
    statusIdx: index("status_idx").on(table.status),
  })
);

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender", { length: 50 }).default("PREFER_NOT_TO_SAY").notNull(),
    state: varchar("state", { length: 100 }),
    subject: varchar("subject", { length: 100 }).notNull(),
    message: varchar("message", { length: 5000 }).notNull(),
    socialHandles: jsonb("social_handles"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    contactEmailIdx: index("contact_email_idx").on(table.email),
    contactSubjectIdx: index("contact_subject_idx").on(table.subject),
    contactCreatedAtIdx: index("contact_created_at_idx").on(table.createdAt),
  })
);

export const admins = pgTable(
  "admins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 }).default("admin").notNull(),
    status: varchar("status", { length: 20 }).default("active").notNull(),
    
    // Security tracking
    loginAttempts: integer("login_attempts").default(0).notNull(),
    lockoutUntil: timestamp("lockout_until"),
    lastLoginIp: varchar("last_login_ip", { length: 45 }),
    
    // Audit timestamps
    lastLoginAt: timestamp("last_login_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    adminEmailIdx: index("admin_email_idx").on(table.email),
    adminUsernameIdx: index("admin_username_idx").on(table.username),
    adminStatusIdx: index("admin_status_idx").on(table.status),
  })
);

export const visits = pgTable(
  "visits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    userAgent: varchar("user_agent", { length: 512 }),
    path: varchar("path", { length: 255 }).notNull(),
    referer: varchar("referer", { length: 512 }),
    country: varchar("country", { length: 100 }),
    state: varchar("state", { length: 100 }),
    // Device telemetry
    deviceType: varchar("device_type", { length: 50 }),        // "mobile" | "tablet" | "desktop"
    deviceBrand: varchar("device_brand", { length: 100 }),      // e.g. "Samsung"
    deviceModel: varchar("device_model", { length: 150 }),      // e.g. "Galaxy S22"
    visitorId: varchar("visitor_id", { length: 64 }),           // Persistent UUID for visitor
    os: varchar("os", { length: 100 }),                         // e.g. "Windows 11"
    browser: varchar("browser", { length: 100 }),               // e.g. "Chrome 125"
    screenResolution: varchar("screen_resolution", { length: 30 }), // e.g. "1920x1080"
    cpuCores: integer("cpu_cores"),                             // navigator.hardwareConcurrency
    language: varchar("language", { length: 20 }),              // navigator.language
    sessionId: varchar("session_id", { length: 64 }),           // per-session UUID
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    visitIpIdx: index("visit_ip_idx").on(table.ipAddress),
    visitPathIdx: index("visit_path_idx").on(table.path),
    visitCreatedAtIdx: index("visit_created_at_idx").on(table.createdAt),
    visitSessionIdx: index("visit_session_idx").on(table.sessionId),
    visitDeviceIdx: index("visit_device_idx").on(table.deviceType),
    visitVisitorIdx: index("visit_visitor_idx").on(table.visitorId),
  })
);


export const loginAttempts = pgTable(
  "login_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    username: varchar("username", { length: 50 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    country: varchar("country", { length: 100 }),
    state: varchar("state", { length: 100 }),
    city: varchar("city", { length: 100 }),
    deviceFingerprint: varchar("device_fingerprint", { length: 255 }),
    userAgent: varchar("user_agent", { length: 512 }),
    status: varchar("status", { length: 20 }).notNull(), // 'success' or 'failed'
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("login_attempt_user_id_idx").on(table.userId),
    createdAtIdx: index("login_attempt_created_at_idx").on(table.createdAt),
  })
);

export const authors = pgTable(
  "authors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    dateOfBirth: date("date_of_birth"),
    bio: varchar("bio", { length: 1000 }),
    avatar: varchar("avatar", { length: 255 }),
    socialLinks: jsonb("social_links").$type<{
      twitter?: string;
      instagram?: string;
      youtube?: string;
      linkedin?: string;
      github?: string;
      discord?: string;
      website?: string;
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    authorNameIdx: index("author_name_idx").on(table.name),
  })
);

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 500 }).notNull(),
    category: varchar("category", { length: 100 }).notNull().default("Architecture"),
    tag: varchar("tag", { length: 100 }),
    date: varchar("date", { length: 50 }),        // Display date e.g. "Jun 2026"
    readTime: varchar("read_time", { length: 50 }),
    excerpt: text("excerpt"),
    body: text("body"),
    author: varchar("author", { length: 200 }),
    thumbnailUrl: varchar("thumbnail_url", { length: 500 }), // /uploads/thumbnails/xxx.webp
    coverName: varchar("cover_name", { length: 100 }).default("CoverIntrolicDWaves"),
    // Contributors
    showContributors: boolean("show_contributors").default(false).notNull(),
    contributors: jsonb("contributors").$type<
      { name: string; role?: string }[]
    >(),
    // Status
    status: varchar("status", { length: 20 }).default("published").notNull(), // published | draft
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    blogSlugIdx: index("blog_slug_idx").on(table.slug),
    blogCategoryIdx: index("blog_category_idx").on(table.category),
    blogAuthorIdx: index("blog_author_idx").on(table.author),
    blogStatusIdx: index("blog_status_idx").on(table.status),
    blogCreatedAtIdx: index("blog_created_at_idx").on(table.createdAt),
  })
);

// ─── Research Papers ──────────────────────────────────────────────────────────

export const researchPapers = pgTable(
  "research_papers",
  {
    id: varchar("id", { length: 50 }).primaryKey(),             // e.g. "DOC-7201"
    title: varchar("title", { length: 500 }).notNull(),
    type: varchar("type", { length: 50 }).notNull().default("Publication"), // Publication | Conclusion | Milestone | Release
    author: varchar("author", { length: 200 }),
    date: varchar("date", { length: 50 }),                      // Display date e.g. "JUN 2026"
    abstract: text("abstract"),
    fullText: text("full_text"),
    // Research-specific metadata
    keywords: jsonb("keywords").$type<string[]>(),              // ["Neural ODE", "VRAM"]
    doi: varchar("doi", { length: 500 }),                       // e.g. "10.1234/xyz"
    institution: varchar("institution", { length: 300 }),       // e.g. "Introlic Research Lab"
    externalUrl: varchar("external_url", { length: 500 }),
    // Contributors
    showContributors: boolean("show_contributors").default(false).notNull(),
    contributors: jsonb("contributors").$type<
      { name: string; role?: string }[]
    >(),
    // Status
    status: varchar("status", { length: 20 }).default("published").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    researchTypeIdx: index("research_type_idx").on(table.type),
    researchAuthorIdx: index("research_author_idx").on(table.author),
    researchStatusIdx: index("research_status_idx").on(table.status),
    researchCreatedAtIdx: index("research_created_at_idx").on(table.createdAt),
  })
);

export const blogCategories = pgTable(
  "blog_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    type: varchar("type", { length: 50 }).notNull().default("blog"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    categoryNameIdx: index("category_name_idx").on(table.name),
    categorySlugIdx: index("category_slug_idx").on(table.slug),
  })
);

export const projects = pgTable(
  "projects",
  {
    id: varchar("id", { length: 50 }).primaryKey(),
    title: varchar("title", { length: 500 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    author: varchar("author", { length: 200 }).notNull(),
    authorRole: varchar("author_role", { length: 200 }),
    status: varchar("status", { length: 50 }).notNull().default("Active"),
    started: varchar("started", { length: 50 }),
    openTo: varchar("open_to", { length: 500 }),
    tags: jsonb("tags").$type<string[]>(),
    topic: text("topic"),
    why: text("why"),
    factors: jsonb("factors").$type<string[]>(),
    readme: text("readme"),
    githubUrl: varchar("github_url", { length: 500 }),
    demoUrl: varchar("demo_url", { length: 500 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    projectTitleIdx: index("project_title_idx").on(table.title),
    projectCategoryIdx: index("project_category_idx").on(table.category),
    projectAuthorIdx: index("project_author_idx").on(table.author),
  })
);

