import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../helpers/connection';
import { required, minLength, dataType } from '../helpers/utils';

dotenv.config();

const signupRules = {
  fullName: [
    [required],
    [minLength, 5],
    [dataType, 'string'],
  ],
  username: [
    [required],
    [minLength, 7],
    [dataType, 'string'],
  ],
  password: [
    [required],
    [minLength, 8],
    [dataType, 'string'],
  ],
  email: [
    [required],
    [dataType, 'email'],
  ],
};
const editRules = {
  fullName: [
    [required],
    [minLength, 5],
    [dataType, 'string'],
  ],
  email: [
    [required],
    [dataType, 'email'],
  ],
};
const passwordRules = {
  password: [
    [required],
  ],
  newPassword: [
    [required],
    [minLength, 8],
    [dataType, 'string'],
  ],
  confirmPassword: [
    [required],
  ],
};
const loginRules = {
  username: [
    [required],
  ],
  password: [
    [required],
  ],
};
const subscribeRules = {
  subscription: [
    [required],
    [dataType, 'object'],
  ],
};
const notificationRules = {
  status: [
    [dataType, 'boolean'],
  ],
};
export default class User {
  constructor({
    fullName,
    email,
    username,
    password,
  }) {
    this.fullName = fullName;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  static async remove(username) {
    const removeUser = await client.query(`DELETE FROM authentication WHERE username='${username}' RETURNING id, username`);
    return removeUser;
  }

  static async editProfile(user, { fullName, email }) {
    const edited = await client.query(`UPDATE users SET "fullName"='${fullName}', email='${email}' WHERE id=${user.id} RETURNING "fullName", email`);
    return edited.rows[0];
  }

  static async changePassword(user, { password, newPassword, confirmPassword }) {
    if (newPassword !== confirmPassword) throw new Error('passwords did not match');
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    const passwordQuery = await client.query(`SELECT password FROM authentication WHERE username='${user.username}';`);
    const isCorrectPassword = await bcrypt.compare(password, passwordQuery.rows[0].password);
    if (isCorrectPassword) {
      await client.query(`UPDATE authentication SET password='${hashedPassword}' WHERE username='${user.username}'`);
      return { text: 'password changed' };
    }
    throw new Error('incorrect password');
  }

  async save() {
    this.password = await bcrypt.hash(this.password, 5);
    const authQuery = 'INSERT INTO authentication(username, password) VALUES($1, $2) RETURNING id';
    const addUserQuery = 'INSERT INTO users("fullName", email, "authId") VALUES($1, $2, $3) RETURNING id';
    const addAuthentication = await client.query(authQuery, [this.username, this.password]);
    try {
      this.authId = addAuthentication.rows[0].id;
      const addUser = await client.query(addUserQuery, [this.fullName, this.email, this.authId]);
      this.id = addUser.rows[0].id;
      client.query('INSERT INTO "notificationStatus"("userId") VALUES($1)', [this.id]);
    } catch (error) {
      if (error.message === 'duplicate key value violates unique constraint "users_email_key"') {
        await User.remove(this.username);
        throw new Error('email has been chosen');
      }
      return error;
    }
    return this.strip();
  }

  async login() {
    const authQuery = `SELECT users.id, authentication.password, authentication.username, users."fullName", users.email, "notificationStatus".status as "notificationStatus" FROM authentication 
    INNER JOIN users ON users."authId" = authentication.id 
    INNER JOIN "notificationStatus" ON "notificationStatus"."userId" = users.id
    WHERE authentication.username = '${this.username}'`;
    const getUser = await client.query(authQuery);
    const user = getUser.rows[0];
    if (!user) throw new Error('invalid credentials');
    const isCorrectPassword = await bcrypt.compare(this.password, getUser.rows[0].password);
    if (isCorrectPassword) {
      this.fullName = user.fullName;
      this.email = user.email;
      this.id = user.id;
      this.notificationStatus = user.notificationStatus;
      this.token = await this.generateToken();
      return this.strip();
    }
    throw new Error('invalid credentials');
  }

  async generateToken() {
    return jwt.sign({
      exp: (Math.floor(Date.now() / 1000) + (60 * 60)) * 24 * 7,
      data: this.strip(),
    }, process.env.JWT_SECRET);
  }

  static async subscribe({ userId, subscription }) {
    const updateSubscription = await client.query(`update "notificationStatus" set subscription = (select array_agg(distinct e) from unnest(subscription || ARRAY['${subscription}']::jsonb[]) e) WHERE "userId"=${userId} RETURNING *;`);
    return updateSubscription;
  }

  static async setNotification({ userId, status }) {
    const updateNotification = await client.query(`UPDATE "notificationStatus" SET status=${status} WHERE "userId"=${userId} RETURNING status`);
    return updateNotification.rows[0];
  }

  strip() {
    const { password, authId, ...noPassword } = this;
    return noPassword;
  }
}

export {
  signupRules,
  loginRules,
  subscribeRules,
  notificationRules,
  editRules,
  passwordRules,
};
