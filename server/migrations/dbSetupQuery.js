const users = `
CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  "fullName" VARCHAR(100) NOT NULL,
  email TEXT NOT NULL,
  "authId" INT,
  CONSTRAINT FK_Users_Authentication FOREIGN KEY ("authId") REFERENCES authentication(id)
);`;

const authentication = `
CREATE TABLE IF NOT EXISTS authentication(
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password TEXT NOT NULL
);`;

const entries = `
CREATE TABLE IF NOT EXISTS entries(
  id SERIAL PRIMARY KEY,
  "userId" INT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created timestamp (0) without time zone default now(),
  edited timestamp (0) without time zone default now(),
  CONSTRAINT FK_Entries_Users FOREIGN KEY ("userId") REFERENCES users(id)
  
);`;

const notificationStatus = `
CREATE TABLE IF NOT EXISTS notificationStatus(
  id SERIAL PRIMARY KEY,
  "userId" INT,
  value BOOLEAN DEFAULT false,
  CONSTRAINT FK_NotificationStatus_Users FOREIGN KEY ("userId") REFERENCES authentication(id)
  
);`;

export default `${authentication}${users}${entries}${notificationStatus}`;
