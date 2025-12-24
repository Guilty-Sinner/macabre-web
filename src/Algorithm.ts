import Decimal from 'decimal.js';

// Configure Decimal precision to match Python's context
Decimal.set({ precision: 50 });

/**
 * Implements the string-number conversion algorithm.
 */
export const calculateResult = (I1: number, I2: string, I3: string): string => {
    // Step 1: Arrange I2 and I3 alternating characters
    let arranged = "";
    const maxLen = Math.max(I2.length, I3.length);

    for (let i = 0; i < maxLen; i++) {
        if (i < I2.length) arranged += I2[i];
        if (i < I3.length) arranged += I3[i];
    }

    console.log(`Arranged string: ${arranged}`);

    // Step 2: Convert arranged string to numbers (A=1, B=2, ..., Z=26)
    let numberString = "";
    const upperArranged = arranged.toUpperCase();

    for (let i = 0; i < upperArranged.length; i++) {
        const charCode = upperArranged.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) { // A-Z
            numberString += (charCode - 64).toString();
        }
    }

    if (numberString === "") return "ERROR: No valid letters to process";

    const I2I3_number = new Decimal(numberString);
    console.log(`Converted to number: ${I2I3_number}`);

    // Step 3: Divide I2I3 by I1
    if (I1 === 0) return "ERROR: Division by zero is undefined";

    const divisionResult = I2I3_number.dividedBy(I1);
    console.log(`Division result: ${divisionResult}`);

    // Step 4: Format to 10 decimal places or less
    let resultStr = divisionResult.toString();

    // Handle scientific notation if it occurs (Decimal.js might produce it for very small/large numbers)
    if (resultStr.includes('e')) {
        resultStr = divisionResult.toFixed(20); // Force standard notation
    }

    let formattedResult = "";
    if (!resultStr.includes('.')) {
        formattedResult = resultStr + ".0";
    } else {
        const parts = resultStr.split('.');
        let integerPart = parts[0];
        let decimalPart = parts[1];

        if (decimalPart.length > 10) {
            decimalPart = decimalPart.substring(0, 10);
        }
        formattedResult = `${integerPart}.${decimalPart}`;
    }
    console.log(`Formatted result: ${formattedResult}`);

    // Step 5: Rearrange decimal point (swap left and right sides)
    let rearranged = "";
    if (formattedResult.includes('.')) {
        const parts = formattedResult.split('.');
        const leftPart = parts[0];
        const rightPart = parts[1];
        // Swap: right side becomes left, left side becomes right
        rearranged = `${rightPart}.${leftPart}`;
    } else {
        rearranged = formattedResult + ".0";
    }
    console.log(`Rearranged: ${rearranged}`);

    // Step 6: Process left side of decimal (2-digit pairs to uppercase letters)
    const parts = rearranged.split('.');
    const leftDigits = parts[0];
    const rightDigits = parts.length > 1 ? parts[1] : "";

    let leftConverted = "";
    let i = 0;
    while (i < leftDigits.length) {
        if (i + 1 < leftDigits.length) {
            const twoDigitStr = leftDigits.substring(i, i + 2);
            const twoDigit = parseInt(twoDigitStr, 10);

            if (twoDigit >= 1 && twoDigit <= 26) {
                leftConverted += String.fromCharCode(64 + twoDigit); // 1 -> A
                i += 2;
            } else {
                leftConverted += twoDigitStr;
                i += 2;
            }
        } else {
            // Single digit left
            leftConverted += leftDigits[i];
            i++;
        }
    }

    // Step 7: Process right side of decimal (individual digits to lowercase letters)
    let rightConverted = "";
    for (let j = 0; j < rightDigits.length; j++) {
        const digitStr = rightDigits[j];
        if (digitStr === '0') {
            rightConverted += 'NaN';
        } else {
            // Check if it's a digit
            if (/\d/.test(digitStr)) {
                const digit = parseInt(digitStr, 10);
                if (digit >= 1 && digit <= 26) { // Technically only 1-9 possible for single digit
                    rightConverted += String.fromCharCode(96 + digit); // 1 -> a
                } else {
                    rightConverted += digitStr;
                }
            } else {
                rightConverted += digitStr;
            }
        }
    }

    const finalResult = `${leftConverted}.${rightConverted}`;
    console.log(`Final result: ${finalResult}`);

    return finalResult;
};
