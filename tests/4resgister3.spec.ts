/*
This is test spec file and it will implement the methods from Page Class.

To read the test data from CSV file, first install the 'npm install csv-parse' from the terminal in cmd mode. Maintain a CSV file with data under data folder.
After this a new dependency will be added in package.json file under dependencies section.
To read data from CSV use below import and code :-
import {parse} from 'csv-parse/sync';

let fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
let registrationData: RegData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});

We can maintain different playwright.config.ts files for different environments(qa,stage,prod etc).
*/
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/1LoginPage1';
import { RegisterPage } from '../pages/4RegisterPage2';
import fs from 'fs';
import { parse } from 'csv-parse/sync';


// schema or type of the registration data fields
type RegData = {
    firstname: string,
    lastname: string,
    email: string,                           // remove it if email is read from random function. Remove it from CSV file as well.
    telephone: string,
    password: string,
    subsribeNewsletter: string

};

// let registrationData: RegData[] = JSON.parse( fs.readFileSync('./data/register.json', 'utf-8') );     // parse() Converts JSON string into an object.

let fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
let registrationData: RegData[] = parse(fileContent, {
    columns: true,                                                                          // if column headers are present in the csv file.
    skip_empty_lines: true                                                                  // to skip empty data lines from the csv file.
});


for (let user of registrationData) {

    test(`Verify user is able to Register: ${user.firstname}`, async ({ page, baseURL }) => {

        let lp = new LoginPage(page);
        await lp.goToLoginPage(baseURL);
        let regPg: RegisterPage = await lp.navigateToRegisterPage();
        let isUserRegistered: boolean = await regPg.registerUser(
            user.firstname, user.lastname, getRandomEmail(), user.telephone, user.password, user.subsribeNewsletter);

        expect(isUserRegistered).toBeTruthy();

    });

}

// to generate the random dynamic email for above code
// static email from CSV file is not read in this case.
function getRandomEmail(): string {
    let randomValue = Math.random().toString(36).substring(2, 9);
    return `auto_${randomValue}@skd.com`;
}



// // This test case is when single user is created using data explicitly.
// test('Verify user is able to Register.', async ( {page, baseURL}) => {                       // baseURL is coming from playwright.config.ts file/

//     let lp = new LoginPage(page);
//     await lp.goToLoginPage(baseURL);
//     let regPg: RegisterPage = await lp.navigateToRegisterPage();
//     let isUserRegistered: boolean = await regPg.registerUser('ram', 'manohar', 'rm1@sat.com', '7777777', 'test1234', 'Yes');
//     expect(isUserRegistered).toBeTruthy();

// } );