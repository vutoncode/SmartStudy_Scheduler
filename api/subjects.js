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

  // Tạo client với context của user thông qua token
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return res.status(200).json(data);
    } 
    
    else if (req.method === 'POST') {
      const { name, color } = req.body;
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ user_id: user.id, name, color }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }
    
    else if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, name, color } = req.body;
      const { data, error } = await supabase
        .from('subjects')
        .update({ name, color })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }
    
    else if (req.method === 'DELETE') {
      const { id } = req.query; // hoặc req.body
      const subjectId = id || req.body.id;

      // Kiểm tra có task liên kết không
      const { count } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('subject_id', subjectId);

      if (count > 0) {
        return res.status(400).json({ error: 'Không thể xóa môn học đang có nhiệm vụ liên kết.' });
      }

      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
