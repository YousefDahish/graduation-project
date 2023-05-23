exports.queryList = {
  // pets
  GET_PET_LIST_QUERY: `SELECT * FROM pet`,
  SAVE_PET_QUERY:
    "INSERT INTO pet(type, user_id, gender, country, city, description, Status,image_url)VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *;",
  UPDATE_PET_QUERY:
    "UPDATE pet SET  type=$1, user_id =$2, gender=$3, country=$4, city=$5, description=$6, status=$7,image_url = $8 WHERE id= $9 RETURNING * ;",
  DELETE_PET_QUERY: "DELETE FROM pet WHERE  id=$1 ",
  // solid
  GET_SOLID_LIST_QUERY: "SELECT * FROM solid",
  SAVE_SOLID_QUERY:
    "INSERT INTO public.solid(name,type, price,country,city,description,image_url,user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)RETURNING *;",
  UPDATE_SOLID_QUERY:
    "UPDATE public.solid SET name=$1, type=$2, price=$3, country=$4, city=$5, description=$6 ,image_url = $7,user_id= $8 WHERE id=$9 RETURNING *",
  DELETE_SOLID_QUERY: "DELETE FROM public.solid WHERE id=$1",
  // clinic
  GET_CLINIC_LIST_QUERY: "SELECT * FROM clinic;",
  SAVE_CLINIC_QUERY:
    "INSERT INTO public.clinic(name,phone,country,city,rating) VALUES ($1, $2, $3, $4, $5) RETURNING * ;",
  UPDATE_CLINIC_QUERY:
    "UPDATE public.clinic SET  name=$1,phone=$2,country=$3,city=$4,rating=$5 WHERE id =$6 RETURNING *;",
  DELETE_CLINIC_QUERY: "DELETE FROM public.clinic WHERE id=$1;",
  // user
  GET_USER_QUERY: `SELECT * FROM "user";`,
  SAVE_USER_QUERY:
    'INSERT INTO "user"(name,email,password,password_confirm,country,city,phone,image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id,name,email,city,phone,password;',
  UPDATE_USER_QUERY:
    'UPDATE "user" SET  name=$1, phone=$2,image_url=$3,email=$4, country=$5, city=$6 WHERE id=$7 RETURNING name,phone;',
  UPDATE_USER_PASSWORD_RESET_CODE: `UPDATE "user" SET  password_reset_code=$1, password_reset_expire=$2 WHERE id=$3 RETURNING * ;`,
  UPDATE_USER_PASSWORD_QUERY: `UPDATE "user" SET  password=$1, password_confirm=$2 WHERE id=$3 RETURNING * ;`,
  UPDATE_USER_ROLE_QUERY: `update "user" set role = $1 where id = $2 returning * ;`,
  INSERT_ADMIN_QUERY:
    'INSERT INTO "user"(name,email,password,password_confirm,country,city,phone,image_url,role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *;',
  getPetJoinUser: `SELECT p.*,
    u.name as user_name,
    u.image_url as user_image,
    'pet' as table_name
    from "pet" as p
    JOIN "user" as u ON p.user_id = u.id
    ORDER BY random();`,
  getSolidJoinUser: `SELECT s.*,
    u.name as user_name,
    u.image_url as user_image,
    'solid' as table_name
    from "solid" as s
    JOIN "user" as u ON s.user_id = u.id
    ORDER BY random();`,

  SAVE_RATING_QUERY:
    "INSERT INTO rating (score,clinic_id,user_id ) VALUES ($1,$2,$3) returning *",
  UPDATE_RATING_QUERY: "UPDATE rating SET score=$1 WHERE id=$2 returning *",

  //comment
  SAVE_COMMENT_QUERY:
    "INSERT INTO comment (text,pet_id,user_id) VALUES ($1,$2,$3) returning * ;",
  UPDATE_COMMENT_QUERY: "UPDATE comment SET text=$1 WHERE id=$2 returning * ;",
}
exports.DDLQuery = {
  CREATE_pet_type: "CREATE TYPE pet_type AS ENUM ('dog', 'cat','fish','bird' 'other');",
  CREATE_gender_type: "CREATE TYPE gender_type AS ENUM ('male', 'female');  ",
  CREATE_role_type: "CREATE TYPE role_type AS ENUM ('user', 'admin');  ",
  CREATE_solid_type:
    "CREATE TYPE solid_type AS ENUM ('food', 'accessories');  ",
  CREATE_status_type:
    "CREATE TYPE status_type AS ENUM ('sale', 'adopt', 'lost', 'found');  ",
  SELECT_DB: "SELECT datname FROM pg_database WHERE datname = $1",
  CREATE_DB: "CREATE DATABASE pets_db",
  CREATE_USER_TABLE: `CREATE TABLE IF NOT EXISTS "user" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_confirm VARCHAR(255) ,
  country VARCHAR(255) ,
  city VARCHAR(255) ,
  phone VARCHAR(255) ,
  image_url VARCHAR(255),
  role role_type DEFAULT 'user',
  password_reset_code VARCHAR(255),
  password_reset_expire timestamp without time zone
  );`,
  CREATE_PETS_TABLE: `CREATE TABLE IF NOT EXISTS pet (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  type pet_type NOT NULL,
  gender gender_type NOT NULL,
  country VARCHAR(255) ,
  city VARCHAR(255) ,
 price INTEGER DEFAULT 0,
  description TEXT ,
  image_url VARCHAR(255) ,
  status status_type NOT NULL,
  "like" INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES "user"(id),
date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  CREATE_SOLID_TABLE: `CREATE TABLE IF NOT EXISTS solid (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type solid_type NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  country VARCHAR(255) ,
  city VARCHAR(255) ,
  description TEXT ,
  image_url VARCHAR(255) ,
  "like" INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES "user"(id),
date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`,
  CREATE_CLINKS_TABLE: `CREATE TABLE IF NOT EXISTS clinic (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) ,
  phone VARCHAR(255) ,
  country VARCHAR(255) ,
  city VARCHAR(255) ,
  rating INTEGER 
);
`,
  CREATE_User_Pet_TABLE: `CREATE TABLE IF NOT EXISTS User_Pet_favorite (
  user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pet(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, pet_id)
);`,
  CREATE_User_Solid_TABLE: `CREATE TABLE IF NOT EXISTS User_Solid_favorite (
    user_id INTEGER REFERENCES "user"(id) ON DELETE CASCADE,
    Solid_ID INTEGER REFERENCES Solid(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, Solid_ID)
);
`,
  CREATE_COMMENTS_TABLE: `CREATE TABLE IF NOT EXISTS comment (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL ,
    create_at TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INTEGER REFERENCES "user"(id) NOT NULL ,
    pet_id INTEGER REFERENCES pet(id) NOT NULL 
  );`,
  CREATE_CHAT_TABLE: `CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES "user"(id) NOT NULL,
  receiver_id INTEGER REFERENCES "user"(id) NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`,
  CREATE_RATING_TABLE: `CREATE TABLE IF NOT EXISTS rating (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id) NOT NULL ,
    clinic_id INTEGER REFERENCES clinic(id) NOT NULL ,
    score INTEGER NOT NULL
  );`,
}
exports.selectAllQuery = (table) => `Select * from "${table}"`

exports.selectOneQuery = (table, id) =>
  `Select * FROM "${table}" WHERE id = ${id}`

exports.selectAllWhereQuery = (table, where) =>
  `Select * from "${table}" where ${where}`
exports.deleteOneQuery = (table, id) =>
  `DELETE FROM "${table}" WHERE id = ${id}`

exports.deleteWhereQuery = (table, where) =>
  `DELETE FROM "${table}" WHERE ${where}`

exports.insertQuery = (table, fields, values) =>
  `INSERT INTO "${table}" (${fields}) VALUES (${values}) returning * ;`

exports.updateOneWhereId = (table, updatedObj, id) =>
  `UPDATE "${table}" SET ${Object.entries(updatedObj)
    .map(([key, value]) => `${key}='${value}'`)
    .join(", ")} WHERE id=${id} returning * ;`
