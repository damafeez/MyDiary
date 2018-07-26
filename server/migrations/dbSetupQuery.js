const users = `
CREATE TABLE IF NOT EXISTS users(
  userId SERIAL PRIMARY KEY,
  fullName VARCHAR(60) NOT NULL,
  email TEXT NOT NULL 
);`;

const authentication = `
CREATE TABLE IF NOT EXISTS authentication(
  userId INT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

const entries = `
CREATE TABLE IF NOT EXISTS entries(
  entryId SERIAL PRIMARY KEY,
  userId INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created timestamp (0) without time zone default now(),
  edited timestamp (0) without time zone default now(),
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

const notificationStatus = `
CREATE TABLE IF NOT EXISTS notificationStatus(
  userId INT,
  value BOOLEAN DEFAULT false,
  FOREIGN KEY (userId) REFERENCES users(userId)
);`;

export {
  users, authentication, entries, notificationStatus,
};
