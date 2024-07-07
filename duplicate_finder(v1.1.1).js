const hitList = {}

function findRepeatedPhrases(text, minFameLength, maxFrameLength) {

    const breackChars = ['。', '，', '：', '；', '！', '“', '”', "《", "》"]
    const filterList = {
        "修炼": "cultivation",
        "我们": "us",
        "层次": "level",
        "这个": "this",
        "一个": "one",
        "就是": "that is",
        "气功": "qigong",
        "宇宙": "universe",
        "的东西": "s things",
        "东西": "thing",
        "人的": "human",
        "身体": "body",
        "常人": "ordinary people",
        "你的": "your",
        "什么": "what"
    }

    const repeatedPhrases = {};
    let currentSuffix = "";
    let scannedText = "";
    let i = minFameLength;
    let eof = minFameLength; //end of frame index

    while (i < text.length) {

        findNewScannedAndSuffix();

        handleBreakChars()

        while (canExpandFrame()) {
            if (!(currentSuffix in filterList)) {
                repeatedPhrases[text.indexOf(currentSuffix)] = currentSuffix;
                addToHitlist(currentSuffix)
            }
            currentSuffix = text.slice(i - 1, ++eof);
        }
        i = Math.max(i + minFameLength, eof - 1);
    }
    return Object.values(repeatedPhrases);

    function canExpandFrame() {
        return !breackChars.includes(text[eof - 1]) &&
            currentSuffix.length > 0 &&
            scannedText.includes(currentSuffix) &&
            currentSuffix.length <= maxFrameLength &&
            eof <= text.length;
    }

    function findNewScannedAndSuffix() {
        scannedText = text.slice(0, i);
        eof = i + (minFameLength - 1);
        currentSuffix = text.slice(i - 1, Math.min(text.length, eof));
    }

    function addToHitlist() {
        (currentSuffix in hitList) ? hitList[currentSuffix]++ : hitList[currentSuffix] = 2
    }

    function handleBreakChars() {
        let lastBreackIndex = -1
        const hasBreackChar = breackChars.some(ch => {
            if (currentSuffix.includes(ch)) {
                lastBreackIndex = Math.max(lastBreackIndex, currentSuffix.lastIndexOf(ch))
                return true
            }
            return false
        })
        if (hasBreackChar) {
            i = i + lastBreackIndex + 1
            findNewScannedAndSuffix()
        }
    }
}


function parseAndHighlight(htmlDocument) {
    const minFameLength = 2
    const maxFrameLength = 6
    const colorOfLengths = { 2: "green", 3: "blue", 4: "purple", 5: "peach", 6: "yellow" }

    var paragraphs = document.getElementsByTagName("p");
    const paragraphsWithoutAnchors = [];
    for (const paragraph of paragraphs) {
        if (!paragraph.querySelector("a")) {
            paragraphsWithoutAnchors.push(paragraph);
        }
    }

    paragraphs = paragraphsWithoutAnchors;
    paragraphs.splice(0, 1)
    for (const paragraph of paragraphs) {
        const text = paragraph.textContent;

        const repeatedPhrases = findRepeatedPhrases(text, minFameLength, maxFrameLength);
        repeatedPhrases.sort((a, b) => b.length - a.length)
        for (const phrase of repeatedPhrases) {
            const color = colorOfLengths[phrase.length]
            paragraph.innerHTML = paragraph.innerHTML.replace(
                new RegExp(phrase, "g"),
                `<span class="${color}">${phrase}</span>`
            );
        }
    }
}


// Add CSS styles for highlighting repeated phrases
const styleElement = document.createElement("style");
styleElement.innerHTML = `
    .peach{
            background-color: #FFF0DB;
    }

    .purple{
            background-color: #EBEAFF;
    }

    .blue{
            background-color: #d3eeff;
    }

    .green{
        background-color: #E6F6D1;
    }

    .yellow {
      background-color: yellow;
    }
  `;
document.head.appendChild(styleElement);

// Call the parsing and highlighting function
parseAndHighlight(document);

//sort the hitlist (top hits at the top)
console.log(Object.entries(hitList).sort((a, b) => b[1] - a[1]));

