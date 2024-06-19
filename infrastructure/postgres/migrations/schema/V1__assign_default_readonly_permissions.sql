ALTER ROLE dashboard_api_readonly WITH NOCREATEDB NOCREATEROLE NOINHERIT;

GRANT USAGE ON SCHEMA dashboard TO dashboard_api_readonly;

ALTER DEFAULT PRIVILEGES IN SCHEMA dashboard GRANT SELECT ON TABLES TO dashboard_api_readonly;

GRANT SELECT ON ALL TABLES IN SCHEMA dashboard TO dashboard_api_readonly;
