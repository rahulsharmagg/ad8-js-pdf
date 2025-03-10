const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

class QuestionTemplate {
    async createPDF(data) {
        let configLaunch = {
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        };
        const browser = await puppeteer.launch(configLaunch);
        const page = await browser.newPage();

        // Load the EJS template
        const templatePath = path.join(__dirname, 'templates', 'question.ejs');
        const headerTemplatePath = path.join(__dirname, 'templates', 'header.ejs');
        const footerTemplatePath = path.join(__dirname, 'templates', 'footer.ejs');

        const template = fs.readFileSync(templatePath, 'utf-8');
        const headerTemplateContent = fs.readFileSync(headerTemplatePath, 'utf-8');
        const footerTemplateContent = fs.readFileSync(footerTemplatePath, 'utf-8');

        // Render the HTML content with dynamic data
        const htmlContent = ejs.render(template, data);

        // Set the content and generate the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Define header and footer templates
        const headerTemplate = ejs.render(headerTemplateContent, {
            texts: ['בעוזהי"ת', 'סוכה • לולב הגזול', 'בחינה', 'סוגיא ז']
        });

        const footerTemplate = ejs.render(footerTemplateContent, {});

        const writePath = path.join(__dirname, 'tmp', 'question.pdf');
        console.log(writePath);
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
        });

        await browser.close();

        const pdfBuffer = fs.readFileSync(writePath);
        fs.unlinkSync(writePath);

        return pdfBuffer;
    }
}

module.exports = QuestionTemplate;