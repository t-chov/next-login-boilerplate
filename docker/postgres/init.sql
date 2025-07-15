-- Initialize next_login_boilerplate database
CREATE DATABASE IF NOT EXISTS next_login_boilerplate;

-- Create user if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'next_login_user') THEN
        CREATE USER next_login_user WITH PASSWORD 'next_login_password';
    END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE next_login_boilerplate TO next_login_user;

-- Switch to next_login_boilerplate database
\c next_login_boilerplate;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO next_login_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO next_login_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO next_login_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO next_login_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO next_login_user;