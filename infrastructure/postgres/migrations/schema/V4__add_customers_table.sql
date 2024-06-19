CREATE TABLE IF NOT EXISTS dashboard.customers (
     id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     image_url VARCHAR(255) NOT NULL
);
