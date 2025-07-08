CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    objectives JSONB,
    target_audience TEXT,
    prerequisites JSONB,
    duration INTEGER NOT NULL,
    max_students INTEGER NOT NULL,
    min_students INTEGER NOT NULL,
    course_type VARCHAR(50) NOT NULL CHECK (course_type IN ('employee_training', 'job_seeker_training', 'general')),
    status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'published', 'archived')),
    category VARCHAR(100),
    tags JSONB,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_course_type ON courses(course_type);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_created_by ON courses(created_by);

CREATE TABLE IF NOT EXISTS course_sessions (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    session_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    instructor_id UUID NOT NULL,
    max_students INTEGER NOT NULL,
    current_students INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_sessions_course_id ON course_sessions(course_id);
CREATE INDEX idx_course_sessions_instructor_id ON course_sessions(instructor_id);
CREATE INDEX idx_course_sessions_status ON course_sessions(status);

CREATE TABLE IF NOT EXISTS course_modules (
    id UUID PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    materials JSONB,
    learning_objectives JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_order ON course_modules(course_id, order_index);