import bcrypt from 'bcrypt';
import client from '../helpers/connection';
import { required, minLength, dataType } from '../helpers/utils';

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
      const authQuery = `SELECT * FROM authentication WHERE username = '${this.username}'`;
      const getAuth = await client.query(authQuery);
      if (getAuth.rows.length === 0) return new Error('user not found');
      this.username = getAuth.rows[0].username;
      this.authId = getAuth.rows[0].id;
      const correctPassword = await bcrypt.compare(this.password, getAuth.rows[0].password);
      if (correctPassword) {
        const userQuery = `SELECT * FROM users WHERE "authId"=${this.authId}`;
        const getUser = await client.query(userQuery);
        this.id = getUser.rows[0].id;
        this.email = getUser.rows[0].email;
        this.fullName = getUser.rows[0].fullName;
        return Promise.resolve(this.strip());
      }
      throw new Error('user not found');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  strip() {
    const { password, authId, ...noPasswordOrAuth } = this;
    return noPasswordOrAuth;
  }
}

export { signupRules, loginRules };
