const { getClientUrl } = require("../../config/clientUrl");
exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
    const formattedAmount = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(amount);

    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    return `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Payment Receipt - StudyNotion</title>
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

            .receipt-box {
                background-color: #f9f9f9;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }

            .receipt-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px dashed #e0e0e0;
                font-size: 15px;
            }

            .receipt-row:last-child {
                border-bottom: none;
                font-weight: bold;
                font-size: 16px;
                color: #222222;
            }

            .receipt-label {
                color: #555555;
            }

            .receipt-value {
                color: #222222;
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
            <div class="message">Payment Successful!</div>
            <div class="body">
                <p>Hey <span class="highlight">${name}</span>,</p>
                <p>Thank you for your purchase! Your payment has been successfully processed. You now have full access to the course.</p>
                <p>Here is your receipt:</p>

                <div class="receipt-box">
                    <div class="receipt-row">
                        <span class="receipt-label">Receipt Date</span>
                        <span class="receipt-value">${today}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Order ID</span>
                        <span class="receipt-value">${orderId}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Payment ID</span>
                        <span class="receipt-value">${paymentId}</span>
                    </div>
                    <div class="receipt-row">
                        <span class="receipt-label">Amount Paid</span>
                        <span class="receipt-value">${formattedAmount}</span>
                    </div>
                </div>

                <p>Please log in to your learning dashboard to access the course materials and start your learning journey.</p>
                <a class="cta" href="${getClientUrl()}/dashboard">Go to Dashboard</a>
            </div>
            <div class="support">If you have any questions or need assistance, please feel free to reach out to us at
                <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are here to help!</div>
        </div>
    </body>

    </html>`;
};