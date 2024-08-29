import { createClient } from '@supabase/supabase-js';
import { configDotenv } from 'dotenv';

configDotenv({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_PROJECT_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseKey);
