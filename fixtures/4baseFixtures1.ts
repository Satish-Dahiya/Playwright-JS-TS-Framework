/*
Hooks are used inside test spec file, but Fixtures are used at global level used by all test spec files.
Fixtures are functions that contains pre or post conditions at global level applicable for all test spec files.
4 default Fixtures provided by playwright are: page,browser,context,expect.
Custom Fixtures can also be defined by using extend() method.
use    ===> used to return the object from arrow function/fixture.
testInfo  ---> from playwright TestInfo class is used to capture test information.
testInfo parameter is used to read the metadata from the playwright.config.ts file. 
 */

import { test as base, expect } from '@playwright/test';       // alias name base is given to test of playwright.
import { HomePage } from '../pages/2HomePage1';
import { LoginPage } from '../pages/1LoginPage1';


type myFixtures = {                       // Fixture will return the Home Page Class reference.
    hp: HomePage;
}


export const test = base.extend<myFixtures>({

    hp: async ({ page, baseURL }, use, testInfo) => {

        const lp = new LoginPage(page);
        await lp.goToLoginPage(baseURL);

        const uname = testInfo.project.metadata.appUsername;       // used to read the metadata from the playwright.config.ts file.
        const pword = testInfo.project.metadata.appPassword;

        const hp = await lp.doLogin(uname, pword);
        expect(await hp.isUserLoggedIn()).toBeTruthy();

        await use(hp);                         // return the Home Page class object reference from arrow function/fixture.

    }


});

export { expect };
