// @ts-ignore
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://aqejnvpfralzhubstpje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZWpudnBmcmFsemh1YnN0cGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTI4NjAsImV4cCI6MjA5MjY4ODg2MH0.bHag86Na5XXBXMmX5is5vpWadYWOyx-FrKKAb2_pcqs';

// Mock implementation if keys are missing to prevent crash
const mockSupabase = {
  channel: () => ({
    on: function() { return this; },
    subscribe: function() { return this; },
    track: () => {},
    send: () => {},
    unsubscribe: () => {},
  }),
};

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : mockSupabase;