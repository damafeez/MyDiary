import { required, minLength, dataType } from '../helpers/utils';
import client from '../helpers/connection';

const diaries = [];

const postRules = {
  title: [
    [required],
    [minLength, 5],
    [dataType, 'string'],
  ],
  body: [
    [required],
    [minLength, 15],
    [dataType, 'string'],
  ],
};
const putRules = {
  title: [
    [required],
    [minLength, 5],
    [dataType, 'string'],
  ],
  body: [
    [required],
    [minLength, 15],
    [dataType, 'string'],
  ],
};
export default class Diary {
  constructor({ title, body, author }) {
    this.title = title;
    this.body = body;
    this.author = author;
  }

  async save() {
    const addDiaryQuery = 'INSERT INTO entries("title", body, "authorId") VALUES($1, $2, $3) RETURNING id, title, body, created, edited';
    const addDiary = await client.query(addDiaryQuery, [this.title, this.body, this.author.id]);
    return { ...addDiary.rows[0], author: this.author };
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const diary = diaries.find(entry => entry.id === Number(id));
      if (diary) {
        resolve(diary);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndUpdate(id, update) {
    return new Promise((resolve, reject) => {
      const index = diaries.findIndex(entry => entry.id === Number(id));
      if (index >= 0) {
        resolve(diaries[index].modify(update));
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static findByIdAndDelete(id) {
    return new Promise((resolve, reject) => {
      const index = diaries.findIndex(entry => entry.id === Number(id));
      const diary = diaries.find(entry => entry.id === Number(id));
      if (index >= 0) {
        diaries.splice(index, 1);
        resolve(diary);
      } else {
        reject(new Error('entry not found'));
      }
    });
  }

  static find(condition = true) {
    return new Promise((resolve) => {
      const entries = diaries.filter(entry => condition);
      resolve(entries);
    });
  }

  modify({ title, body }) {
    this.title = title;
    this.body = body;
    return this;
  }
}
export { diaries, postRules, putRules };
