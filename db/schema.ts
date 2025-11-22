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
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id').references(() => quizzes.id).notNull(),
    email: text('email'),
    name: text('name'),
    phone: text('phone'),
    metadata: jsonb('metadata'), // Any extra info
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

// Relations
export const quizzesRelations = relations(quizzes, ({ many }) => ({
    questions: many(questions),
    leads: many(leads),
    responses: many(responses),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
    quiz: one(quizzes, {
        fields: [questions.quizId],
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
