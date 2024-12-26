module.exports = ({name}) => {
    return `
<table  align="center" style="max-width: 600px; font-family: arial;" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#000">
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
            <img src="https://f003.backblazeb2.com/file/Event-management/requestbanner.png" alt="">
        </p>
    </td>
</tr>

<tr>
    <td style="padding:40px 0 30px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Hi ${name},
        </p>
    </td>
</tr>

<tr>
    <td style="padding: 0 20px 30px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Great news! We've received your event service request, and we're already working on finding the best service providers for you.
        </p>
    </td>
</tr>

<tr>
    <td style="padding: 0 0 25px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Here are the details of your request:
        </p>
    </td>
</tr>


<tr>
    <td style="padding: 0 0 40px 15px;">
        <table>
            <tr>
                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
                        Event Type::
                    </p>
                </td>

                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#fff">
                       <strong>
                        [Event Type]
                       </strong>
                    </p>
                </td>
            </tr>

            <tr>
                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
                        Location:
                    </p>
                </td>

                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#fff">
                       <strong>
                       [Event Location]
                       </strong>
                    </p>
                </td>
            </tr>

            <tr>
                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
                        Event Date:
                    </p>
                </td>

                <td style="padding: 0 15px 10px 5px;">
                    <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#fff">
                       <strong>
                        [Event Date]
                       </strong>
                    </p>
                </td>
            </tr>
        </table>
    </td>
</tr>


<tr>
    <td style="padding: 0 20px 30px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Our AI is analyzing your requirements to recommend the most suitable service providers. You'll hear back from us shortly with personalized recommendations tailored to your event.
        </p>
    </td>
</tr>


<tr>
    <td style="padding: 0 20px 30px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Once you've selected the provider that best fits your needs, you'll be able to complete your booking and payment on the cart page.
        </p>
    </td>
</tr>



<tr>
    <td style="padding: 0 20px 30px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            If you need to update any details or have questions, feel free to reply to this email or visit your dashboard [Insert link to dashboard].
        </p>
    </td>
</tr>



<tr>
    <td style="padding: 0 20px 45px 20px;">
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC">
            Thank you for choosing us, <br> [Company Name] Team
        </p>
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
        <p style="margin: 1px; font-size: 14px; font-weight: normal; color:#CCCCCC; text-align: center;">
            Copyright (C) 2024 invite. All rights reserved.
        </p>
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