const resetPasswordHtml = ({ username, siteLink, recoveryLink }) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          * {
            font-family: "Open Sans", "Helvetica Neue", sans-serif !important;
          }
          body {
            background: #ebebeb !important;
            margin-left: 20px !important;
            margin-right: 20px !important;
            margin-top: 30px;
          }
          .container {
            max-width: 500px;
            min-height: 300px;
            background: white;
            margin: auto !important;
            border-radius: 8px;
            padding: 10px 30px;
          }
          .btn {
            all: unset;
            padding: 12px 20px;
            background-color: rgb(54, 130, 243);
            color: white !important;
            text-decoration: none;
            font-weight: bold;
            border-radius: 4px;
            cursor: pointer;
          }
          p {
            line-height: 20px;
            font-size: 1rem;
            font-weight: 500;
          }
          .p1 {
            margin-bottom: 30px;
          }
          .p2 {
            margin-top: 30px;
          }
          .link {
            margin-bottom: 20px;
            overflow: hidden !important;
            white-space: nowrap !important;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h3>Hi, ${username}</h3>
          <p class="p1">
            Someone (hopefully you) has requested a password reset for your Mern
            Media account. Follow the link below to set a new password:
          </p>
          <div class="link">
            <a href="${recoveryLink}">${recoveryLink}</a>
          </div>
          <a class="btn" href="${recoveryLink}" target="_blank">Reset Password</a>
          <p class="p2">
            If you don't wish to reset your password, disregard this email and no
            action will be taken.
          </p>
          <div>
            <div>Mern Media</div>
            <a
              target="_blank"
              href="${siteLink}"
              >${siteLink}</a
            >
          </div>
        </div>
      </body>
    </html>
    `;
};

module.exports = resetPasswordHtml;
