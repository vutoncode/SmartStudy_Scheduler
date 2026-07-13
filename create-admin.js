import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qpkfajmgarvyypiedwpi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwa2Zham1nYXJ2eXlwaWVkd3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mzk2NDIsImV4cCI6MjA5OTUxNTY0Mn0.w8ZfbagLtC0RJFoCLl45eng5bYc9bOB8i0q7e6VpxgE'
);

async function createAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'vu.admin@gmail.com',
    password: '12345678',
  });

  if (error) {
    console.error('Error creating user:', error.message);
  } else {
    console.log('Success! Admin user created.');
  }
}

createAdmin();
