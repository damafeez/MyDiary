import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import diarySpec from './diary.spec';
import signupSpec from './signup.spec';

chai.use(chaiHttp);
const rootUrl = '/api/v1';

describe('SERVER', () => {
  it('should be alive', async () => {
    const res = await chai.request(app).get(rootUrl);
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Server is live');
    expect(res.type).to.equal('text/html');
  });
});
diarySpec();
// signupSpec();
