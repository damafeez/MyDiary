import bcrypt from 'bcrypt';
import connection from '../helpers/connection';

const client = connection();
const users = [];

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

  strip() {
    const { password, ...noPassword } = this;
    return noPassword;
  }
}
