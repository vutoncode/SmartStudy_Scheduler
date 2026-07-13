import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ugxqdtlbchojkxrlnkyv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVneHFkdGxiY2hvamt4cmxua3l2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mzk0MTMwMiwiZXhwIjoyMDk5NTE3MzAyfQ.2Eu2gykJ9IwkkFkv0BV8w0WZHqs69BVjX7fftRQpFA4'
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@gmail.com',
    password: '12345678',
    email_confirm: true
  });

  if (error) {
    console.error('Error creating user via Admin API:', error.message);
  } else {
    console.log('Success! Admin user created via Admin API:', data.user.email);
  }
}

createAdmin();
