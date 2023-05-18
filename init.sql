SELECT *
FROM pg_catalog.pg_tables
SELECT datname
FROM pg_database
WHERE datname = 'pets'
SELECT *
FROM "User"
ALTER TABLE clink
  RENAME TO clinic;
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'User';
SELECT *
FROM "user";
SELECT *
FROM pet;
SELECT p.*,
  u.name as user_name,
  u.image_url as user_image,
  'pet' as table_name
from "pet" as p
  JOIN "user" as u ON p.user_id = u.id;
SELECT s.*,
  u.name as user_name,
  u.image_url as user_image
from "solid" as s
  JOIN "user" as u ON s.user_id = u.id;
DROP TABLE comment;
CREATE TABLE IF NOT EXISTS comment (
  id SERIAL PRIMARY KEY,
  text TEXT not null,
  create_at TIMESTAMP not null DEFAULT NOW(),
  user_id INTEGER NOT NULL REFERENCES "user"(id),
  pet_id INTEGER NOT NULL REFERENCES pet(id)
);
SELECT *
from comment