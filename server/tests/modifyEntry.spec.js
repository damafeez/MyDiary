import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import User from '../models/User';

chai.use(chaiHttp);

const userDetails = {
  username: 'johndoe',
  fullName: 'John Doe',
  password: 'mypassword',
  email: 'johndoe@gmail.com',
};
const diaryTemplate = { title: 'My third awesome diary', body: 'This is the body of my third awesome diaryThis is the body of my third awesome diary' };
const rootUrl = '/api/v1';

export default function () {
  describe('PUT /entries/:id', () => {
    const modification = {
      title: 'My very awesome title',
      body: 'As you can see, I have modified the body now since the title is more awesome :)',
    };
    let user;
    let id;
    before('add user, log him in and add entry before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
      const entry = await chai.request(app).post(`${rootUrl}/entries`)
        .set('x-auth-token', user.token).send(diaryTemplate);
      ({ id } = entry.body.data);
    });
    after('remove user after test', async () => {
      await User.remove(user.username);
    });
    it('should modify specified entry and return new value', async () => {
      const response = await chai.request(app).put(`${rootUrl}/entries/${id}`)
        .set('x-auth-token', user.token).send(modification);
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.include({
        title: modification.title,
        body: modification.body,
      });
      expect(response.body.data).to.have.property('authorId');
      expect(response.body.data).to.have.property('created');
      expect(response.body.data).to.have.property('edited');
    });
    it('should return error if modification excludes required field(s)', async () => {
      const badData = {
        body: 'I am a bad data, I will cause an error because I dont have a title',
      };
      const response = await chai.request(app).put(`${rootUrl}/entries/${id}`)
        .set('x-auth-token', user.token).send(badData);
      expect(response).to.have.status(400);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members([
        'title is required',
        'title should have minimum of 5 characters',
        'title should be of type string',
      ]);
    });
    it('should return error if specified id is not found', async () => {
      const response = await chai.request(app).put(`${rootUrl}/entries/${74}`)
        .set('x-auth-token', user.token).send(modification);
      expect(response).to.have.status(404);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['entry not found']);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).put(`${rootUrl}/entries/${id}`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send(modification);

      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).put(`${rootUrl}/entries/${id}`).send(modification);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
