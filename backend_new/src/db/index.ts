import dotenv from 'dotenv';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from './schema';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const onRemote = process.env.NODE_ENV !== 'development';
console.log("path to .env:", path.resolve(__dirname, '../../.env'));
console.log('onRemote:', process.env.DB_URL);
const sql = postgres(process.env.DB_URL as string);

const db = drizzle(sql, { schema });

migrate(db, { migrationsFolder: 'drizzle' });

export default db;
