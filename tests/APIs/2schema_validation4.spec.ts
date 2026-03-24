/*
To validate a json schema, install the 'ajv' library using 'npm install ajv' from VSC terminal.
We can have the extra paramaters in SCHEMA, but less parameters will give error.
Go to 'https://transform.tools/json-to-json-schema' to generate the sample schema of our json.
Create a 'schemas' folder in root project and create a .json file in it.
Now copy the required JSON Schema ( generated from https://transform.tools/json-to-json-schema site ) in above created .json file.

Steps to validate a json schema:-
1. set up ajv
    const myAjv = new Ajv();
2. load the json schema files
    const myUserSchema = JSON.parse(fs.readFileSync(path.resolve('./schemas/getusersschema.json'), 'utf-8'));
3. validate the json schema using compile() method.
    const validatedSchema = myAjv.compile(myUserSchema);
    const isValid = validatedSchema(responseData);
   
Errors can be captured in invalid schema using 'errors' property as shown below:-
validatedSchema.errors

 */

import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import fs from 'fs';
import path from 'path';

const TOKEN = '63f49875bca23d116747370c615f55ccd9364355e311270f0f6713830eb2b58c';     // Generate the Token from gorest.co.in website

// set up ajv for json schema validation
const myAjv = new Ajv();

// load the json schema files
const getUserSchema = JSON.parse(fs.readFileSync(path.resolve('./schemas/getusersschema.json'), 'utf-8'));          // Converts a (JSON) string into an object.
// JSON.stringify()                                                                                                 // Converts a JavaScript value to a (JSON) string.

test('GET - fetch all users', async ({ request }) => {

    const response = await request.get('https://gorest.co.in/public/v2/users', {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        }
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    // console.log(data);

    // validate the json schema
    const validatedSchema = myAjv.compile(getUserSchema);                // compile() will return a function
    const isValid = validatedSchema(data);

    if(!isValid) {
            console.log('schema erros are : ' ,  validatedSchema.errors);         // to print schema validation error (use comma, dont use + to concatenate json error body.)
    }

    expect(isValid).toBe(true);
    console.log('API response schema is valaidated -- PASS.');

});