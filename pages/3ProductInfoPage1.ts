/*
Its page class for ProductInfo page.
It will contain only private variables,constructor and actions/methods.
Page class will not contain any assertions. ( test spec file/case will contain it.)
Import ElementUtil class here from ElementUtil.ts file.

Map is used to hold data in key-value pairs.
private readonly myMap = new Map<string, string | number | null>();    ...to create a Map
myMap.set(key, value) is used to set/add key-value pair in a map.
myMap.get(key) is used to get the 'value' of a key from key-value pair in a map.

To print key-value of Map, use below :
for (let [key, value] of myMap) {
            console.log(key + '::::' + value);
        }
 */

import { Locator, Page } from '@playwright/test';
import { ElementUtil } from '../utils/ElementUtil';

export class ProductInfoPage {

    //1. page locators/objects/Object repository 
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly header: Locator;
    private readonly imageCount: Locator;          // returns an array of locators.
    private readonly productMetaData: Locator;
    private readonly productPriceData: Locator;

    private readonly productMap = new Map<string, string | number | null>();             // empty map to hold key-value pairs.


    //2. page class constructor ( only static locators are written here and not the dynamic locators)
    constructor(page: Page) {
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.header = page.locator('h1');
        this.imageCount = page.locator('div#content img');
        this.productMetaData = page.locator(`(//div[@id='content']//ul[@class='list-unstyled'])[1]/li`);  // locator captures metadata in key-value pairs.
        this.productPriceData = page.locator(`(//div[@id='content']//ul[@class='list-unstyled'])[2]/li`);
    }

    //3. page actions/methods
    async getProductHeader(): Promise<string> {
        let header = await this.eleUtil.getInnerText(this.header);
        console.log('Product Header is : ' + header);
        return header.trim();
    }

    async getProductImagesCount(): Promise<number> {
        await this.eleUtil.waitForElementVisible(this.imageCount);
        let imagesCount = await this.imageCount.count();
        console.log(`Total Number of images for Product: ${await this.getProductHeader()} is ==> ${imagesCount}`);     // one method calls another method internally.
        return imagesCount;
    }


    /**
     * 
     * @returns This method is returning complete product information: header, images count, meta data & pricing data.
     */
    async getProductDetails() : Promise<Map<string, string | number | null>> {                    // public method calls other private methods internally.
        this.productMap.set('header', await this.getProductHeader());                        // we can add our own custom key eg. header
        this.productMap.set('imagescount', await this.getProductImagesCount());
        await this.getProductMetaData();
        await this.getProductPricingData();

        console.log(`Full product details of the product: ${await this.getProductHeader()}`);
        this.printProductDetails();
        return this.productMap;
    }

    private async printProductDetails() {                          // method to print map.
        for (let [key, value] of this.productMap) {
            console.log(key + '::::' + value);
        }
    }


    // Brand: Apple    --->> key-value pair
    // Product Code: Product 18
    // Reward Points: 800
    // Availability: Out Of Stock
    private async getProductMetaData() {
        let productMetaData: string[] = await this.productMetaData.allInnerTexts();                      // captures all innextexts in key-value pair.
        for (let meta of productMetaData) {
            let metadata: string[] = meta.split(':');
            let metaKey = metadata[0].trim();
            let metaValue = metadata[1].trim();

            this.productMap.set(metaKey, metaValue);                // adds key-value to empty map.
        }
    }


    // $2,000.00
    // Ex Tax: $2,000.00
    private async getProductPricingData() {
        let productPricing: string[] = await this.productPriceData.allInnerTexts();
        let productPrice = productPricing[0].trim();
        let productExTax = productPricing[1].split(':')[1].trim();

        this.productMap.set('price', productPrice);         // we can add our own custom key
        this.productMap.set('extaxprice', productExTax);
    }



}