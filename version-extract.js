const fs = require('fs');
const fsPromises = fs.promises;
const xml2js = require('xml2js');
const xpath = require('xml2js-xpath');

module.exports = (function() {
    async function _extractFromString(str) {
        const parser = new xml2js.Parser();
        const parsedXml = await parser.parseStringPromise(str);

        let versionNodes = xpath.find(parsedXml, "//Version");
        if (versionNodes.length == 0) {
            console.error("Failed to find version.");
            return null;
        }

        return versionNodes[0];
    }

    async function _extractFromFile(filePath) {
        const rawXml = await fsPromises.readFile(filePath);

        return await _extractFromString(rawXml);
    }

    return {
        extractFromString: _extractFromString,
        extractFromFile: _extractFromFile
    }
})();