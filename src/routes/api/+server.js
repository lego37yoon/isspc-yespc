
export function isSpcProduct(barcode) {
    let returnStrings = {
        manu: null,
        spc: false,
        barcode: barcode,
        color: null
    };
    
    if (
        barcode.startsWith("8804007") ||
        barcode.startsWith("880939312") ||
        barcode.startsWith("8801068")
    ) {
        returnStrings.manu = "SPC삼립";
        returnStrings.spc = true;
        returnStrings.color = "#30B3E7";
        return returnStrings;
    } else if (
        barcode.startsWith("880928863")
    ) {
        returnStrings.manu = "BR코리아";
        returnStrings.spc = true;
        returnStrings.color = "#DB5B9B";
        return returnStrings;
    } else if (
        barcode.startsWith("880969023")
    ) {
        returnStrings.manu = "파리크라상";
        returnStrings.spc = true;
        returnStrings.color = "#4063A0";
        return returnStrings;
    } else {
        return returnStrings;
    }
}