/*
HTTPS Methods : GET, POST , PUT , PATCH, DELETE
 */

import { test, expect } from '@playwright/test';

// these are generic parameters
const TOKEN = '63f49875bca23d116747370c615f55ccd9364355e311270f0f6713830eb2b58c';
const BASE_URL = 'https://gorest.co.in/public/v2/users';

// common headers ( take them from POSTMAN )
const myheaders = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};


test('GET - fetch all users', async ({ request }) => {

    const response = await request.get(BASE_URL, {
        headers: myheaders
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);

});


test('POST - Create a User', async ({ request }) => {

    const requestBody = {
        name: 'sam',
        email: `abcd${Date.now()}@dee.com`,                          // dynamic unique email using Date.now()
        status: 'active',
        gender: 'male'
    };

    const response = await request.post(BASE_URL, {
        headers: myheaders,
        data: requestBody
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    console.log(data);
});


test('PUT - Update a User', async ({ request }) => {

    const userID = 8401856;
    const requestBody = {
        name: 'samson',
        status: 'inactive'
    };

    const response = await request.put(`${BASE_URL}/${userID}`, {
        headers: myheaders,
        data: requestBody
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    console.log(data);
});

test('DELETE - Delete a User', async ({ request }) => {

    const userID = 8402185;

    const response = await request.delete(`${BASE_URL}/${userID}`, {
        headers: myheaders
    });

    expect(response.status()).toBe(404);         // 204 when deleted successfully and 404 when to be deleted resource is not found
    // const data = await response.json();
    // console.log(data);
    console.log('Hey bro, Data deleted successfully.....');
});