const users = `
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  "fullName" VARCHAR(100) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  image TEXT DEFAULT NULL,
  "authId" SERIAL UNIQUE ,
  CONSTRAINT FK_Users_Authentication FOREIGN KEY ("authId") REFERENCES authentication(id)
  ON DELETE CASCADE
);`;

const authentication = `
CREATE TABLE IF NOT EXISTS authentication(
  id SERIAL PRIMARY KEY,
  username VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL
);`;

const entries = `
CREATE TABLE IF NOT EXISTS entries(
  id SERIAL PRIMARY KEY,
  "authorId" INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created timestamp (0) without time zone default now(),
  edited timestamp (0) without time zone default now(),
  CONSTRAINT FK_Entries_Users FOREIGN KEY ("authorId") REFERENCES users(id)
  ON DELETE CASCADE  
);`;

const notificationStatus = `
CREATE TABLE IF NOT EXISTS "notificationStatus"(
  id SERIAL PRIMARY KEY,
  "userId" INT UNIQUE,
  status BOOLEAN DEFAULT true,
  subscription JSONB[],
  CONSTRAINT FK_NotificationStatus_Users FOREIGN KEY ("userId") REFERENCES users(id)
  ON DELETE CASCADE
);`;

const dropTables = `
DROP TABLE IF EXISTS authentication cascade;
DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS entries cascade;
DROP TABLE IF EXISTS "notificationStatus" cascade;
`;
export default `${authentication}${users}${entries}${notificationStatus}`;
export { dropTables };
