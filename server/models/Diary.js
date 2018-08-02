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
  
  static async findById(id, author) {
    const fetchDiary = await client.query(`SELECT * FROM entries WHERE "id" = ${id} AND "authorId" = ${author.id}`);
    if (fetchDiary.rowCount === 0) throw new Error('entry not found');
    return fetchDiary.rows[0];
  }

  static async findByIdAndUpdate(id, author, update) {
    const updateDiary = await client.query(`UPDATE entries SET title='${update.title}', body='${update.body}', edited=CURRENT_TIMESTAMP WHERE id=${id} AND "authorId" = ${author.id} RETURNING *`);
    if (updateDiary.rowCount === 0) throw new Error('entry not found');
    return updateDiary.rows[0];
  }

  static async findByIdAndDelete(id, author) {
    const deleteDiary = await client.query(`DELETE FROM entries WHERE id=${id} AND "authorId" = ${author.id} RETURNING *`);
    if (deleteDiary.rowCount === 0) throw new Error('entry not found');
    return deleteDiary.rows[0];
  }

  static async find(author) {
    const fetchDiaries = await client.query(`SELECT * FROM entries WHERE "authorId" = ${author.id}`);
    return fetchDiaries.rows;
  }

  modify({ title, body }) {
    this.title = title;
    this.body = body;
    return this;
  }
}
export { diaries, postRules };
