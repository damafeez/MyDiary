const users = `
CREATE TABLE IF NOT EXISTS users(
  userId INT,
  fullName VARCHAR(60) NOT NULL,
  email TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES authentication(userId)
);`;

const authentication = `
CREATE TABLE IF NOT EXISTS authentication(
  userId SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password TEXT NOT NULL
);`;

const entries = `
CREATE TABLE IF NOT EXISTS entries(
  entryId SERIAL PRIMARY KEY,
  userId INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created timestamp (0) without time zone default now(),
  edited timestamp (0) without time zone default now(),
  FOREIGN KEY (userId) REFERENCES authentication(userId)
);`;

const notificationStatus = `
CREATE TABLE IF NOT EXISTS notificationStatus(
  userId INT,
  value BOOLEAN DEFAULT false,
  FOREIGN KEY (userId) REFERENCES authentication(userId)
);`;

export {
  users, authentication, entries, notificationStatus,
};
