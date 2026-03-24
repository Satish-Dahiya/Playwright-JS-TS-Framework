/*
Basic Auth uses username and password to authenticate an API Endpoint.
Bearer token uses Access Token to authenticate an API Endpoint.

For basic auth, uname and pwd can be directly mentioned in test case or can be read from config.ts file using 'httpCredentials' parameter under use section.
Only one 'httpCredentials' parameter can be used in config.ts file under use section.

OAUTH2.0 uses grant type to authenticate an API Endpoint.
grant_type = client_credentials
client_id = some string
client_secret = some string

To encode the username and password together, use the Buffer interface as shown below:=
const credentials = Buffer.from(`${username}:${password}`).toString('base64');

Credentials can also be read from config.ts file from 'httpCredentials' parameter as shown below:
httpCredentials: {
      username : 'admin',
      password: 'admin'
    }

json() will give response as json, text() will give response in form-encoded format.
response.text() or response.json()
 */

import { test, expect } from '@playwright/test';

test('basic auth test', async ({ request }) => {

    const username = 'admin';
    const password = 'admin';

    // Buffer interface encodes the username and password together
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');      // do not use spaces in `${username} : ${password}` , else will give 401 error
    console.log('Encoded string , after User and Password encoded is : ' + credentials);        // YWRtaW46YWRtaW4=

    const response = await request.get('https://the-internet.herokuapp.com/basic_auth', {
        headers: {
            Authorization: `Basic ${credentials}`,        // Bearer ${token}
        }
    });

    expect(response.status()).toBe(200);
    const body = await response.text();    // json() will give response as json, text() will give response in form-encoded format.
    console.log(body);

});


// credentials are read from config.ts file from 'httpCredentials' parameter.
test('basic auth test with credentials from config.ts file', async ({ request }) => {

    const response = await request.get('https://the-internet.herokuapp.com/basic_auth');

    expect(response.status()).toBe(200);
    const body = await response.text();    // json() will give response as json, text() will give response in form-encoded format.
    console.log(body);

});

