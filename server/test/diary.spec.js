import 'babel-polyfill';
import { expect } from 'chai';

// import Diary, { diaries } from '../model/Diary';
const Diary = () => 'this should have been imported from ../model/Diary';
const diaries = [];
// will change

const diaryTemplate = { title: 'My awesome diary', body: 'This is the body of my awesome diary', author: 'johndoe' };

export default function () {
  describe('Diary', () => {
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
          expect(e.message).to.equal(`${badDiary} is not of type Diary`);
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
}
