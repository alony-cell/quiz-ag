import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function runMigration() {
    try {
        console.log('🔄 Running database migration...');

        const migrationPath = path.join(process.cwd(), 'drizzle', '0002_add_answers_layout.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Split by statement breakpoint and execute each statement
        const statements = migrationSQL
            .split('-->statement-breakpoint')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 50) + '...');
            await sql.query(statement);
        }

        console.log('✅ Migration completed successfully!');
    } catch (error: any) {
        if (error.message?.includes('already exists')) {
            console.log('✅ Tables already exist - migration not needed');
        } else {
            console.error('❌ Migration failed:', error.message);
            throw error;
        }
    }
}

runMigration();
