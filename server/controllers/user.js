import connection from '../helpers/connection';
import { filterRequired } from '../helpers/utils';

const client = connection();
client.connect();

export async function signup(req, res) {
  const requiredFields = ['fullName', 'username', 'password'];
  try {
    const { fullName, username, password } = req.body;
    if (fullName && username && password) {
      const authenticationQuery = `INSERT INTO authentication (username, password)
      VALUES ('${username}','${password}') RETURNING *;`;
      const authenticationResult = await client.query(authenticationQuery);
      res.json({
        body: authenticationResult.rows[0],
        error: null,
      });
    } else {
      const error = filterRequired(requiredFields);
      throw new Error(error);
    }
  } catch (error) {
    res.status(400).json({
      body: {},
      error: error.message,
    });
  }
}

export async function test() {
  return 'test';
}
