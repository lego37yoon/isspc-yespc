import manufacturers from "./manufacturers.json";
import products from "./products.json";

export function isSpcProduct(barcode) {
    /*
        resultCode
            404: Data Not Found
            400: Not Supported Data Type
            410: No data
            411: Short Data
            200: OK
    */
    const returnStrings = {
        resultCode: 404,
        manu: null,
        spc: false,
        barcode: barcode,
        color: null
    };

    if (barcode.length != 13) {
        returnStrings.resultCode = 411;
        return returnStrings;
    }
    
    if (!barcode.startsWith("880")) {
        returnStrings.resultCode = 400;
        return returnStrings;
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

    return returnStrings;
}