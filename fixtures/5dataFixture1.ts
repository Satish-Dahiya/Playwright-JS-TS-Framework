/*
This is Fixture to provide registration data from CSV file.
Ideally Different fixtures should be used for different purposes.

 */

import { test as base, expect } from '@playwright/test';       // alias name base is given to test of playwright.
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


type csvFixture = {
    regData: RegData[];
};

export const dataTest = base.extend<csvFixture>({                            // name of fixture is dataTest
    regData : async ({ }, use) => {

        const fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
        const registrationData: RegData[] = parse(fileContent, {
            columns: true,                                                                          
            skip_empty_lines: true                                                                  
        });
        await use(registrationData);
    }
});

export {expect};