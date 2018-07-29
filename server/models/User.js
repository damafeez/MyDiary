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

  async save() {
    this.password = await bcrypt.hash(this.password, 5);
    const authQuery = 'INSERT INTO authentication(username, password) VALUES($1, $2) RETURNING id';
    const addUserQuery = 'INSERT INTO users("fullName", email, "authId") VALUES($1, $2, $3) RETURNING id';
    const addAuthentication = await client.query(authQuery, [this.username, this.password]);
    this.authId = addAuthentication.rows[0].id;
    const addUser = await client.query(addUserQuery, [this.fullName, this.email, this.authId]);
    this.id = addUser.rows[0].id;
    return Promise.resolve(this.strip());
  }

  async login() {
    try {
      const authQuery = `SELECT users.id, authentication.password, authentication.username, users."fullName", users.email FROM authentication INNER JOIN users 
      ON users."authId" = authentication.id 
      WHERE authentication.username = '${this.username}'`;
      const getUser = await client.query(authQuery);
      const user = getUser.rows[0];
      if (!user) return new Error('user not found');
      const correctPassword = await bcrypt.compare(this.password, getUser.rows[0].password);
      if (correctPassword) {
        this.fullName = user.fullName;
        this.email = user.email;
        this.id = user.id;
        this.token = await this.genToken();
        return Promise.resolve(this.strip());
      }
      throw new Error('user not found');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async genToken() {
    jwt.sign({
      exp: (Math.floor(Date.now() / 1000) + (60 * 60)) * 24 * 7,
      data: this.strip(),
    }, process.env.JWT_SECRET, (error, token) => {
      if (error) return Promise.reject(error);
      return Promise.resolve(token);
    });
  }

  strip() {
    const { password, ...noPassword } = this;
    return noPassword;
  }
}

export { signupRules, loginRules };
