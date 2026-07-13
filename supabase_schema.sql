-- Bật extension uuid-ossp (nếu chưa bật) để hỗ trợ gen UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tạo các custom enum types cho Task (mức độ ưu tiên và trạng thái)
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

-- ==========================================
-- BẢNG: subjects (Môn học)
-- Chức năng: Lưu trữ danh sách các môn học do người dùng tạo.
-- ==========================================
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) DEFAULT '#000000',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Bật Row Level Security cho bảng subjects
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể thao tác (CRUD) trên dữ liệu của chính mình
CREATE POLICY "Users can view their own subjects" ON subjects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subjects" ON subjects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subjects" ON subjects FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own subjects" ON subjects FOR DELETE USING (auth.uid() = user_id);

-- Index cho subjects để tăng tốc độ truy vấn khi lấy danh sách theo user_id
CREATE INDEX idx_subjects_user_id ON subjects(user_id);


-- ==========================================
-- BẢNG: tasks (Nhiệm vụ học tập)
-- Chức năng: Lưu trữ các bài tập/công việc, có liên kết với môn học.
-- ==========================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL, -- Nếu xóa môn học, subject_id của task set về NULL
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    priority task_priority DEFAULT 'medium',
    status task_status DEFAULT 'todo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Bật Row Level Security cho bảng tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: User chỉ có thể thao tác (CRUD) trên task của chính mình
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Indexes cho tasks để tăng tốc độ truy vấn với các trường hay dùng filter
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_subject_id ON tasks(subject_id);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_status ON tasks(status);

-- ==========================================
-- TỰ ĐỘNG CẬP NHẬT TRƯỜNG `updated_at`
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = timezone('utc', now());
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
