-- Initialize gibbon_writer database
CREATE DATABASE IF NOT EXISTS gibbon_writer;

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'gibbon_user') THEN
        CREATE USER gibbon_user WITH PASSWORD 'gibbon_password';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gibbon_writer TO gibbon_user;

-- Switch to gibbon_writer database
\c gibbon_writer;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO gibbon_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO gibbon_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO gibbon_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO gibbon_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO gibbon_user;