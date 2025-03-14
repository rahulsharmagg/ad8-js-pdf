const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const importAsset = require('./ImportAssets');

class QuestionTemplate {
    async createPDF(data) {
        let configLaunch = {
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        };
        const browser = await puppeteer.launch(configLaunch);
        const page = await browser.newPage();

        // Load the EJS template
        const templatePath = path.join(__dirname, 'templates');

        const questionPath = path.join(templatePath, 'question.ejs');
        const headerPath = path.join(templatePath, 'header.ejs');
        const footerPath = path.join(templatePath, 'footer.ejs');

        const template = fs.readFileSync(questionPath, 'utf-8');
        const headerContent = fs.readFileSync(headerPath, 'utf-8');
        const footerContent = fs.readFileSync(footerPath, 'utf-8');

        const icon = importAsset('pdf-asset-2.svg');
        const glyph = importAsset('pdf-asset-7.svg');

        data.svg = {
            glyph
        }

        // Render the HTML content with dynamic data
        const htmlContent = ejs.render(template, data, {
            views: templatePath,
            filename: questionPath
        });

        // Set the content and generate the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Define header and footer templates
        const headerTemplate = ejs.render(headerContent, {
            texts: ['בעוזהי"ת', 'סוכה • לולב הגזול', 'בחינה', 'סוגיא ז']
        });

        const footerTemplate = ejs.render(footerContent, { 
            svg: { icon }
        });

        // Temp write path
        const writePath = path.join(__dirname, 'tmp', 'question.pdf');
        await page.pdf({
            path: writePath,
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '100px',
                bottom: '100px',
                left: '30px',
                right: '30px',
            },
            headerTemplate: headerTemplate,
            footerTemplate: footerTemplate,
            displayHeaderFooter: true,
            waitForFonts: true,
        });

        await browser.close();

        const pdfBuffer = fs.readFileSync(writePath);
        fs.unlinkSync(writePath);

        return pdfBuffer;
    }
}

module.exports = QuestionTemplate;
