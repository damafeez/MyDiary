import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import client from '../helpers/connection';
import dbSetupQuery, { dropTables } from '../migrations/dbSetupQuery';
import app from '../index';
import diarySpec from './diary.spec';
import signupSpec from './signup.spec';
import loginSpec from './login.spec';
import addEntrySpec from './addEntry.spec';
import getEntriesSpec from './getEntries.spec';
import getEntrySpec from './getEntry.spec';

process.env.NODE_ENV = 'test';
chai.use(chaiHttp);
const rootUrl = '/api/v1';

(async () => {
  await client.query(`${dropTables}${dbSetupQuery}`);
})();
describe('SERVER', () => {
  it('should be alive', async () => {
    const res = await chai.request(app).get(rootUrl);
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Server is live');
    expect(res.type).to.equal('text/html');
  });
});
// diarySpec();
signupSpec();
loginSpec();
addEntrySpec();
getEntriesSpec();
getEntrySpec();
