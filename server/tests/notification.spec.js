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
    before('add user, log him in and add entry before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
      chai.request(app).post(`${rootUrl}/entries`)
        .set('x-auth-token', user.token).send(diaryTemplate);
    });
    after('remove user after test', async () => {
      await User.remove(user.username);
    });
    it('should set notification status', async () => {
      const response = await chai.request(app).put(`${rootUrl}/notification`)
        .set('x-auth-token', user.token).send({ status: true });
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.include({ nstatus: true });
      expect(response.body.data).to.have.property('userId');
      expect(response.body.data).to.have.property('id');
    });
    it('should return error if specified id is not found', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/entries/${7.3}`)
        .set('x-auth-token', user.token);
      expect(response).to.have.status(404);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['entry not found']);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/notification`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw');

      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).delete(`${rootUrl}/notification`);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
