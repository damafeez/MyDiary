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
const diaryTemplate = { title: 'My awesome diary', body: 'This is the body of my awesome diary' };
const rootUrl = '/api/v1';

export default function () {
  describe('POST /entries', () => {
    let user;
    before('add user to db and log him in before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
    });
    after('delete user after test', async () => {
      after('remove user after test', async () => {
        const response = await User.remove(user.username);
        expect(response.rowCount).to.equal(1);
        expect(response.rows[0]).to.include({ username: user.username });
      });
    });
    const route = '/entries';
    it('should add entry to database', async () => {
      const response = await chai.request(app).post(rootUrl + route)
        .set('x-auth-token', user.token).send(diaryTemplate);
      expect(response).to.have.status(201);
      expect(response.body.data).to.include({
        title: diaryTemplate.title,
        body: diaryTemplate.body,
      });
      expect(response.body.data.author).to.include({
        fullName: userDetails.fullName,
        username: userDetails.username,
        email: userDetails.email,
      }).but.not.have.property('password');
      expect(response.body.data).to.have.property('id');
      expect(response.body.data).to.have.property('created');
      expect(response.body.data).to.have.property('edited');
    });
    it('should not add entry with bad token', async () => {
      const response = await chai.request(app).post(rootUrl + route)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send(diaryTemplate);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should not add entry without bad token', async () => {
      const response = await chai.request(app).post(rootUrl + route).send(diaryTemplate);
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
    it('should not add entries if data excludes required field(s)', async () => {
      const badDetails = {
        body: 'This entry has bad details because it has no title',
      };
      const response = await chai.request(app).post(rootUrl + route).set('x-auth-token', user.token).send(badDetails);

      expect(response).to.have.status(400);
      expect(response.body.error).to.include.members([
        'title is required',
        'title should have minimum of 5 characters',
        'title should be of type string',
      ]);
    });
  });
}
