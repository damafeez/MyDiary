const users = `
DROP TABLE IF EXISTS users cascade;
CREATE TABLE users(
  userId SERIAL PRIMARY KEY,
  fullName VARCHAR(60) NOT NULL,
  email VARCHAR(40) NOT NULL 
);`;

const authentication = `
DROP TABLE IF EXISTS authentication cascade;
CREATE TABLE authentication(
  userId INT,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(40) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

const entries = `
DROP TABLE IF EXISTS entries cascade;
CREATE TABLE entries(
  entryId SERIAL PRIMARY KEY,
  userId INT,
  title VARCHAR(40) NOT NULL,
  body TEXT NOT NULL,
  created timestamp (0) without time zone default now(),
  edited timestamp (0) without time zone default now(),
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

const notificationStatus = `
DROP TABLE IF EXISTS notificationStatus cascade;
CREATE TABLE notificationStatus(
  userId INT,
  value BOOLEAN DEFAULT false,
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

export {
  users, authentication, entries, notificationStatus,
};
