/*
For End to End test of CRUD operations, write all CRUD operations in a single test() method only.
Create a User  ( HTTPS Status Code 201 )
Get a User     ( HTTPS Status Code 200 )
Update a User  ( HTTPS Status Code 200 )
Delete a User  ( HTTPS Status Code 204 )    // 404 after Deletion
Get a User     ( HTTPS Status Code 404 )    // 404 after Deletion

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

// Single test() method combining all the E2E CRUD Operations. 

test('E2E CRUD flow test', async ({ request }) => {

    console.log('=========== POST CALL =============');

    // Step-1 : Create a User
    const requestBody = {
        name: 'sam',
        email: `abcd${Date.now()}@dee.com`,                          // dynamic unique email using Date.now()
        status: 'active',
        gender: 'male'
    };

    
    const responsePOST = await request.post(BASE_URL, {
        headers: myheaders,
        data : requestBody
    });

    expect(responsePOST.status()).toBe(201);
    const createdUser = await responsePOST.json();
    console.log(createdUser);
    const userID = createdUser.id;
    console.log('User ID created is :' + userID);
    console.log('User is created successfully...');

    console.log('================ GET CALL AFTER POST==========');

    // Step-2 : Get the same user by using user id - userID
    const responseGET = await  request.get(`${BASE_URL}/${userID}`, {
        headers: myheaders
    });

    expect(responseGET.status()).toBe(200);
    const data = await responseGET.json();
    console.log(data);
    console.log('User is retrieved successfully...');
    

    console.log('================ UPDATE CALL ==========');

    // Step-3 : Update the same user by using user id - userID
    const updateBody = {
        status: 'inactive',
        gender: 'female'
    };

    const responsePUT = await request.put(`${BASE_URL}/${userID}`, {
        headers: myheaders,
        data: updateBody
    });

    expect(responsePUT.status()).toBe(200);
    const updatedData = await responsePUT.json();
    console.log(updatedData);
    console.log('User is updated successfully...');
    

    console.log('================ DELETE CALL ==========');

    //step 4: Delete the same user by using user id = userID
    const responseDELETE = await request.delete(`${BASE_URL}/${userID}`, {
        headers: myheaders,
    });

    expect(responseDELETE.status()).toBe(204);
    console.log('User is deleted successfully...');


    console.log('================ GET CALL AFTER DELETE ==========');

    // Step-5 : Get the same user by using user id - userID after deleting the same user.
    const responseGETafterDELETE = await  request.get(`${BASE_URL}/${userID}`, {
        headers: myheaders
    });

    expect(responseGETafterDELETE.status()).toBe(404);
    const dataGETafterDELETE = await responseGETafterDELETE.json();
    console.log(dataGETafterDELETE);
    console.log('Deleted User deletion message is retrieved successfully...');

});