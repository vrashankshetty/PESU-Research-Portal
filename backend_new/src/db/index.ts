import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import * as schema from './schema';

dotenv.config();

const onRemote = process.env.NODE_ENV !== 'development';

const sql = postgres(process.env.DB_URL as string);

const db = drizzle(sql, { schema });

migrate(db, { migrationsFolder: 'drizzle' });

export default db;
