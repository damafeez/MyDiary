import 'babel-polyfill';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.use(chaiHttp);

describe('SERVER', () => {
  it('should be alive', async () => {
    const res = await chai.request(app).get('/');
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Server is live');
    expect(res.type).to.equal('text/html');
  });
});
