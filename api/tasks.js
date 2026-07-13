import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    if (req.method === 'GET') {
      let query = supabase.from('tasks').select('*, subjects(name, color)').order('deadline', { ascending: true });
      
      if (req.query.subject_id) {
        query = query.eq('subject_id', req.query.subject_id);
      }
      if (req.query.status) {
        query = query.eq('status', req.query.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    } 
    
    else if (req.method === 'POST') {
      const { title, description, subject_id, deadline, priority, status } = req.body;
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          user_id: user.id, 
          title, 
          description, 
          subject_id, 
          deadline, 
          priority: priority || 'medium', 
          status: status || 'todo' 
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }
    
    else if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }
    
    else if (req.method === 'DELETE') {
      const id = req.query.id || req.body.id;
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
