const SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

export const formatNumber = (number: number, precision=2) => {

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(precision) + suffix;
}

export const splitByCaps = string => string.match(/[A-Z][a-z]+|[0-9]+/g).join(" ")