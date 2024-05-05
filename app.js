// Function to convert a given number into words
function numberToWords(n) {
    // Arrays to hold words for single-digit, double-digit, and below-hundred numbers
    const single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n === 0) return 'Zero';

    // Recursive function to translate the number into words
    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[(n - n % 10) / 10 - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.trunc(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(parseInt(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(parseInt(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(parseInt(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }

    // Check if the number is negative and add "minus" before the result
    if (n < 0) {
        return 'Minus ' + translate(Math.abs(n)).trim();
    } else {
        return translate(n).trim();
    }
}

// Function to convert all numbers in the page to words
function convertNumbersToWords() {
    // Find all text nodes on the page
    const textNodes = document.evaluate('//text()', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    // Loop through each text node
    for (let i = 0; i < textNodes.snapshotLength; i++) {
        const currentNode = textNodes.snapshotItem(i);

        // Split text node into smaller parts separated by numbers
        const parts = currentNode.textContent.split(/(-?\d+)/g);

        // Create a document fragment to hold the processed content
        const fragment = document.createDocumentFragment();

        // Process each part
        parts.forEach(part => {
            if (/^-?\d+$/.test(part)) {
                const wordRepresentation = numberToWords(parseInt(part));
                // Create a <b> element to wrap the number and its word representation
                const boldElement = document.createElement('b');
                boldElement.textContent = `${part} (${wordRepresentation})`;
                fragment.appendChild(boldElement);
            } else {
                // Create a text node for non-numeric parts
                fragment.appendChild(document.createTextNode(part));
            }
        });

        // Replace the original text node with the processed content
        currentNode.parentNode.replaceChild(fragment, currentNode);
    }
}

// Call the function to convert numbers to words when the page is loaded
window.onload = convertNumbersToWords;
