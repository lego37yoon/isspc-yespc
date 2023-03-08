import { error, json } from "@sveltejs/kit"
import manufacturers from "../data/manufacturers.json";
import products from "../data/products.json";

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
    /*
        response list
            404: Data Not Found
            400: Not Supported Data Type
            411: Short Data
            200: OK
    */
    const barcode = url.searchParams.get('barcode');
    const returnStrings = {
        resultCode: 404,
        manu: null,
        spc: false,
        barcode: barcode,
        color: null,
        product: null
    };

    if (!barcode) {
        throw error("400", "Barcode data not received. Please check your request.");
    }

    if (barcode.length != 13 && barcode.length != 18) {
        returnStrings.resultCode = 411;
        return json(returnStrings);
    }
    
    if (!barcode.startsWith("880")) {
        returnStrings.resultCode = 400;
        return json(returnStrings);
    }

    for(const index of Object.keys(manufacturers.indexes)) {
        if(barcode.startsWith(index)) {
            const manu = manufacturers[manufacturers.indexes[index]];
            returnStrings.manu = manu.name;
            returnStrings.spc = manu.spc;
            returnStrings.color = manu.color;
            returnStrings.resultCode = 200;
        }
    }

    for(const index of products.list) {
        if(barcode === index.barcode && !index.length) {
            returnStrings.product = index.name;
            if (!returnStrings.spc) {
                returnStrings.spc = true;
                returnStrings.manu = manufacturers[index.type].name;
                returnStrings.color = manufacturers[index.type].color;
                returnStrings.resultCode = 200;
            }
        } else if (barcode.startsWith(index.barcode) && barcode.length == 18) {
            returnStrings.product = index.name;
            if (!returnStrings.spc) {
                returnStrings.spc = true;
                returnStrings.manu = manufacturers[index.type].name;
                returnStrings.color = manufacturers[index.type].color;
                returnStrings.resultCode = 200;
            }
        }
    }

    return json(returnStrings);
}