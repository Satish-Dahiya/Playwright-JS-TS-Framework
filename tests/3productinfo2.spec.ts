/*
This is test spec file and it will implement the methods from Page Class.
Soft Assertion is used when many assertions are used in a test.

Map is used to hold data in key-value pairs.
private readonly myMap = new Map<string, string | number | null>();    ...to create a Map
myMap.set(key, value) is used to set/add key-value pair in a map.
myMap.get(key) is used to get the 'value' of a key from key-value pair in a map.

We can customise our own shortcut scripts under 'scripts' section in package.json file as shown below:-

scripts": {
    "test": "npx playwright test",
    "allure:generate": "npx allure generate allure-results --clean -o allure-myreportFolder",
    "allure-open": "npx allure open allure-myreportFolder"
  }
Run the above scripts in terminal using 'npm run scriptname'.

Custom Fixture is used in below test.
 */

// import { test, expect } from '@playwright/test';      // remove this line when test and expect from fixture are imported.
// import { LoginPage } from '../pages/1LoginPage1';
// import { HomePage } from '../pages/2HomePage1';
import { ResultsPage } from '../pages/2ResultsPage2';
import { ProductInfoPage } from '../pages/3ProductInfoPage1';

import {test, expect} from '../fixtures/4baseFixtures1';


const searchData = [
    { searchkey: 'macbook', productname: 'MacBook Pro', imagescount: 4 },
    { searchkey: 'macbook', productname: 'MacBook Air', imagescount: 4 },
    { searchkey: 'samsung', productname: 'Samsung Galaxy Tab 10.1', imagescount: 7 }
];


for (const product of searchData) {
    test(`verify product Header for ${product.productname} `, async ({ hp }) => {               // hp is coming from Fixture now.

        // let lp: LoginPage = new LoginPage(page);
        // await lp.goToLoginPage();
        // let hp: HomePage = await lp.doLogin('sat@sat.com', 'test1234');
        const rp: ResultsPage = await hp.doSearch(product.searchkey);
        const pi: ProductInfoPage = await rp.selectProduct(product.productname);
        expect(await pi.getProductHeader()).toBe(product.productname);
    });

}

for (const product of searchData) {
    test(`verify product Images Count for ${product.productname} : ${product.imagescount} `, async ({ hp }) => {            // hp is coming from Fixture now.

        // let lp: LoginPage = new LoginPage(page);
        // await lp.goToLoginPage();
        // let hp: HomePage = await lp.doLogin('sat@sat.com', 'test1234');
        const rp: ResultsPage = await hp.doSearch(product.searchkey);
        const pi: ProductInfoPage = await rp.selectProduct(product.productname);
        expect(await pi.getProductImagesCount()).toBe(product.imagescount);
    });

}



test('verify product MetaData ', async ({ hp }) => {                            // hp is coming from Fixture now.

    // let lp: LoginPage = new LoginPage(page);
    // await lp.goToLoginPage();
    // let hp: HomePage = await lp.doLogin('sat@sat.com', 'test1234');
    const rp: ResultsPage = await hp.doSearch('macbook');
    const pi: ProductInfoPage = await rp.selectProduct('MacBook Pro');
    const actualProductFullDetails: Map<string, string | number | null> = await pi.getProductDetails();      // returns map

    expect.soft(actualProductFullDetails.get('header')).toBe('MacBook Pro');      // soft assertion to not stop execution if any assertion fails.
    expect.soft(actualProductFullDetails.get('Brand')).toBe('Apple');             // retrieves value of a key from map.
    expect.soft(actualProductFullDetails.get('Product Code')).toBe('Product 18');
    expect.soft(actualProductFullDetails.get('Reward Points')).toBe('800');        // enter 800 as string(not integer)
    expect.soft(actualProductFullDetails.get('Availability')).toBe('Out Of Stock');
});


test('verify product Pricing ', async ({ hp }) => {                             // hp is coming from Fixture now.

    // let lp: LoginPage = new LoginPage(page);
    // await lp.goToLoginPage();
    // let hp: HomePage = await lp.doLogin('sat@sat.com', 'test1234');
    const rp: ResultsPage = await hp.doSearch('macbook');
    const pi: ProductInfoPage = await rp.selectProduct('MacBook Pro');
    const actualProductFullDetails: Map<string, string | number | null> = await pi.getProductDetails();

    expect.soft(actualProductFullDetails.get('header')).toBe('MacBook Pro');
    expect.soft(actualProductFullDetails.get('price')).toBe('$2,000.00');
    expect.soft(actualProductFullDetails.get('extaxprice')).toBe('$2,000.00');
});