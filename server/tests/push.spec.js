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
const rootUrl = '/api/v1';

export default function () {
  describe('GET /push/publicKey', () => {
    const route = '/push/publicKey';
    it('should return push publicKey', async () => {
      const response = await chai.request(app).get(`${rootUrl}${route}`);
      expect(response.text).to.equal(process.env.VAPID_PUBLIC_KEY);
    });
  });
  describe('PUT /push/subscribe', () => {
    const route = '/push/subscribe';
    let user;
    let id;
    before('add user, log him in before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
    });
    after('delete user after test', async () => {
      after('remove user after test', async () => {
        await User.remove(user.username);
      });
    });
    it('should modify subscription and return status 200', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({ status: false, subscription: {} });
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
    });
    it('should return error if modification excludes required field(s)', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({ status: false });
      expect(response).to.have.status(400);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members([
        'subscription is required',
        'subscription should be of type object',
      ]);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send({ status: false, subscription: {} });
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .send({ status: false, subscription: {} });
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
