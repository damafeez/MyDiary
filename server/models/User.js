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
    const authQuery = 'INSERT INTO authentication(username, password) VALUES($1, $2) RETURNING *';
    const addUserQuery = 'INSERT INTO users("fullName", email, "authId") VALUES($1, $2, $3)';
    const addAuthentication = await client.query(authQuery, [this.username, this.password]);
    this.authId = addAuthentication.rows[0].id;
    await client.query(addUserQuery, [this.fullName, this.email, this.authId]);
    return Promise.resolve(this.strip());
  }

  strip() {
    const { password, ...noPassword } = this;
    return noPassword;
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const user = users.find(entry => entry.id === Number(id));
      if (user) {
        resolve(user);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndUpdate(id, update) {
    return new Promise((resolve, reject) => {
      const index = users.findIndex(entry => entry.id === Number(id));
      if (index >= 0) {
        resolve(users[index].modify(update));
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
      const index = users.findIndex(entry => entry.id === Number(id));
      const user = users.find(entry => entry.id === Number(id));
      if (index >= 0) {
        users.splice(index, 1);
        resolve(user);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static find(condition = true) {
    return new Promise((resolve) => {
      const entries = users.filter(entry => condition);
      resolve(entries);
    });
  }

  modify({ title, body }) {
    this.title = title;
    this.body = body;
    return this;
  }
}
