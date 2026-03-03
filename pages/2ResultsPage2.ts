/*
Its page class for Results page.
It will contain only private variables,constructor and actions/methods.
Page class will not contain any assertions. ( test spec file/case will contain it.)
Import ElementUtil class here from ElementUtil.ts file.
 */

import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';
import { LoginPage } from '../pages/1LoginPage1';
import {ProductInfoPage} from '../pages/3ProductInfoPage1';

export class ResultsPage {

    //1. page locators/objects/Object repository 
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly results: Locator;
    

    //2. page class constructor ( only static locators are written here and not the dynamic locators)
    constructor(page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.results = page.locator('.product-thumb');                      // array of all searched item's locators
    }

    //3. page actions/methods
    async getSearchResultsCount(): Promise<number> {
        return await this.results.count();
    }

    async selectProduct(productName: string) {
        console.log('=====product selected is===:' + productName);
        await this.eleUtil.click(this.page.getByRole('link', { name: `${productName}` }));     // dynamic locators are written in method and not in constructor.
        return new ProductInfoPage(this.page);
    }



}