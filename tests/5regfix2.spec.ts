/*
LImitation of using Fixtures with CSV file for parameterisation:-
for() loop cannot be used inside test() method to create multiple users using CSV file data.

test() can be used inside test.describe(), but test() cannot be used inside another test() method.
Comment the below code as it cannot be run and Do not use Fixtures with CSV files.
*/





// import test from '@playwright/test';
// import { dataTest, expect } from '../fixtures/5dataFixture';


// function getRandomEmail(): string {
//     let randomValue = Math.random().toString(36).substring(2, 9);
//     return `auto_${randomValue}@skd.com`;
// }


// test('User registration using CSV file.', async ({ regData, page, baseURL }) => {

//     for (let user of regData) {

//     }



// })