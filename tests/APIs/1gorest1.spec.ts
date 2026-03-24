/*
request fixture / library of '@playwright/test' module is used for API Automation.
All HTTPS methods are available in request library.
request.get() , request.post(), request.patch(), request.put(), request.delete()
Pass the required parameters in the respective HTTPS methods.
Bearer Token is always required to access an API Endpoint.
Generate the Token from gorest.co.in website
Genarate dynamic unique email using Date.now()   -->   `abcd${Date.now()}@dee.com`

 */

import { test, expect } from '@playwright/test';

const TOKEN = '63f49875bca23d116747370c615f55ccd9364355e311270f0f6713830eb2b58c';

test('GET - fetch all users', async ({ request }) => {

    const response = await request.get('https://gorest.co.in/public/v2/users', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);

});

test('GET - fetch a single user', async ({ request }) => {
   
   const response = await request.get('https://gorest.co.in/public/v2/users/8401662', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
   });
    
    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
});


test('POST - Create a User', async ({ request }) => {

    const requestBody = {
        name: 'sam',
        email : `abcd${Date.now()}@dee.com`,                          // dynamic unique email using Date.now()
        status: 'active',
        gender: 'male'
    };
   
   const response = await request.post('https://gorest.co.in/public/v2/users/', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
        data : requestBody
   });
    
    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log(data);
});
