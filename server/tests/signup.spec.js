import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

const user = { username: 'johndoe', fullName: 'John Doe', password: 'mypassword' };
const rootUrl = '/api/v1';

export default function () {
  describe('routes', () => {
    describe('POST /auth/signup', () => {
      const route = '/auth/signup';
      it('should add user to database', async () => {
        const res = await chai.request(app).post(rootUrl + route).send(user);
        const { fullName, ...noFullName } = user;
        expect(res).to.have.status(200);
        expect(res.body.body).to.include(noFullName).and.have.property('userid');
      });
    });
  });
}
