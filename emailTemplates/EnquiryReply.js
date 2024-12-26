module.exports = ({name ,message}) => {
  return ` 
<table align="center" style="max-width: 600px; font-family: arial;text-align: left;" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000">
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
        <img src="https://f003.backblazeb2.com/file/Event-management/emailbanner.png" alt="">
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 0 30px 10px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: left;"> Hi ${name}, </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 10px 30px 10px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: left;"> Thank you for your enquiry. Please find below the response to your enquiry. </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 45px 10px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: left;"> Message: ${message} </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 0 45px 10px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: left;"> Best regards, <br> Itsinvite Support Team </p>
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
    <td style="padding: 0 0 5px 0;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;">
        <a href="#" style="color:#CCCCCC;">Unsubscribe</a>
      </p>
    </td>
  </tr>
</table>
      `;
};