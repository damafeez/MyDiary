import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

const user = {
  username: 'johndoe',
  fullName: 'John Doe',
  password: 'mypassword',
  email: 'johndoe@gmail.com',
};
const rootUrl = '/api/v1';

export default function () {
  describe('routes', () => {
    describe('POST /auth/signup', () => {
      const route = '/auth/signup';
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
        expect(res.body.error).to.equal('field email is required, field password is required');
      });
      it('should not add existing user', async () => {

      });
    });
  });
}
