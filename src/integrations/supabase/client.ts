// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rxlibyidulzlhmuflqim.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4bGlieWlkdWx6bGhtdWZscWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDkyMDIsImV4cCI6MjA1OTQyNTIwMn0.ut6QvdfjoPG4zGzUTn-qMgOseg0tfXAVfxvuGLApIMg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);