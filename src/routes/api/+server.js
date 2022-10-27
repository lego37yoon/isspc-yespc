import manufacturers from "./manufacturers.json";

export function isSpcProduct(barcode) {
    const returnStrings = {
        manu: null,
        spc: false,
        barcode: barcode,
        color: null
    };

    for(const index of Object.keys(manufacturers.indexes)) {
        if(barcode.startsWith(index)) {
            const manu = manufacturers[manufacturers.indexes[index]];
            returnStrings.manu = manu.name;
            returnStrings.spc = manu.spc;
            returnStrings.color = manu.color;
            break;
        }
    }

    return returnStrings;
}