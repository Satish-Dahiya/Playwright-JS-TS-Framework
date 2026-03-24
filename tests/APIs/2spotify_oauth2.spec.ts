/*
This is Spotify example to generate the dynamic token on fly to be used in headers  while hitting an API Endpoint.
New Access Token will be generated every time before each test() method run.
Write its code in beforeEach() hook so that it is executed before every test() method execution.

OAUTH2.0 uses grant type to authenticate an API Endpoint.
grant_type = client_credentials
client_id = some string
client_secret = some string

Steps: Creation of dynamic access Token to hit the required API.
1. First accessToken will be generated using grant_type, client_id and client_secret
2. Use this created accessToken to hit any API Endpoint.

stringify() method-->> Converts a JavaScript object to a JavaScript Object Notation (JSON) string, as shown below:-
JSON.stringify(responseData, null, 2)

 */
// IMPORTANT :==> THIS TEST IS SOMETIMES WORKING FINE AND SOMTIMES GIVING 403 ERROR.

import { test, expect } from '@playwright/test';

// from 'SatApp' app created on my https://developer.spotify.com/ account.
const CLIENT_ID = '3800e6cf42e546ad9780b4810341f952';
const CLIENT_SECRET = 'ca0dd18b88c54b0abf03cc84afe91e84';
let accessToken: string;

// hook to generate Access Token >  this hook will be run before each test()
// Step-1: generate the dynamic Access token.
test.beforeEach(async ({ request }) => {

    const response = await request.post('https://accounts.spotify.com/api/token', {                        // API to generate token
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
    },
    form : {                                                                              // form type of body
        grant_type : 'client_credentials',
        client_id :  CLIENT_ID,
        client_secret : CLIENT_SECRET
    }    
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
    accessToken = data.access_token;
    console.log('Access Token is :==> ' + accessToken);

});

// Step-2: use above created Access token to hit the required API.
test('get albums', async ( {request} ) => {
    const response = await request.get('https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy', {                   // API endpoint to get albums
        headers: {
            'Authorization': `Bearer ${accessToken}`,                                                   // above created accessToken is used here
        }
    });

        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2) );     // stringify() -->> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

});


test('get tracks', async ( {request} ) => {
    const response = await request.get('https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V', {                   // API endpoint to get tracs
        headers: {
            'Authorization': `Bearer ${accessToken}`,                                                   // above created accessToken is used here
        }
    });

        expect(response.status()).toBe(200);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2) );     // stringify() -->> Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

});
