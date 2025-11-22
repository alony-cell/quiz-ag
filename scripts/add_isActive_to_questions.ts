// scripts/add_isActive_to_questions.ts
import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function addColumn() {
    try {
        console.log('🔧 Adding is_active column to questions table if missing...');
        await sql.query(`
      ALTER TABLE "questions"
      ADD COLUMN IF NOT EXISTS "is_active" boolean DEFAULT true NOT NULL;
    `);
        console.log('✅ Column added or already exists.');
    } catch (error: any) {
        console.error('❌ Failed to add column:', error.message);
        process.exit(1);
    }
}

addColumn();
