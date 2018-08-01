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
      const res = await chai.request(app).post(rootUrl + route).send(user);
      expect(res).to.have.status(201);
      expect(res.body.data).to.include({ fullName: user.fullName, username: user.username }).and.have.property('id').but.not.have.property('password');
    });
    it('should not add user with bad details', async () => {
      const badUser = {
        fullName: 'Bad User',
        username: 'johndoe',
      };
      const res = await chai.request(app).post(rootUrl + route).send(badUser);

      expect(res).to.have.status(400);
      expect(res.body.error).to.include.members([
        'password is required',
        'password should have minimum of 8 characters',
        'password should be of type string',
        'email is required',
        'email should be of type email',
      ]);
    });
    it('should not add existing user', async () => {
      const res = await chai.request(app).post(rootUrl + route).send(user);
      expect(res).to.have.status(400);
      expect(res.body.data).to.eql({});
      expect(res.body.error).to.include.members(['username has been chosen']);
    });
  });
}
