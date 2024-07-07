
function findRepeatedPhrases(text) {
    const minFameLength = 2
    const maxFrameLength = 6

    let currentSuffix = "";
    let i = minFameLength;
    let eof = minFameLength;
    const repeatedPhrases = {};

    while (i < text.length) {
        scannedText = text.slice(0, i);
        
        currentSuffix = text.slice(i - 1, i + 1);
        eof = i + 1;
        while (scannedText.includes(currentSuffix) && currentSuffix.length <= maxFrameLength && eof<=text.length) {
            repeatedPhrases[text.indexOf(currentSuffix)] = currentSuffix;
            currentSuffix = text.slice(i - 1, ++eof);
        }
        i = Math.max(i + minFameLength, eof);
    }
    return Object.values(repeatedPhrases);
}



function parseAndHighlight(htmlDocument) {
    var paragraphs = document.getElementsByTagName("p");
    const paragraphsWithoutAnchors = [];
    for (const paragraph of paragraphs) {
        if (!paragraph.querySelector("a")) {
            paragraphsWithoutAnchors.push(paragraph);
        }
    }

    paragraphs = paragraphsWithoutAnchors;
    paragraphs.splice(0,1)
    for (const paragraph of paragraphs) {
        const text = paragraph.textContent;
        const repeatedPhrases = findRepeatedPhrases(text);

        for (const phrase of repeatedPhrases) {
            paragraph.innerHTML = paragraph.innerHTML.replace(
                new RegExp(phrase, "g"),
                `<span class="highlight">${phrase}</span>`
            );
        }
    }
}


// Add CSS styles for highlighting repeated phrases
const styleElement = document.createElement("style");
styleElement.innerHTML = `
    .highlight {
      background-color: yellow;
    }
  `;
document.head.appendChild(styleElement);

// Call the parsing and highlighting function
parseAndHighlight(document);
