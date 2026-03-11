/*
This is Utility file containing generic functions for actions on Element.
XPATH and CSS selectors are string type of locators because they are written with single or double quotes.
Semantic locators are Locator type of locators. eg. getByRole(), getByText() etc.
? with a varibale is used to handle null values. eg. text?.trim()
textContent() captues text of all the child tags together with parent tag.(dont use it much)
innerText() captures text of specific hetml tag. ( its good to use)
allInnerTexts() will capture the texts of multiple elements in an String[].
inputValue() will capture the value entered in a text field.

Run the below scrip in Console of dev tool on browser to freez the screen to inspect dynamic element.:-
setTimeout( ()=>{
    debugger;
}, 5000 );

Use 'CNTRL + SHIFT + O' for searching in a file.
waitForTimeout() from playwright.config.ts file is applicable to .spec test file and not to .ts file.

 */

import { Page, Locator } from '@playwright/test';

type flexibleLocator = string | Locator;             // XPATH and CSS are string and Semantic locators are of Locator type.

export class ElementUtil {

    private page: Page;
    private defaultTimeOut: number = 50000;

    constructor(page: Page, timeOut: number = 5000) {
        this.page = page;
        this.defaultTimeOut = timeOut;
    }


    /**
     * this method to convert the string to Locator, else it will return the semantic based locators.
     * @param locator 
     * @returns 
     */
    // Encapsulation example of private method.
    private getLocator(locator: flexibleLocator, index?: number): Locator {
        if (typeof (locator) === 'string') {
            if (index) {
                return this.page.locator(locator).nth(index);
            }
            else
                return this.page.locator(locator).first();      // for Xpath and Css
        }

        else {
            if (index) {
                return locator.nth(index);
            }
            else {
                return locator.first();                                 // for Semantic locators
            }
        }

    }


    /**
     * This method clicks on an element/locator.
     * @param locator 
     * @param options 
     */
    async click(locator: flexibleLocator, options?: { force?: boolean; timeout?: number }, index?: number): Promise<void> {
        await this.getLocator(locator, index).click({
            force: options?.force,
            timeout: options?.timeout || this.defaultTimeOut
        });
        console.log(`Clicked on element : ${locator}`);
    }

    async rightClick(locator: flexibleLocator): Promise<void> {
        await this.getLocator(locator).click({
            button: 'right',
            timeout: this.defaultTimeOut

        });
        console.log(`Right Clicked on element : ${locator}`);
    }

    async doubleClick(locator: flexibleLocator): Promise<void> {
        await this.getLocator(locator).dblclick({
            timeout: this.defaultTimeOut
        });
        console.log(`Double Clicked on element : ${locator}`);
    }

    /**
     * This method enters text in an input field.
     * @param locator 
     * @param text 
     */
    async fill(locator: flexibleLocator, text: string): Promise<void> {
        await this.getLocator(locator).fill(text, { timeout: this.defaultTimeOut });
        console.log(`Entered value : ${text} in the element : ${locator}`);
    }

    /**
     * Type text with delay ( default delay : 500 ms )
     * @param locator 
     * @param text 
     * @param delay
     */
    async type(locator: flexibleLocator, text: string, delay: number = 500): Promise<void> {
        await this.getLocator(locator).pressSequentially(text, { delay, timeout: this.defaultTimeOut });
        console.log(`Typed text as human : ${text} in the element : ${locator}`);
    }


    async clear(locator: flexibleLocator): Promise<void> {
        await this.getLocator(locator).clear({ timeout: this.defaultTimeOut });
        console.log(`Cleared the element : ${locator}`);
    }

    /**
     * Get text content of an element.
     */
    async getText(locator: flexibleLocator): Promise<null | string> {
        const text = await this.getLocator(locator).textContent({ timeout: this.defaultTimeOut });                  // not good method
        return text;
    }

    /**
     * Get inner text of an element.
     */
    async getInnerText(locator: flexibleLocator): Promise<string> {
        const text = await this.getLocator(locator).innerText({ timeout: this.defaultTimeOut });                        // good method
        return text.trim();
    }

    /**
     * Get attribute value of an element.
     */
    async getAttributeValue(locator: flexibleLocator, attributeName: string): Promise<string | null> {
        return await this.getLocator(locator).getAttribute(attributeName);

    }

    /**
     * Get input(entered) value in an element ( input text field/area).
     */
    async getInputValue(locator: flexibleLocator): Promise<string | null> {
        return await this.getLocator(locator).inputValue({ timeout: this.defaultTimeOut });
    }

    /**
     * Get all inner text contents from multiple elements.
     */
    async getAllInnerTexts(locator: flexibleLocator): Promise<Array<string>> {
        return await this.getLocator(locator).allInnerTexts();
    }


    // ========= Element Visibility and State Check====================//

    /**
     * Checks element is visible.
     * @param locator
     */
    async isVisible(locator: flexibleLocator, index?: number): Promise<boolean> {
        return await this.getLocator(locator, index).isVisible({ timeout: this.defaultTimeOut });
    }


    /**
     * Checks element is hidden.
     * @param locator
     */
    async isHidden(locator: flexibleLocator): Promise<boolean> {
        return await this.getLocator(locator).isHidden({ timeout: this.defaultTimeOut });
    }

    /**
     * Checks element is enabled.
     * @param locator
     */
    async isEnabled(locator: flexibleLocator): Promise<boolean> {
        return await this.getLocator(locator).isEnabled({ timeout: this.defaultTimeOut });
    }


    /**
     * Checks element is disabled.
     * @param locator
     */
    async isDisabled(locator: flexibleLocator): Promise<boolean> {
        return await this.getLocator(locator).isDisabled({ timeout: this.defaultTimeOut });
    }

    /**
     * Checks element is checked ( radiobutton / checkbox ).
     * @param locator
     */
    async isChecked(locator: flexibleLocator): Promise<boolean> {
        return await this.getLocator(locator).isChecked({ timeout: this.defaultTimeOut });
    }

    /**
     * Checks element is editable.
     * @param locator
     */
    async isEditable(locator: flexibleLocator): Promise<boolean> {
        return await this.getLocator(locator).isEditable({ timeout: this.defaultTimeOut });
    }

    //============== Wait Utils ================//

    /**
     * Wait for element to be visible.
     */

    async waitForElementVisible(locator: flexibleLocator, timeout: number = 5000): Promise<boolean> {
        try {
            await this.getLocator(locator).waitFor({ state: 'visible', timeout });
            console.log('Waited for element to be visible.');
            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * Wait for element to be attached to DOM.
     */

    async waitForElementAttached(locator: flexibleLocator, timeout: number = 5000): Promise<boolean> {
        try {
            await this.getLocator(locator).waitFor({ state: 'attached', timeout });
            console.log('Waited for element to be attached to DOM.');
            return true;
        }
        catch {
            return false;
        }
    }

    /**
     * wait for page load state
     */
    async waitForPageLoad(state: 'load' | 'domcontentloaded' | 'networkidle' = 'load'): Promise<void> {
        await this.page.waitForLoadState(state);
        console.log(`waited for page load state: ${state}`);
    }

    /**
     * wait for specific timeout (static, not dynamic)
     */
    async sleep(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
        console.log(`waited for ${timeout} milliseconds.`);
    }


    //============ Drop Down Utils / Select based Dropdowns ========//

    async selectByText(locator: flexibleLocator, text: string) {
        await this.getLocator(locator).selectOption({ label: text }, { timeout: this.defaultTimeOut });
        console.log(`Selected the option : ${text} from dropdown : ${locator}`);
    }

    async selectByValue(locator: flexibleLocator, valueOpted: string) {
        await this.getLocator(locator).selectOption({ value: valueOpted }, { timeout: this.defaultTimeOut });
        console.log(`Selected the option : ${valueOpted} from dropdown : ${locator}`);
    }

    async selectByIndex(locator: flexibleLocator, indexOpted: number) {
        await this.getLocator(locator).selectOption({ index: indexOpted }, { timeout: this.defaultTimeOut });
        console.log(`Selected the option : ${indexOpted} from dropdown : ${locator}`);
    }

}