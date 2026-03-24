/*
This test is to parse complex json using jsonpath-plus library.
'jsonpath-plus' library is used to parse the complex jsons. ( POJO classes are not used here .)
Go to https://www.npmjs.com/package/jsonpath-plus
Install the 'jsonpath-plus' library from npm package using 'npm install jsonpath-plus' from terminal.(gets added to package.json)

JSONPath() method of 'jsonpath-plus' library is used to parse the complex json as shown below: 
JSONPath( {path: 'myJsonPath' , json: myJsonResponse} )
JSONPath({ path: '$[*].sampleeeee', json: responsedataaaaa });


 */

import { test } from '@playwright/test';
import { JSONPath } from 'jsonpath-plus';

const BASE_URL = 'https://fakestoreapi.com/products';          // use this url to get sample product json body/response which needs to be parsed

const headers = { 
    'Content-Type' : 'application/json',                      // type of request body sent
    'Accept' : 'application/json'                             // type of response body received
};


test('GET-- all the products @api', async ({ request }) => {

    const response = await request.get(BASE_URL, { headers: headers });
    const data = await response.json();
    console.log(data);

    console.log('================');
    // get all titles
    const titles = JSONPath({ path: '$[*].title', json: data });                      // JSONPath() to parse the complex json.
    console.log(titles);

    console.log('================');
    // get all ids
    const IDs = JSONPath({ path: '$[*].id', json: data });
    console.log(IDs);

    // get all rates
    console.log('================');
    const rates = JSONPath({ path: '$[*].rating.rate', json: data });
    console.log(rates);

    //get all the products titles where category = 'jewelery'
    //$[?(@.category == 'jewelery')].title
    console.log('================');
    // eslint-disable-next-line quotes
    const jewelTitles = JSONPath({ path: `$[?(@.category == 'jewelery')].title`, json: data });             // use back tick
    console.log(jewelTitles);

});