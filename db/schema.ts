import { pgTable, serial, text, timestamp, boolean, jsonb, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const quizzes = pgTable('quizzes', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    design: jsonb('design'), // Store design config as JSON
    settings: jsonb('settings'), // Store quiz settings (lead capture, etc.)
});

export const questions = pgTable('questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    text: text('text').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    type: text('type').notNull(), // 'multiple_choice', 'text', etc.
    order: integer('order').notNull(),
    options: jsonb('options'), // Store options as JSON array
    structure: jsonb('structure'), // Store layout structure as JSON
    isRequired: boolean('is_required').default(true),
    allowBack: boolean('allow_back').default(false),
    isActive: boolean('is_active').default(true).notNull(),
    buttonText: text('button_text'),
    logic: jsonb('logic'), // Store conditional logic
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const thankYouPages = pgTable('thank_you_pages', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    title: text('title').notNull(),
    content: text('content'),
    buttonText: text('button_text'),
    buttonUrl: text('button_url'),
    scoreRangeMin: integer('score_range_min'),
    scoreRangeMax: integer('score_range_max'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    email: text('email'),
    name: text('name'),
    phone: text('phone'),
    country: text('country'), // Country code (e.g., US, GB)
    metadata: jsonb('metadata'), // Any extra info
    hiddenData: jsonb('hidden_data'), // UTMs, IP, etc.
    score: integer('score'),
    outcome: text('outcome'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const responses = pgTable('responses', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    leadId: uuid('lead_id').references(() => leads.id), // Optional, link to lead if known
    answers: jsonb('answers').notNull(), // Store all answers as JSON { questionId: answer }
    completedAt: timestamp('completed_at').defaultNow().notNull(),
    timeTaken: integer('time_taken'), // In seconds
});

export const quizInteractions = pgTable('quiz_interactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    sessionId: text('session_id').notNull(),
    type: text('type').notNull(), // 'view', 'start', 'answer', 'complete'
    metadata: jsonb('metadata'), // questionId, answer, etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const abTests = pgTable('ab_tests', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    status: text('status').default('draft').notNull(), // 'draft', 'active', 'stopped'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const abTestVariants = pgTable('ab_test_variants', {
    id: uuid('id').defaultRandom().primaryKey(),
    testId: uuid('test_id').references(() => abTests.id).notNull(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    trafficPercentage: integer('traffic_percentage').notNull(), // 0-100
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const integrations = pgTable('integrations', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    type: text('type').notNull(), // 'hubspot', 'facebook_pixel'
    config: jsonb('config').notNull(), // apiKey, pixelId, mapping, etc.
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const quizzesRelations = relations(quizzes, ({ many }) => ({
    questions: many(questions),
    leads: many(leads),
    responses: many(responses),
    thankYouPages: many(thankYouPages),
    abTestVariants: many(abTestVariants),
    integrations: many(integrations),
}));

export const abTestsRelations = relations(abTests, ({ many }) => ({
    variants: many(abTestVariants),
}));

export const abTestVariantsRelations = relations(abTestVariants, ({ one }) => ({
    test: one(abTests, {
        fields: [abTestVariants.testId],
        references: [abTests.id],
    }),
    quiz: one(quizzes, {
        fields: [abTestVariants.quizId],
        references: [quizzes.id],
    }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [questions.quizId],
        references: [quizzes.id],
    }),
}));

export const thankYouPagesRelations = relations(thankYouPages, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [thankYouPages.quizId],
        references: [quizzes.id],
    }),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
    quiz: one(quizzes, {
        fields: [leads.quizId],
        references: [quizzes.id],
    }),
    responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [responses.quizId],
        references: [quizzes.id],
    }),
    lead: one(leads, {
        fields: [responses.leadId],
        references: [leads.id],
    }),
}));
