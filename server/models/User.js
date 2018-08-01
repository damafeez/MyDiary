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
const loginRules = {
  username: [
    [required],
  ],
  password: [
    [required],
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

  async save() {
    this.password = await bcrypt.hash(this.password, 5);
    const authQuery = 'INSERT INTO authentication(username, password) VALUES($1, $2) RETURNING id';
    const addUserQuery = 'INSERT INTO users("fullName", email, "authId") VALUES($1, $2, $3) RETURNING id';
    const addAuthentication = await client.query(authQuery, [this.username, this.password]);
    try {
      this.authId = addAuthentication.rows[0].id;
      const addUser = await client.query(addUserQuery, [this.fullName, this.email, this.authId]);
      this.id = addUser.rows[0].id;
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
    const authQuery = `SELECT users.id, authentication.password, authentication.username, users."fullName", users.email FROM authentication INNER JOIN users 
    ON users."authId" = authentication.id 
    WHERE authentication.username = '${this.username}'`;
    const getUser = await client.query(authQuery);
    const user = getUser.rows[0];
    if (!user) return new Error('user not found');
    const isCorrectPassword = await bcrypt.compare(this.password, getUser.rows[0].password);
    if (isCorrectPassword) {
      this.fullName = user.fullName;
      this.email = user.email;
      this.id = user.id;
      this.token = await this.generateToken();
      return this.strip();
    }
    throw new Error('user not found');
  }

  async generateToken() {
    return jwt.sign({
      exp: (Math.floor(Date.now() / 1000) + (60 * 60)) * 24 * 7,
      data: this.strip(),
    }, process.env.JWT_SECRET);
  }

  strip() {
    const { password, ...noPassword } = this;
    return noPassword;
  }
}

export { signupRules, loginRules };
