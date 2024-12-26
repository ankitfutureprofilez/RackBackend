const moment = require("moment");
module.exports = ({name , package}) => {
  return `
<table align="center" style="max-width: 600px; font-family: Arial;" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000">
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
        <img src="https://f003.backblazeb2.com/file/Event-management/emailbanner.png" alt="Email Banner">
      </p>
    </td>
  </tr>
  <tr>
    <td style="padding:40px 20px 30px 20px;">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC;"> Hi ${name}, </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0px 20px 20px 20px">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC;"> Thank you for your booking request! Your booking request for the upcoming event has been successfully sent. </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 0px 20px 20px 20px">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC;"> Here are the details of your request: </p>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px 20px 20px 0px;">
      <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding: 5px 20px; font-size: 14px; color: #CCCCCC;">Event Name:</td>
          <td style="padding: 5px 10px; font-size: 14px; color: #FFFFFF;">${package.package_name}</td>
        </tr>
        <tr>
          <td style="padding: 5px 20px; font-size: 14px; color: #CCCCCC;">Your Location:</td>
          <td style="padding: 5px 10px; font-size: 14px; color: #FFFFFF;">${package.location}</td>
        </tr>
        <tr>
          <td style="padding: 5px 20px; font-size: 14px; color: #CCCCCC;">Booking Date:</td>
          <td style="padding: 5px 10px; font-size: 14px; color: #FFFFFF;">${moment(package?.bookingDate, "DD-MM-YYYY").format("DD MMMM YYYY")}</td>
        </tr>
        <tr>
          <td style="padding: 5px 20px; font-size: 14px; color: #CCCCCC;">Number Of Attendees:</td>
          <td style="padding: 5px 10px; font-size: 14px; color: #FFFFFF;">${package.attendees}</td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding: 20px; font-size: 14px; color: #CCCCCC;"> Our team will review your request and get back to you shortly. If you need to modify any details or view your booking request, please reach out to us. </td>
  </tr>
  <tr>
    <td style="padding: 20px; text-align: left;">
      <p style="margin: 1px; font-size: 14px; color: #CCCCCC;"> Best regards, <br> Itsinvite Team </p>
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
    <td style="padding: 15px 0 10px 0;border-top:1px solid #444444">
      <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;"> Thank you for choosing us to make your event special! </p>
    </td>
  </tr>
</table>
  `;
};
