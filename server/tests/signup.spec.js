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
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body.data).to.include({ fullName: user.fullName, username: user.username });
      });
    });
  });
}
