module.exports = (VerfiyLink, userName) => {
    return `
  <table align="center" style="max-width: 600px; font-family: arial;" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000">
  <tr bgcolor="#141414">
    <td style="padding: 20px 2px 0 2px; text-align: center;">
      <p style="margin: 1px;">
        <a href="https://user-event.vercel.app/">
          <img style="max-width:150px;" src="https://f003.backblazeb2.com/file/Event-management/logo.png" alt="">
        </a>
      </p>
    </td>
  </tr>
  <tr bgcolor="#141414">
    <td style="padding: 40px 2px 10px 2px; text-align: center;">
      <p style="margin: 1px;">
        <img src="https://f003.backblazeb2.com/file/Event-management/forgetpass.png" alt="Forgot Password">
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 0 20px 20px; text-align: center">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC"> Hi ${userName}, </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 20px 20px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;"> Thank you for signing up with us. Please proceed with verifying your account. </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 30px 20px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;"> To verify your account, please click the link below: </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 10px 20px 50px 20px; text-align: center;">
      <a href=${VerfiyLink} target="_blank" style="padding:15px 20px; background: #EB3465; font-size: 14px; text-align: center; color: #ffffff; text-decoration: none; border-radius: 60px; -webkit-border-radius: 60px;">Verify Your Account</a>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 20px 20px 20px; text-align: center">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC"> For security purposes, this link will expire in 24 hours. If you need further assistance or didn’t sign up with us, please reach out to our support team immediately. </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 20px 20px; text-align: center">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC"> Thank you for using Itsinvite ! </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 45px 20px; text-align: center">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC"> Best regards, <br> Itsinvite Support Team </p>
    </td>
  </tr>
  <tr bgcolor="#141414">
    <td style="padding: 15px 0 15px 0; text-align: center;">
      <table cellpadding="0" cellspacing="0" align="center">
        <tr>
          <td style="padding: 0 5px;">
            <a href="#">
              <img src="https://f003.backblazeb2.com/file/Event-management/linkedicon.png" alt="">
            </a>
          </td>
          <td style="padding: 0 5px;">
            <a href="#">
              <img src="https://f003.backblazeb2.com/file/Event-management/instagram.png" alt="">
            </a>
          </td>
          <td style="padding: 0 5px;">
            <a href="#">
              <img src="https://f003.backblazeb2.com/file/Event-management/facebook.png" alt="">
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr bgcolor="#141414">
    <td style="padding: 15px 0 5px 0;border-top:1px solid #444444">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;"> Copyright (C) 2024 invite. All rights reserved. </p>
    </td>
  </tr>
  <tr bgcolor="#141414">
    <td style="padding: 0 0 15px 0;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;"> You are receiving this email because you requested a password reset for your account. </p>
    </td>
  </tr>
</table>
    `;
};