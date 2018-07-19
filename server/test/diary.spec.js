import 'babel-polyfill';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import Diary, { diaries } from '../model/Diary';

chai.use(chaiHttp);

const diaryTemplate = { title: 'My awesome diary', body: 'This is the body of my awesome diary', author: 'johndoe' };
const rootUrl = '/api/v1';

export default function () {
  describe('Diary Schema', () => {
    describe('constructor', () => {
      const newDiary = new Diary(diaryTemplate);
      it('should create a diary from specified object', () => {
        expect(newDiary).to.be.an('object');
        expect(newDiary).to.be.an.instanceOf(Diary);
        expect(newDiary).to.include({
          title: diaryTemplate.title,
          body: diaryTemplate.body,
          author: diaryTemplate.author,
        });
      });
      it('newDiary should have an id', () => {
        expect(newDiary).to.have.property('id');
        expect(newDiary.id).to.be.a('number');
      });
    });
    describe('STATIC save', async () => {
      const badDiary = {
        title: 'Bad Diary',
        body: 'This is obviously a bad diary because its not of type Diary',
        author: 'hacker',
      };
      const newDiary = new Diary(diaryTemplate);
      const diary = await Diary.save(newDiary);

      it('should save the diary', () => {
        expect(diaries).to.include(diary);
      });
      it('should return saved diary', () => {
        expect(newDiary).to.equal(diary);
      });
      it('should not save diary if not an instance of Diary', async () => {
        expect(diaries).to.not.include(badDiary);
        try {
          await Diary.save(diaryTemplate);
          throw new Error('error not thrown');
        } catch (e) {
          expect(e.message).to.equal(`Error: ${badDiary} is not a diary`);
        }
      });
    });
    describe('STATIC findById', async () => {
      const unknownId = '123badId';
      const newDiary = new Diary(diaryTemplate);
      const res = await Diary.save(newDiary);
      const diary = await Diary.findById(res.id);
      it('should return diary specified by id', () => {
        expect(diary).to.equal(res);
      });
      it('should throw an error if Id is not found', async () => {
        try {
          await Diary.findById(unknownId);
          throw new Error('error not thrown');
        } catch (e) {
          expect(e.message).to.equal('entry not found');
        }
      });
    });
    describe('STATIC findByIdAndUpdate', async () => {
      const unknownId = '123badId';
      const diaryUpdate = {
        title: 'My Very Awesome Diary',
        body: 'As you can see, this is more awesome',
        author: 'johndoe',
      };
      const newDiary = new Diary(diaryTemplate);
      const saveResult = await Diary.save(newDiary);
      const testResult = await Diary.findByIdAndUpdate(saveResult.id, diaryUpdate);
      const findResult = await Diary.findById(saveResult.id);
      it('should update specified diary', () => {
        expect(findResult).to.include({ ...diaryUpdate, id: saveResult.id });
      });
      it('should return updated diary', () => {
        expect(testResult).equal(findResult);
      });
      it('should throw an error if Id is not found', async () => {
        try {
          await Diary.findByIdAndUpdate(unknownId, diaryUpdate);
          throw new Error('error not thrown');
        } catch (e) {
          expect(e.message).to.equal('entry not found');
        }
      });
    });
    describe('STATIC findByIdAndDelete', async () => {
      const unknownId = '123badId';
      const newDiary = new Diary(diaryTemplate);
      const saveResult = await Diary.save(newDiary);
      const testResult = await Diary.findByIdAndDelete(saveResult.id);
      it('should delete specified diary', () => {
        expect(diaries).to.not.include(testResult);
      });
      it('should return deleted diary', () => {
        expect(testResult).equal(saveResult);
      });
      it('should throw an error if Id is not found', async () => {
        try {
          await Diary.findByIdAndDelete(unknownId);
          throw new Error('error not thrown');
        } catch (e) {
          expect(e.message).to.equal('entry not found');
        }
      });
    });
  });
  describe('routes', () => {
    describe('POST /entries', () => {
      const route = '/entries';
      it('should add entry to database', async () => {
        const res = await chai.request(app).post(rootUrl + route).send(diaryTemplate);
        const { id } = res.body;

        expect(res).to.have.status(200);
        expect(res.body).to.include({ title: diaryTemplate.title, body: diaryTemplate.body, author: diaryTemplate.author }).and.have.property('id');
        // verify that id was successfully added, then delete
        await Diary.findByIdAndDelete(id);
      });
      it('should not add entries with bad details', async () => {
        const badDetails = {
          body: 'This entry has bad details because it has no title',
          author: 'johndoe',
        };
        const res = await chai.request(app).post(rootUrl + route).send(badDetails);

        expect(res).to.have.status(400);
        expect(res.error.text).to.equal('all fields must be provided');
      });
    });
    describe('GET /entries', () => {
      const route = '/entries';
      it('should return all entries', async () => {
        // save new entry to ensure that test returns value
        const newDiary = new Diary(diaryTemplate);
        const diary = await Diary.save(newDiary);
        const { id } = diary;

        const res = await chai.request(app).get(rootUrl + route);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
        // delete entry after test
        await Diary.findByIdAndDelete(id);
      });
    });
    describe('GET /entries/:id', () => {
      it('should return entry with the specified id', async () => {
        // add entry before test
        const entry = await chai.request(app).post(diaryTemplate);
        const { id } = entry;
        const res = await chai.request(app).get(`${rootUrl}/entries/${id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include({
          title: diaryTemplate.title,
          body: diaryTemplate.body,
          author: diaryTemplate.author,
          id,
        });
        // delete entry after test
        await Diary.findByIdAndDelete(id);
      });
      it('should return status code 404 if entry is not found', async () => {
        const invalidId = '2444invalid';
        const res = await chai.request(app).get(`${rootUrl}/entries/${invalidId}`);
        expect(res).to.have.status(404);
        expect(res.body).to.eql({});
        expect(res.error.text).to.equal('entry not found');
      });
    });
    describe('DELETE /entries/:id', () => {
      it('should delete entry and return its value', async () => {
        // add entry before test
        const entry = await chai.request(app).post(diaryTemplate);
        const { id } = entry;
        const res = await chai.request(app).delete(`${rootUrl}/entries/${id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include({
          title: diaryTemplate.title,
          body: diaryTemplate.body,
          author: diaryTemplate.author,
          id,
        });
      });
      it('should return status code 404 if entry is not found', async () => {
        const invalidId = '2444invalid';
        const res = await chai.request(app).delete(`${rootUrl}/entries/${invalidId}`);
        expect(res).to.have.status(404);
        expect(res.body).to.eql({});
        expect(res.error.text).to.equal('entry not found');
      });
    });
    describe('PUT /entries/:id', async () => {
      const entry = await chai.request(app).post(diaryTemplate);
      const { id } = entry.body;
      const modification = {
        title: 'My very awesome title',
        body: 'As you can see, I have modified the body now since the title is more awesome :)',
      };
      it('should modify the specified entry and return new value', async () => {
        const res = await chai.request(app).put(`${rootUrl}/entries/${id}`).send(modification);
        expect(res).to.have.status(200);
        expect(diaries).to.include(res.body);
        expect(res.body).to.be.an('object');
        expect(res.body).to.include({
          title: modification.title, body: modification.body, author: diaryTemplate.author, id,
        });
      });
      it('should not modify entries when invalid data is given', async () => {
        const invalidData = {
          body: 'AS YOU CAN SEE, I HAVE NO TITLE. I WILL CAUSE AN ERROR :(',
        };
        const res = await chai.request(app).put(`${rootUrl}/entries/${id}`).send(invalidData);

        expect(res).to.have.status(400);
        expect(res.body).to.eql({});
        expect(res.error.text).to.equal('all fields must be provided');
      });
      it('should not modify an entry when id is invalid', async () => {
        const badId = 'verywrongid';
        const res = await chai.request(app).put(`${rootUrl}/entries/${badId}`).send(modification);

        expect(res).to.have.status(400);
        expect(res.body).to.eql({});
        expect(res.error.text).to.equal('entry not found');
      });
      after('delete entry after test', async () => {
        await Diary.findByIdAndDelete(id);
      });
    });
  });
}
