const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const QRCode = require('qrcode');
const importAsset = require('./ImportAssets');

class AnswerTemplate {
    async createPDF(data) {
        let configLaunch = {
            headless: true,
            ignoreDefaultArgs: ['--disable-extensions'],
        };
        const browser = await puppeteer.launch(configLaunch);
        const page = await browser.newPage();

        // Load the EJS template
        const templatePath = path.join(__dirname, 'templates');

        const answerPath = path.join(templatePath, 'answer.ejs');
        const headerPath = path.join(templatePath, 'header.ejs');
        const footerPath = path.join(templatePath, 'footer.ejs');

        const template = fs.readFileSync(answerPath, 'utf-8');
        const headerContent = fs.readFileSync(headerPath, 'utf-8');
        const footerContent = fs.readFileSync(footerPath, 'utf-8');

        // Render the HTML content with dynamic data
        const dataWithQR = await Promise.all(
            data.embed.students.map(async (student) => {
                let qrcodedata = '';
                let _student = {};
                if(typeof student === 'string'){
                    qrcodedata = student;
                    _student.id = student;
                }
                if(typeof student === 'object'){
                    qrcodedata = student.studentID;
                    _student = student;
                }

                const qrCodeDataURL = await QRCode.toDataURL(qrcodedata, { margin: 2 });
                return { ..._student, qrCode: qrCodeDataURL }; 
            })
        );
        
        const icon = importAsset('pdf-asset-2.svg');
        const glyph = importAsset('pdf-asset-7.svg');
        const circle = importAsset('pdf-asset-6.svg');
        
        data.embed.students = dataWithQR;
        data.svg = { 
            circle, glyph
        };

        // Render the HTML content with dynamic data
        const htmlContent = ejs.render(template, data, {
            views: templatePath,
            filename: answerPath
        });
        
        // Define header and footer templates
        const headerTemplate = ejs.render(headerContent, {
            texts: ['בעוזהי"ת', 'סוכה • לולב הגזול', 'בחינה', 'סוגיא ז']
        });

        const footerTemplate = ejs.render(footerContent, { 
            svg: { icon }
        });

        // Set the content and generate the PDF
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const writePath = path.join(__dirname, 'tmp', 'answer.pdf');
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

module.exports = AnswerTemplate;