import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import client from '../helpers/connection';
import dbSetupQuery, { dropTables } from '../migrations/dbSetupQuery';
import app from '../index';
import signupSpec from './signup.spec';
import loginSpec from './login.spec';
import addEntrySpec from './addEntry.spec';
import getEntriesSpec from './getEntries.spec';
import getEntrySpec from './getEntry.spec';
import modifyEntrySpec from './modifyEntry.spec';
import deleteEntrySpec from './deleteEntry.spec';
import pushSpec from './push.spec';
import editProfileSpec from './editProfile.spec';
import changePasswordSpec from './changePassword.spec';

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

signupSpec();
loginSpec();
addEntrySpec();
getEntriesSpec();
getEntrySpec();
modifyEntrySpec();
deleteEntrySpec();
pushSpec();
editProfileSpec();
changePasswordSpec();
