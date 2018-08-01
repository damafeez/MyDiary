import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import Diary, { diaries } from '../models/Diary';

chai.use(chaiHttp);

const diaryTemplate = { title: 'My awesome diary', body: 'This is the body of my awesome diary', author: 1 };
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
    describe('STATIC save', () => {
      const badDiary = {
        title: 'Bad Diary',
        body: 'This is obviously a bad diary because its not of type Diary',
        author: 'hacker',
      };
      let newDiary;
      let diary;
      before('save diary', async () => {
        newDiary = new Diary(diaryTemplate);
        diary = await Diary.save(newDiary);
      });
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
    describe('STATIC findById', () => {
      const unknownId = '123badId';
      it('should return diary specified by id', async () => {
        const newDiary = new Diary(diaryTemplate);
        const res = await Diary.save(newDiary);
        const diary = await Diary.findById(res.id);
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
    describe('STATIC findByIdAndUpdate', () => {
      const unknownId = '123badId';
      const diaryUpdate = {
        title: 'My Very Awesome Diary',
        body: 'As you can see, this is more awesome',
        author: 1,
      };
      let saveResult;
      let testResult;
      let findResult;
      before('add diary and update', async () => {
        const newDiary = new Diary(diaryTemplate);
        saveResult = await Diary.save(newDiary);
        testResult = await Diary.findByIdAndUpdate(saveResult.id, diaryUpdate);
        findResult = await Diary.findById(saveResult.id);
      });
      it('should update specified diary', async () => {
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
    describe('STATIC findByIdAndDelete', () => {
      const unknownId = '123badId';
      let saveResult;
      let testResult;
      before('add entry and delete', async () => {
        const newDiary = new Diary(diaryTemplate);
        saveResult = await Diary.save(newDiary);
        testResult = await Diary.findByIdAndDelete(saveResult.id);
      });
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
    describe('GET /entries', () => {
      const route = '/entries';
      it('should return all entries', async () => {
        // save new entry to ensure that test returns value
        const entry = await chai.request(app).post(`${rootUrl}/entries`).send(diaryTemplate);
        const { id } = entry.body.data;

        const res = await chai.request(app).get(rootUrl + route);
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.greaterThan(0);
        // delete entry after test
        await Diary.findByIdAndDelete(id);
      });
    });
    describe('GET /entries/:id', () => {
      it('should return entry with the specified id', async () => {
        // add entry before test
        const entry = await chai.request(app).post(`${rootUrl}/entries`).send(diaryTemplate);
        const { id } = entry.body.data;
        const res = await chai.request(app).get(`${rootUrl}/entries/${id}`);
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.include({
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
        expect(res.body.data).to.eql({});
        expect(res.body.error).to.equal('entry not found');
      });
    });
    describe('PUT /entries/:id', () => {
      const modification = {
        title: 'My very awesome title',
        body: 'As you can see, I have modified the body now since the title is more awesome :)',
      };
      let entryId;
      before('Add entry to db before test', async () => {
        const entry = await chai.request(app).post(`${rootUrl}/entries`).send(diaryTemplate);
        entryId = entry.body.data.id;
      });
      it('should modify the specified entry and return an object containing it ', async () => {
        const testResult = await chai.request(app).put(`${rootUrl}/entries/${entryId}`).send(modification);
        const verifyIfSaved = await chai.request(app).get(`${rootUrl}/entries/${entryId}`);

        expect(testResult).to.have.status(200);
        expect(verifyIfSaved.body.data).to.include({
          title: modification.title,
          body: modification.body,
          author: diaryTemplate.author,
          id: entryId,
        });
        expect(testResult.body.data).to.be.an('object');
        expect(testResult.body.data).to.include({
          title: modification.title,
          body: modification.body,
          author: diaryTemplate.author,
          id: entryId,
        });
      });
      it('should not modify entries when invalid data is given', async () => {
        const invalidData = {
          body: 'AS YOU CAN SEE, I HAVE NO TITLE. I WILL CAUSE AN ERROR :(',
        };
        const res = await chai.request(app).put(`${rootUrl}/entries/${entryId}`).send(invalidData);

        expect(res).to.have.status(400);
        expect(res.body.data).to.eql({});
        expect(res.body.error).to.include.members([
          'title is required',
          'title should have minimum of 5 characters',
          'title should be of type string',
        ]);
      });
      it('should not modify an entry when id is invalid', async () => {
        const badId = 'verywrongid';
        const res = await chai.request(app).put(`${rootUrl}/entries/${badId}`).send(modification);

        expect(res).to.have.status(400);
        expect(res.body.data).to.eql({});
        expect(res.body.error).to.equal('entry not found');
      });
      after('delete added entry after tests', async () => {
        await Diary.findByIdAndDelete(entryId);
      });
    });
    describe('DELETE /entries/:id', () => {
      it('should delete entry and return its value', async () => {
        // add entry before test
        const entry = await chai.request(app).post(`${rootUrl}/entries`).send(diaryTemplate);
        const { id } = entry.body.data;
        const res = await chai.request(app).delete(`${rootUrl}/entries/${id}`);
        expect(res).to.have.status(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.include({
          title: diaryTemplate.title,
          body: diaryTemplate.body,
          author: diaryTemplate.author,
          id,
        });
      });
      it('should return status code 404 if entry is not found', async () => {
        const invalidId = '2444invalid';
        const res = await chai.request(app).delete(`${rootUrl}/entries/${invalidId}`);
        expect(res).to.have.status(400);
        expect(res.body.data).to.eql({});
        expect(res.body.error).to.equal('entry not found');
      });
    });
  });
}
