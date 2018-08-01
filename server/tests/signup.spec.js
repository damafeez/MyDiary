import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import User from '../models/User';

chai.use(chaiHttp);

const user = {
  username: 'johndoe',
  fullName: 'John Doe',
  password: 'mypassword',
  email: 'johndoe@gmail.com',
};
const rootUrl = '/api/v1';

export default function () {
  describe('POST /auth/signup', () => {
    const route = '/auth/signup';
    after('remove user after test', async () => {
      const response = await User.remove(user.username);
      expect(response.rowCount).to.equal(1);
      expect(response.rows[0]).to.include({ username: user.username });
    });
    it('should add user to database', async () => {
      const response = await chai.request(app).post(rootUrl + route).send(user);
      expect(response).to.have.status(201);
      expect(response.body.data).to.include({ fullName: user.fullName, username: user.username }).and.have.property('id').but.not.have.property('password');
    });
    it('should not add user with bad details', async () => {
      const badUser = {
        fullName: 'Bad User',
        username: 'johndoe',
      };
      const response = await chai.request(app).post(rootUrl + route).send(badUser);
      expect(response).to.have.status(400);
      expect(response.body.error).to.include.members([
        'password is required',
        'password should have minimum of 8 characters',
        'password should be of type string',
        'email is required',
        'email should be of type email',
      ]);
    });
    it('should not add existing username', async () => {
      const response = await chai.request(app).post(rootUrl + route).send(user);
      expect(response).to.have.status(400);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['username has been chosen']);
    });
    it('should not add existing email', async () => {
      const res = await chai.request(app).post(rootUrl + route).send({ ...user, username: 'anotherusername' });
      expect(res).to.have.status(400);
      expect(res.body.data).to.eql({});
      expect(res.body.error).to.include.members(['email has been chosen']);
    });
  });
}
