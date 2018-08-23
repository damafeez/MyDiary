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
    const subscription = {
      endpoint: 'http://fcm.googleapis.com/fcm/send/eCOyG5RIGBk:APA91bHLPAEdhmaWtcvdiNY9ORy5yGW9OVNVWpRvBQWss2l1LRwb2cg6l76eP9AX6AcLE5BfqoWjXZQvOVKLvy7cSj4DG5JRO4v_76JpUGWq5vaaILkFy-0VqMNVZoyucbJEy4dJV0RywWY0W62VWvK387GIoqjR4w',
      expirationTime: null,
      keys: {
        p256dh: 'BIAK4CRzZakSwXoraC2MXqRutYiFeUXch6LC0uJ1qa76zpZ1bbxwshXRMXItba6xNxzhriQPVZ0TX3YyDcKtew0=', auth: '4Pnvf2B5px0N-XdcCWObvQ==',
      },
    };
    let user;
    before('add user, log him in before test', async () => {
      await chai.request(app).post(`${rootUrl}/auth/signup`).send(userDetails);
      const login = await chai.request(app).post(`${rootUrl}/auth/login`)
        .send({ username: userDetails.username, password: userDetails.password });
      user = login.body.data;
    });
    after('remove user after test', async () => {
      await User.remove(user.username);
    });
    it('should modify subscription and return status 200', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({ subscription });
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
      expect(response.body.data).to.eql(subscription);
    });
    it('should return error if modification excludes required field(s)', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({});
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
  describe('PUT /push/notification', () => {
    const route = '/push/notification';
    let user;
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
    it('should modify notification and return status 200', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({ status: true });
      expect(response).to.have.status(200);
      expect(response.body.data).to.be.an('object');
    });
    it('should return error if modification excludes required field(s)', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', user.token).send({});
      expect(response).to.have.status(400);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members([
        'status should be of type boolean',
      ]);
    });
    it('should return error if token is compromised', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .set('x-auth-token', 'thisisacompromisedtoken22i349fuq3j990fw').send({ status: false });
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['jwt malformed']);
    });
    it('should return error if token is not given', async () => {
      const response = await chai.request(app).put(`${rootUrl}${route}`)
        .send({ status: false });
      expect(response).to.have.status(401);
      expect(response.body.data).to.eql({});
      expect(response.body.error).to.include.members(['token is required']);
    });
  });
}
