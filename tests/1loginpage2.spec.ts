/*
This is test spec file and it will implement the methods from Page Class.

To impelement the allure report, follow below step:-
1. install the allure from the terminal from below command.
npm install --save-dev allure-playwright allure-commandline
2. In playwright.config.ts file, add 'allure-playwright' in array format in reporter section.
reporter: [
    ['html'],
    ['allure-playwright']
  ],
3. Generate the allure report and then open it in browser using below 2 commands.(run one after another)
npx allure generate allure-results --clean -o allure-myreportFolder            ... creates new folder from default folder 'allure-results'.
npx allure open allure-myreportFolder                                           ... opens the report in the browser.

Custom Fixture is used in below test.
 */

// import {test, expect} from '@playwright/test';      // remove this line when test and expect from fixture are imported.
import {LoginPage} from '../pages/1LoginPage1';
import { HomePage } from '../pages/2HomePage1';

import {test, expect} from '../fixtures/4baseFixtures1';

test('@sample verify valid login', async ( { hp } ) => {                  // hp is coming from Fixture now.
    // let lp: LoginPage = new LoginPage(page);                                       // object of LoginPage class.
    // await lp.goToLoginPage();
    // let hp : HomePage = await lp.doLogin('sat@sat.com', 'test1234');               // returns object of HomePage class.
    // // expect(actualPageTitle).toContain('My Account');
    // expect(await hp.isUserLoggedIn()).toBeTruthy();

    await expect(hp.page).toHaveTitle('My Account');

});


test('verify Invalid login', async ({page, baseURL})=>{                 // baseURL is coming from config.ts file
    let lp = new LoginPage(page);                                       // object of LoginPage class.
    await lp.goToLoginPage(baseURL);
    await lp.doLogin('sat1111@sat.com', 'test1222234');
    let invalidLoginMsz = await lp.getInvalidLoginMessage();
    expect(invalidLoginMsz).toContain('Warning: No match for E-Mail Address and/or Password.');
});