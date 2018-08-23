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
  describe('DELETE /entries/:id', () => {
    let user;
    let id;
    before('add user, log him in before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
    });
    beforeEach('add entry to db before each test', async () => {
      const entry = await chai.request(app).post(`${rootUrl}/entries`)
        .set('x-auth-token', user.token).send(diaryTemplate);
      id = entry.body.data.id;
    });
    after('delete user after test', async () => {
      await User.remove(user.username);
    });
    it('should delete specified entry and return it', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/entries/${id}`)
        .set('x-auth-token', user.token);
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.include({
        title: diaryTemplate.title,
        body: diaryTemplate.body,
      });
      expect(response.body.data).to.have.property('authorId');
      expect(response.body.data).to.have.property('created');
      expect(response.body.data).to.have.property('edited');
    });
    it('should return error if specified id is not found', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/entries/${7.3}`)
        .set('x-auth-token', user.token);
      expect(response).to.have.status(404);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['entry not found']);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/entries/${id}`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw');

      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/entries/${id}`);

      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
