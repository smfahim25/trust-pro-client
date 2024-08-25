const numberFormat = (number, decimals = 0, decPoint = '.') => {
    // Convert the input to a number if it's not already
    const num = parseFloat(number);

    if (!isFinite(num)) {
        return '';
    }

    // Ensure the number is formatted to the specified decimal places
    const fixedNumber = num.toFixed(decimals);

    // If there are no decimals required, return the integer part only
    if (decimals === 0) {
        return fixedNumber.split('.')[0];
    }

    // Join the integer part with the decimal part
    return fixedNumber;
};

export default numberFormat;

