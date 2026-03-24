/*
Network calls can be monitored using listeners.
2 listeners are created. one for with event 'request' and another with event 'response'.
These listeners run in the background on every action on the web page.
Listeners are created as below:-

page.on('request', async req => {
        console.log('Outgoing Request : ' , req.method(), req.url() );
    } );

page.on('response', async res => {
        console.log('Incoming Response : ' , res.status() , res.url() );
   } );

HTPS Methods ( GET, POST, PUT etc.), response status and url are captured/monitored after every action performed on the webpage.
 */

import { test } from '@playwright/test';


test('Networking Calls Monitoring Test.', async ({ page }) => {

    // Event listener for request event.
    page.on('request', async req => {
        console.log('Outgoing Request : ', req.method(), req.url());
    });

    // Event listener for response event.
    page.on('response', async res => {
        console.log('Incoming Response : ', res.status(), res.url());
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');
    await page.getByRole('link', { name: 'iPhone' }).first().click();

});