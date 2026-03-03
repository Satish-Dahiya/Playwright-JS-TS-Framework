/*
Its page class for Login.
It will contain only private variables,constructor and actions/methods.
Page class will not contain any assertions. ( test spec file/case will contain it.)
Import ElementUtil class here from ElementUtil.ts file.

Framework has following components:-
Pages(POM), Fixtures, Test Specs, Utils/Helpers, Test Data, Configuration files, Test Execution,...
...Reports and Logging, CICD(Jenkins/Docker/GitHub Actions), Remote Execution(BrowserStack), Version Control(GIT GitHub).

Add baseURL in the playwright.config.ts file under 'use' section. Its coming from Playwright.
baseURL is defined in playwright.config.ts file at global level and is of type 'string|undefined'.
 */

import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';
import { HomePage } from '../pages/2HomePage1';
import { RegisterPage } from '../pages/4RegisterPage2';

export class LoginPage {

    //1. page locators/objects/Object repository
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn : Locator;
    private readonly warningMsz: Locator;
    private readonly resgisterLink: Locator;

    //2. page class constructor
    constructor(page:Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password= page.getByRole('textbox', { name: 'Password' });
        this.loginBtn= page.locator(`input[type="submit"][value="Login"]`);
        this.warningMsz= page.locator('.alert.alert-danger.alert-dismissible');
        this.resgisterLink= page.getByText('Register', {exact:true});
    }

    //3. page actions/methods
    /**
     * Navigate to login page.
     */
    async goToLoginPage(baseURL: string | undefined) {                  // baseURL is defined in playwright.config.ts file at global level.
        await this.page.goto(baseURL + `?route=account/login`);
    }

    /**
     * Login to app using username/password
     * @param email
     * @param password 
     * @returns 
     */
    async doLogin(email: string, password: string): Promise<HomePage> {
        await this.eleUtil.fill(this.emailId, email);
        await this.eleUtil.fill(this.password, password);
        await this.eleUtil.click(this.loginBtn , {force: true, timeout:7000});
        // return await this.page.title();       // comment or remove this like to implement page chaining model. 
        return new HomePage(this.page);
        
    }

    /**
     * Get the error message in case of Invalid Login.
     * @returns 
     */
    async getInvalidLoginMessage() : Promise<string | null> {
        const errorMsz = await this.eleUtil.getText(this.warningMsz);
        console.log(`Invalid Login Error Message: ${errorMsz}`);
        return errorMsz;
    }


    async navigateToRegisterPage(): Promise<RegisterPage> {
        await this.eleUtil.click(this.resgisterLink, {force: true}, 1);
        return new RegisterPage(this.page);
    }


}