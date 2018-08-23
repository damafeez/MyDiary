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
const diaryTemplate = { title: 'My second awesome diary', body: 'This is the body of my second awesome diary' };
const rootUrl = '/api/v1';

export default function () {
  const route = '/entries';
  describe('GET /entries', () => {
    let user;
    before('add user, log him in and add entry before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
      await chai.request(app).post(`${rootUrl}/entries`)
        .set('x-auth-token', user.token).send(diaryTemplate);
    });
    after('remove user after test', async () => {
      await User.remove(user.username);
    });
    it('should return all entries', async () => {
      const response = await chai.request(app).get(rootUrl + route)
        .set('x-auth-token', user.token);
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.greaterThan(0);
      expect(response.body.data[0]).to.have.property('id');
      expect(response.body.data[0]).to.have.property('title');
      expect(response.body.data[0]).to.have.property('body');
      expect(response.body.data[0]).to.have.property('authorId');
      expect(response.body.data[0]).to.have.property('created');
      expect(response.body.data[0]).to.have.property('edited');
    });
    it('should return error when token is compromised', async () => {
      const response = await chai.request(app).post(rootUrl + route)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send(diaryTemplate);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error when token is not given', async () => {
      const response = await chai.request(app).post(rootUrl + route).send(diaryTemplate);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
