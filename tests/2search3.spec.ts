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

There are 3 Pages that are used in this test spec file.
Page Chaining Model: Method of 1 Page class will return the object of next Page class.
This is Fluent way of writing the test cases using Page Chaining Model.(TDD)
POM
Default number of workers in Playwright Test is 6.

Custom Fixture is used in below test.

 */


// import { test, expect } from '@playwright/test';    // remove this line when test and expect from fixture are imported.
import { LoginPage } from '../pages/1LoginPage1';
import { HomePage } from '../pages/2HomePage1';
import { ResultsPage } from '../pages/2ResultsPage2';

import {test, expect} from '../fixtures/4baseFixtures1';

// data provider for product search key and results count. [data provider as Array]
let searchData = [
    { searchKey: 'macbook', resultsCount: 3 },
    { searchKey: 'samsung', resultsCount: 2 },
    { searchKey: 'canon', resultsCount: 1 },
    { searchKey: 'imac', resultsCount: 1 },
    { searchKey: 'sat', resultsCount: 0 },
];



// this test will use the above test data Array.
for (let product of searchData) {

    test(`verify product search : ${product.searchKey}`, async ({ hp }) => {           // hp is coming from Fixture now.

        // let lp: LoginPage = new LoginPage(page);
        // await lp.goToLoginPage();
        // let hp: HomePage = await lp.doLogin('sat@sat.com', 'test1234');
        let rp: ResultsPage = await hp.doSearch(product.searchKey);
        expect(await rp.getSearchResultsCount()).toBe(product.resultsCount);
    });


}