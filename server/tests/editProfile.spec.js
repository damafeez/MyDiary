import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '..';
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
  describe('PUT /auth/edit', () => {
    const route = '/auth/edit';
    const newDetails = { fullName: 'New Name', email: 'johndoe@newmail.com' };
    let user;
    let id;
    before('add user and log him in before test', async () => {
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
    it('should modify user details and return newDetails', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send(newDetails);
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.include({
        fullName: newDetails.fullName,
        email: newDetails.email,
      });
    });
    it('should return error if newDetails excludes required field(s)', async () => {
      const badData = {
        fullName: 'Bad User',
      };
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send(badData);
      expect(response).to.have.status(400);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members([
        'email is required',
        'email should be of type email',
      ]);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send(newDetails);

      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`).send(newDetails);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
