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
  describe('POST /auth/login', () => {
    const route = '/auth/login';
    before('add user so we can login him in', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
    });
    after('remove user after test', async () => {
      const response = await User.remove(userDetails.username);
      expect(response.rowCount).to.equal(1);
      expect(response.rows[0]).to.include({ username: userDetails.username });
    });
    it('should log user in', async () => {
      const res = await chai.request(app).post(rootUrl + route)
        .send({ username: userDetails.username, password: userDetails.password });
      expect(res).to.have.status(200);
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('token');
      expect(res.body.data).to.not.have.property('password');
      expect(res.body.data).to.not.have.property('authId');
      expect(res.body.data).to.include({
        fullName: userDetails.fullName,
        email: userDetails.email,
        username: userDetails.username,
        notificationStatus: true,
      });
    });
    it('should not log user with bad credentials in', async () => {
      const res = await chai.request(app).post(rootUrl + route).send({ username: userDetails.username, password: 'incorrect' });
      expect(res).to.have.status(401);
      expect(res.body.error).to.include.members(['Invalid credentials']);
    });
    it('should return custom error message if required fields are not supplied', async () => {
      const res = await chai.request(app).post(rootUrl + route)
        .send({ password: userDetails.password });
      expect(res).to.have.status(400);
      expect(res.body.error).to.include.members(['username is required']);
    });
  });
}
