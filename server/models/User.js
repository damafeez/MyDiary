import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../helpers/connection';
import {
  required, minLength, dataType, imageUploader,
} from '../helpers/utils';

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
    this.email = email ? email.toLowerCase() : email;
    this.username = username ? username.toLowerCase() : username;
    this.password = password;
  }

  static async remove(username) {
    const removeUser = await client.query(`DELETE FROM authentication WHERE username='${username}' RETURNING id, username`);
    return removeUser;
  }

  static async editProfile(user, { fullName, email }) {
    try {
      const edited = await client.query(`UPDATE users SET "fullName"='${fullName}', email='${email.toLowerCase()}' WHERE id=${user.id} RETURNING "fullName", email`);
      return edited.rows[0];
    } catch (error) {
      if (error.message === 'duplicate key value violates unique constraint "users_email_key"') {
        error.message = 'email has been chosen, please choose another email';
      }
      throw error;
    }
  }

  static async editProfileImage(user, image) {
    try {
      const url = await imageUploader(image.path);
      await client.query('UPDATE users SET "image"=$1', [url]);
      return url;
    } catch (error) {
      throw new Error('Unable to upload profile image, please try again');
    }
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
    const addUserQuery = 'INSERT INTO users("fullName", email, "authId") VALUES($1, $2, $3) RETURNING id, image';
    try {
      const addAuthentication = await client.query(authQuery, [this.username, this.password]);
      this.authId = addAuthentication.rows[0].id;
      const addUser = await client.query(addUserQuery, [this.fullName, this.email, this.authId]);
      this.id = addUser.rows[0].id;
      this.image = addUser.rows[0].image;
      const notificationStatus = await client.query('INSERT INTO "notificationStatus"("userId") VALUES($1) RETURNING *', [this.id]);
      this.notificationStatus = notificationStatus.rows[0].status;
      this.token = await this.generateToken();
    } catch (error) {
      if (error.message === 'duplicate key value violates unique constraint "authentication_username_key"') error.message = 'username has been chosen, please choose another username';
      if (error.message === 'duplicate key value violates unique constraint "users_email_key"') {
        await User.remove(this.username);
        error.message = 'email has been chosen, please choose another email';
      }
      throw error;
    }
    return this.strip();
  }

  async login() {
    const authQuery = `SELECT users.id, authentication.password, authentication.username, users."fullName", users.email, users.image, "notificationStatus".status as "notificationStatus" FROM authentication 
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
      this.image = user.image;
      this.notificationStatus = user.notificationStatus;
      this.token = await this.generateToken();
      return this.strip();
    }
    throw new Error('Invalid credentials');
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
