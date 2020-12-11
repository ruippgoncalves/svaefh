const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

function sendMail(sendTo, code) {
    transporter.sendMail({
        from: process.env.EMAIL,
        bcc: sendTo,
        subject: 'Sistema de Votação AEFH',
        html: `
<!DOCTYPE html>
<html lang="pt">

<head>
    <title>Sistema de Votação AEFH</title>
    <!--


    COLORE INTENSE  #9C010F
    COLORE LIGHT #EDE8DA

    TESTO LIGHT #3F3D33
    TESTO INTENSE #ffffff 


    -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">

    <style type="text/css">
        #ko_onecolumnBlock_6 .textintenseStyle a,
        #ko_onecolumnBlock_6 .textintenseStyle a:link,
        #ko_onecolumnBlock_6 .textintenseStyle a:visited,
        #ko_onecolumnBlock_6 .textintenseStyle a:hover {
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            text-decoration: none
        }

        #ko_onecolumnBlock_6 .textlightStyle a,
        #ko_onecolumnBlock_6 .textlightStyle a:link,
        #ko_onecolumnBlock_6 .textlightStyle a:visited,
        #ko_onecolumnBlock_6 .textlightStyle a:hover {
            color: #3F3D33;

            text-decoration: none;
            font-weight: bold;
        }
    </style>


    <style type="text/css">
        /* CLIENT-SPECIFIC STYLES */
        #outlook a {
            padding: 0;
        }

        /* Force Outlook to provide a "view in browser" message */
        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass {
            width: 100%;
        }

        /* Force Hotmail to display emails at full width */
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
            line-height: 100%;
        }

        /* Force Hotmail to display normal line spacing */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        /* Prevent WebKit and Windows mobile changing default text sizes */
        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        /* Remove spacing between tables in Outlook 2007 and up */
        img {
            -ms-interpolation-mode: bicubic;
        }

        /* Allow smoother rendering of resized image in Internet Explorer */

        /* RESET STYLES */
        body {
            margin: 0;
            padding: 0;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        .appleBody a {
            color: #68440a;
            text-decoration: none;
        }

        .appleFooter a {
            color: #999999;
            text-decoration: none;
        }

        /* MOBILE STYLES */
        @media screen and (max-width: 525px) {

            /* ALLOWS FOR FLUID TABLES */
            table[class="wrapper"] {
                width: 100% !important;
                min-width: 0px !important;
            }

            /* USE THESE CLASSES TO HIDE CONTENT ON MOBILE */
            td[class="mobile-hide"] {
                display: none;
            }

            img[class="mobile-hide"] {
                display: none !important;
            }

            img[class="img-max"] {
                width: 100% !important;
                max-width: 100% !important;
                height: auto !important;
            }

            /* FULL-WIDTH TABLES */
            table[class="responsive-table"] {
                width: 100% !important;
            }

            /* UTILITY CLASSES FOR ADJUSTING PADDING ON MOBILE */
            td[class="padding"] {
                padding: 10px 5% 15px 5% !important;
            }

            td[class="padding-copy"] {
                padding: 10px 5% 10px 5% !important;
                text-align: center;
            }

            td[class="padding-meta"] {
                padding: 30px 5% 0px 5% !important;
                text-align: center;
            }

            td[class="no-pad"] {
                padding: 0 0 0px 0 !important;
            }

            td[class="no-padding"] {
                padding: 0 !important;
            }

            td[class="section-padding"] {
                padding: 10px 15px 10px 15px !important;
            }

            td[class="section-padding-bottom-image"] {
                padding: 10px 15px 0 15px !important;
            }

            /* ADJUST BUTTONS ON MOBILE */
            td[class="mobile-wrapper"] {
                padding: 10px 5% 15px 5% !important;
            }

            table[class="mobile-button-container"] {
                margin: 0 auto;
                width: 100% !important;
            }

            a[class="mobile-button"] {
                width: 80% !important;
                padding: 15px !important;
                border: 0 !important;
                font-size: 16px !important;
            }

        }
    </style>
</head>

<body style="margin: 0; padding: 0;" align="center" bgcolor="#ffffff">

    <!-- PREHEADER -->


    <table id="ko_imageBlock_7" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tbody>
            <tr class="row-a">
                <td class="no-pad"
                    style="padding-top: 0px; padding-left: 15px; padding-bottom: 0px; padding-right: 15px;"
                    bgcolor="#04748c" align="center">
                    <table class="responsive-table" width="500" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <!-- HERO IMAGE -->
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td class="no-padding">
                                                                    <table width="100%" cellspacing="0" cellpadding="0"
                                                                        border="0">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>
                                                                                    <img alt="" class="img-max"
                                                                                        style="display: block; padding: 0; color: #3F3D33; text-decoration: none; font-family: Helvetica, Arial, sans-serif; font-size: 16px; width: 500px;"
                                                                                        src="${process.env.FRONTEND + '/static/email/badge.png'}"
                                                                                        width="500" border="0">
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>


        </tbody>
    </table>
    <table id="ko_onecolumnBlock_6" width="100%" cellspacing="0" cellpadding="0" border="0">

        <tbody>
            <tr class="row-a">
                <td class="section-padding"
                    style="padding-top: 30px; padding-left: 15px; padding-bottom: 30px; padding-right: 15px;"
                    bgcolor="#EDE8DA" align="center">
                    <table class="responsive-table" width="500" cellspacing="0" cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <!-- COPY -->
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td class="padding-copy"
                                                                    style="font-size: 25px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33; padding-top: 0px;"
                                                                    align="center">${code}</td>
                                                            </tr>
                                                            <tr>
                                                                <td class="padding-copy textlightStyle"
                                                                    style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33;"
                                                                    align="center">
                                                                    <p style="margin:0px;">Caros(as) alunos(as) e/ou professores(as),<br>Está a ser convidado para uma votação, use o código acima para poder votar.</p>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

        </tbody>
    </table>
    <table id="ko_socialBlock_4" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tbody>
            <tr class="row-b">
                <td class="section-padding" style="padding: 10px 15px 0px 15px;" bgcolor="#EDE8DA" align="center">
                    <table style="padding: 0 0 0px 0;" class="responsive-table" width="500" cellspacing="0"
                        cellpadding="0" border="0">
                        <tbody>
                            <tr>
                                <td style="padding: 10 10 10px 10px; font-size: 25px;" class="padding-copy"
                                    align="center">
                                    <a target="_new"
                                        href="https://pt-pt.facebook.com/AgrupamentoDeEscolasFranciscoDeHolanda"><img
                                            src="${process.env.FRONTEND + '/static/email/facebook.png'}"
                                            alt="Seguir no facebook" style="padding: 0 5px 0px 0px;" width="48"
                                            height="48"></a>



                                    <a target="_new" href="https://www.instagram.com/aefranciscoholanda/"><img
                                            src="${process.env.FRONTEND + '/static/email/instagram.png'}"
                                            alt="Seguir no instagram" style="padding: 0 0px 0px 5px;" width="48"
                                            height="48"></a></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <!-- FOOTER -->
    <table style="min-width: 500px;" id="ko_footerBlock_2" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tbody>
            <tr>
                <td bgcolor="#ffffff" align="center">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td style="padding: 20px 0px 20px 0px;">
                                    <!-- UNSUBSCRIBE COPY -->
                                    <table class="responsive-table" width="500" cellspacing="0" cellpadding="0"
                                        border="0" align="center">
                                        <tbody>
                                            <tr>
                                                <td style="font-size: 12px; line-height: 18px; font-family: Helvetica, Arial, sans-serif; color: #3F3D33;"
                                                    valign="middle" align="center">
                                                    <span class="appleFooter" style="color: #3F3D33;">Alameda Dr.
                                                        Alfredo Pimenta<br>4814 - 528 Guimarães</span><br><a
                                                        class="original-only"
                                                        style="color: #3F3D33; text-decoration: none;" target="_new">253
                                                        540 130</a><span class="original-only"
                                                        style="font-family: Arial, sans-serif; font-size: 12px; color: #444444;">&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span><a
                                                        href="https://github.com/ruippgoncalves/svaefh"
                                                        style="color: #3F3D33; text-decoration: none;" target="_new">©
                                                        Rui Gonçalves</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>



</body>

</html>
        `
    }, err => { if (err) console.log(err); });
}

module.exports = sendMail;
