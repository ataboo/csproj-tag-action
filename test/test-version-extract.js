const assert = require('assert');
const versionExtract = require('../version-extract');

describe('Test finding the version tag', function() {
    it('Test finding version in raw string XML', async function() {
        const rawXml = `<tag1><tag2><Version>1.2.3</Version></tag2></tag1>`;
        const version = await versionExtract.extractFromString(rawXml);
        
        assert.equal(version, '1.2.3');
    });

    it('Test finding version in csproj file', async function() {
        const filePath = __dirname+'/testproj.xml';
        const version = await versionExtract.extractFromFile(filePath);

        assert.equal(version, '1.2.3');
    });
});