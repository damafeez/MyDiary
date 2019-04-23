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
    [minLength, 20],
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
    const addDiaryQuery = 'INSERT INTO entries("title", body, "authorId") VALUES($1, $2, $3) RETURNING *';
    const addDiary = await client.query(addDiaryQuery, [this.title, this.body, this.author.id]);
    return addDiary.rows[0];
  }

  static async findById(id, author) {
    const fetchDiary = await client.query(`SELECT * FROM entries WHERE "id" = ${id} AND "authorId" = ${author.id}`);
    if (fetchDiary.rowCount === 0) throw new Error('entry not found');
    return fetchDiary.rows[0];
  }

  static async findByIdAndUpdate(id, author, update) {
    const updateQuery = 'UPDATE entries SET title=$1, body=$2, edited=CURRENT_TIMESTAMP WHERE id=$3 AND "authorId" = $4 RETURNING *';
    const updateDiary = await client.query(updateQuery, [update.title, update.body, id, author.id]);
    if (updateDiary.rowCount === 0) throw new Error('entry not found');
    return updateDiary.rows[0];
  }

  static async findByIdAndDelete(id, author) {
    const deleteDiary = await client.query(`DELETE FROM entries WHERE id=${id} AND "authorId" = ${author.id} RETURNING *`);
    if (deleteDiary.rowCount === 0) throw new Error('entry not found');
    return deleteDiary.rows[0];
  }

  static async find(author) {
    const fetchDiaries = await client.query(`SELECT * FROM entries WHERE "authorId" = ${author.id} ORDER BY created DESC`);
    return fetchDiaries.rows;
  }
}
export { diaries, postRules };
