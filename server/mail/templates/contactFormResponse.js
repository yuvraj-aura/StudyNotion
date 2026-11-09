const { getClientUrl } = require("../../config/clientUrl");
exports.contactFormResponse = (firstName, lastName, email, message) => {
    const preview = message && message.length > 120
        ? `${message.slice(0, 120)}...`
        : message;

    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Thanks for Reaching Out - StudyNotion</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }

            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #222222;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }

            .summary-box {
                background-color: #f9f9f9;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
                font-size: 15px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px dashed #e0e0e0;
            }

            .summary-row:last-child {
                border-bottom: none;
            }

            .summary-label {
                color: #555555;
                font-weight: bold;
            }

            .summary-value {
                color: #222222;
                text-align: right;
                max-width: 60%;
                word-break: break-word;
            }

            .cta {
                display: inline-block;
                padding: 12px 28px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 10px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <a href="${getClientUrl()}"><img class="logo"
                    src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
            <div class="message">Thanks for Reaching Out!</div>
            <div class="body">
                <p>Hey <span class="highlight">${firstName} ${lastName}</span>,</p>
                <p>Thank you for contacting us! We have received your message and our team will get back to you within
                    <span class="highlight">24 business hours</span>.</p>

                <div class="summary-box">
                    <div class="summary-row">
                        <span class="summary-label">Name</span>
                        <span class="summary-value">${firstName} ${lastName}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Email</span>
                        <span class="summary-value">${email}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Message</span>
                        <span class="summary-value">${preview}</span>
                    </div>
                </div>

                <p>In the meantime, feel free to explore our courses or visit our dashboard.</p>
                <a class="cta" href="${getClientUrl()}">Visit Website</a>
            </div>
            <div class="support">
                If you have any questions, please feel free to reach out to us at
                <a href="mailto:support@studynotion.com">support@studynotion.com</a> or
                <a href="tel:+9111055225500">+91 (110) 5522-5500</a>.
                We are here to help!
            </div>
        </div>
    </body>

    </html>`;
};

// internal notification sent to the StudyNotion support inbox
exports.contactFormNotification = (firstName, lastName, email, phoneNo, message) => {
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return `<!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8">
        <title>New Contact Form Submission - StudyNotion</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }

            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            .message {
                font-size: 22px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #222222;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
                text-align: left;
            }

            .summary-box {
                background-color: #f9f9f9;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
                font-size: 15px;
            }

            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 6px 0;
                border-bottom: 1px dashed #e0e0e0;
            }

            .summary-row:last-child {
                border-bottom: none;
            }

            .summary-label {
                color: #555555;
                font-weight: bold;
            }

            .summary-value {
                color: #222222;
                text-align: right;
                max-width: 60%;
                word-break: break-word;
            }

            .cta {
                display: inline-block;
                padding: 12px 28px;
                background-color: #FFD60A;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 10px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .highlight {
                font-weight: bold;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <a href="${getClientUrl()}"><img class="logo"
                    src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
            <div class="message">New Contact Form Submission</div>
            <div class="body">
                <p>A new contact form submission was received on <span class="highlight">${today}</span>.</p>

                <div class="summary-box">
                    <div class="summary-row">
                        <span class="summary-label">Name</span>
                        <span class="summary-value">${firstName} ${lastName}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Email</span>
                        <span class="summary-value">${email}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Phone</span>
                        <span class="summary-value">${phoneNo}</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Message</span>
                        <span class="summary-value">${message}</span>
                    </div>
                </div>

                <a class="cta" href="mailto:${email}?subject=Re:%20Your%20StudyNotion%20Enquiry">Reply to ${firstName}</a>
            </div>
            <div class="support">Sent automatically by the StudyNotion contact form.</div>
        </div>
    </body>

    </html>`;
};