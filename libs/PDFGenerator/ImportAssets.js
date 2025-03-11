const path = require('path');
const fs = require('fs');

const importAsset = (filename) => {
	const assetsPath = path.join(__dirname, "assets", filename);
	const assetsConent = fs.readFileSync(assetsPath, "utf8");
	const base64URL = `data:image/svg+xml;base64,${Buffer.from(assetsConent).toString("base64")}`;
	return base64URL;
}

module.exports = importAsset;
