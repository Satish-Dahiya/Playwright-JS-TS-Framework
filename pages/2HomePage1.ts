/*
Its page class for Home page.
It will contain only private variables,constructor and actions/methods.
Page class will not contain any assertions. ( test spec file/case will contain it.)
Import ElementUtil class here from ElementUtil.ts file.
 */

import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';
import { LoginPage } from '../pages/1LoginPage1';
import { ResultsPage } from '../pages/2ResultsPage2';

export class HomePage {

    //1. page locators/objects/Object repository
    readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly search: Locator;
    private readonly searchIcon: Locator;
    private readonly logoutLink: Locator;
    private readonly loginLink: Locator;
    

    //2. page class constructor
    constructor(page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.search = page.getByRole('textbox', { name: 'Search' });
        this.searchIcon = page.locator('#search > span.input-group-btn > button.btn');
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.loginLink = page.getByRole('link', { name: 'Login' });        
    }

    //3. page actions/methods
    async isUserLoggedIn() : Promise<boolean> {
        return await this.eleUtil.isVisible(this.logoutLink, 0);
    }

    async doLogout(): Promise<LoginPage> {
        await this.eleUtil.click(this.logoutLink, {timeout: 5000}, 1);
        await this.eleUtil.click(this.loginLink, {timeout: 5000}, 1);
        return new LoginPage(this.page);
    }

    async doSearch(searchKey: string): Promise<ResultsPage> {
        console.log(`Searched key is: ${searchKey}`);
        await this.eleUtil.fill(this.search, searchKey);
        await this.eleUtil.click(this.searchIcon);
        return new ResultsPage(this.page);


    }








}