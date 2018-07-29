import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

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
      await chai.request(app).post(rootUrl + '/auth/signup').send(userDetails);
    })
    after('remove added user after test', () => {
      // remove user after test
    });
    it('should log user in', async () => {
      const res = await chai.request(app).post(rootUrl + route).send({ username: userDetails.username, password: userDetails.password });
      expect(res).to.have.status(200);
      expect(res.body.data).to.have.all.keys('email', 'id', 'username');
      expect(res.body.data).to.include({ fullName: loginDetails.fullName }).but.not.have.property('password');
    });
    it('should not log user with bad credentials in', async () => {
      const res = await chai.request(app).post(rootUrl + route).send({ username: userDetails.username, password: 'incorrect' });

      expect(res).to.have.status(401);
      expect(res.body.error).to.include.members('user not found');
    });
    it('should return custom error message if required fields are not required', async () => {
      const res = await chai.request(app).post(rootUrl + route).send({ password: userDetails.password });

      expect(res).to.have.status(401);
      expect(res.body.error).to.equal('user not found');
    });
  });
}
