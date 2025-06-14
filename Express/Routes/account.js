const express = require('express');
const nodemailer = require('nodemailer');
const nodemailer_smtp = require('nodemailer-smtp-transport');
const async = require('async');
const bCrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../../../Upload/Profile/');
    },
    filename: (req, file, cb) => {
        cb(null, req.user._id + '_' + Date.now());
    }
});
const upload = multer({ storage: storage });
const accountRouter = express.Router();
const User = require('../Models/User');

if (!fs.existsSync(__dirname + '/../../../Upload/Profile/')) fs.mkdir(__dirname + '/../../../Upload/Profile/', (err) => {});

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ success: false });
}

module.exports = function(app) {

    accountRouter.get('/get-notifications', isLoggedIn, function (req, res) {
        User.findOne({_id: req.user._id}, (err, user) => {
            res.status(200).json(req.user.notifications);
        });
    });

    accountRouter.get('/get-profile', isLoggedIn, function (req, res) {
        res.status(200).json(req.user);
    });

    /* POST Edit Account */
    accountRouter.post('/edit', isLoggedIn, function(req, res) {
        User.findOne({ '_id': req.user._id }, function(err, user) {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });

            user.info = req.body.user.info;
            user.step = req.body.user.step;
            user.meta.firstConnexion = req.body.user.meta.firstConnexion;

            user.save(function (err) {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
                return res.status(200).json({ user: user });
            });
        });
    });

    /* POST Subscribe Coach */
    accountRouter.post('/subscribe-coach', isLoggedIn, function(req, res) {
        User.findOne({ '_id': req.user._id }, function(err, user) {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            user.info[0].phone = req.body.phone;
            user.coach.hasPaid = true;
            user.save(function (err) {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
                var url = ''
                if (req.headers.host == 'app.madeinplan.fr') url = 'https://admin.madeinplan.fr/user/' + user._id;
                else if (req.headers.host == 'app.myeconomiste.com') url = 'https://admin.myeconomiste.com/user/' + user._id;
                else if (req.headers.host == 'localhost:8080') url = 'http://localhost:9000/user/' + user._id;

                var smtpTransport = nodemailer.createTransport(nodemailer_smtp({
                    service: 'gmail',
                    auth: {
                        user: 'marvin@madeinplan.fr',
                        pass: 'eD1yd+4H'
                    }
                }));
                var mailOptions = {
                    to: 'morgan@madeinplan.fr',
                    from: 'marvin@madeinplan.fr',
                    subject: 'Made In Plan - Nouvelle souscription au MIP Coach',
                    text: 'Email de l\'utilisateur : ' + user.local.email + '\n' +
                    'Nom de l\'utilisateur : ' + user.info[0].firstName + ' ' + user.info[0].lastName + '\n' +
                    'Téléphone de l\'utilisateur : ' + user.info[0].phone + '\n' +
                    'Compte : ' + url + '\n\n'
                };
                smtpTransport.sendMail(mailOptions, (err) => {
                    if (err) return res.status(500).json({ message: 'ERROR sendMail' });
                    return res.status(200).json({ success: true });
                });
            });
        });
    });

    // POST Upload Profile Picture
    accountRouter.post('/upload-picture', isLoggedIn, upload.single('image'), function(req, res) {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            console.log('Yo: ', err)
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.info[req.body.index].picture != '') {
                fs.unlink(__dirname + '/../../../Upload/Profile/' + user.info[req.body.index].picture, err => {});
            }

            fs.rename(__dirname + '/../../../Upload/Profile/' + req.file.filename, __dirname + '/../../../Upload/Profile/' + req.file.filename + path.extname(req.body.name), err => {});
            user.info[req.body.index].picture = req.file.filename + path.extname(req.body.name);

            user.save(err => {
                console.log(err)
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
                return res.status(200).json({ 'url': req.file.filename + path.extname(req.body.name) });
            });
        });
    });

    accountRouter.post('/send-remarque', isLoggedIn, function(req, res) {
        User.findOne({ '_id': req.user._id }, function(err, user) {
            if (err) return res.status(500).json({ message: 'ERROR findOne' });
            var smtpTransport = nodemailer.createTransport(nodemailer_smtp({
                service: 'gmail',
                auth: {
                    user: 'marvin@madeinplan.fr',
                    pass: 'eD1yd+4H'
                }
            }));
            var mailOptions = {
                to: 'aide@madeinplan.fr',
                from: 'marvin@madeinplan.fr',
                subject: 'Made In Plan - Remarque sur la partie ' + req.body.app,
                text: 'Bonjour,\n\n' +
                'Nouvelle remarque sur l\'application, partie ' + req.body.app + ' de la part de ' +
                user.info[0].firstName + ' ' + user.info[0].lastName + '\n\n' + req.body.remarque
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                if (err) return res.status(500).json({ message: 'ERROR sendMail' });
                return res.status(200).json({ message: 'Un e-mail vous a été envoyer contenant les instructions.' });
            });
        });
    });

    accountRouter.post('/edit-password', isLoggedIn, function(req, res) {
        User.findOne({ '_id': req.user._id }, function(err, user) {
            if (err) return res.status(500).json({ message: 'ERROR findOne' });
            if (!user.isValidPassword(req.body.oldPassord)) return res.status(400).json({ message: 'Votre ancien mot de passe est incorrect !' });
            else {
                user.local.password = createHash(req.body.newPassord);
                var smtpTransport = nodemailer.createTransport(nodemailer_smtp({
                    service: 'gmail',
                    auth: {
                        user: 'morgan@madeinplan.fr',
                        pass: 't3@mM1N3inPL@N1'
                    }
                }));
                var mailOptions = {
                    to: user.local.email,
                    from: 'morgan@madeinplan.fr',
                    subject: 'Made In Plan - Demande de changement de mot de passe',
                    html: `<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>Email MIP</title> <style type="text/css"> p{margin:10px 0; padding:0;}table{border-collapse:collapse;}h1,h2,h3,h4,h5,h6{display:block; margin:0; padding:0;}img,a img{border:0; height:auto; outline:none; text-decoration:none;}body,#bodyTable,#bodyCell{height:100%; margin:0; padding:0; width:100%;}.mcnPreviewText{display:none !important;}#outlook a{padding:0;}img{-ms-interpolation-mode:bicubic;}table{mso-table-lspace:0pt; mso-table-rspace:0pt;}.ReadMsgBody{width:100%;}.ExternalClass{width:100%;}p,a,li,td,blockquote{mso-line-height-rule:exactly;}a[href^=tel],a[href^=sms]{color:inherit; cursor:default; text-decoration:none;}p,a,li,td,body,table,blockquote{-ms-text-size-adjust:100%; -webkit-text-size-adjust:100%;}.ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{line-height:100%;}a[x-apple-data-detectors]{color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important;}.templateContainer{max-width:600px !important;}a.mcnButton{display:block;}.mcnImage,.mcnRetinaImage{vertical-align:bottom;}.mcnTextContent{word-break:break-word;}.mcnTextContent img{height:auto !important;}.mcnDividerBlock{table-layout:fixed !important;}/* @tab Page @section Heading 1 @style heading 1 */ h1{/*@editable*/color:#222222; /*@editable*/font-family:Helvetica; /*@editable*/font-size:40px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:150%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left;}/* @tab Page @section Heading 2 @style heading 2 */ h2{/*@editable*/color:#222222; /*@editable*/font-family:Helvetica; /*@editable*/font-size:28px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:150%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left;}/* @tab Page @section Heading 3 @style heading 3 */ h3{/*@editable*/color:#444444; /*@editable*/font-family:Helvetica; /*@editable*/font-size:22px; /*@editable*/font-style:normal; /*@editable*/font-weight:bold; /*@editable*/line-height:150%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left;}/* @tab Page @section Heading 4 @style heading 4 */ h4{/*@editable*/color:#999999; /*@editable*/font-family:Georgia; /*@editable*/font-size:20px; /*@editable*/font-style:italic; /*@editable*/font-weight:normal; /*@editable*/line-height:125%; /*@editable*/letter-spacing:normal; /*@editable*/text-align:left;}/* @tab Header @section Header Container Style */ #templateHeader{/*@editable*/background-color:#ffffff; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:0px; /*@editable*/padding-bottom:0px;}/* @tab Header @section Header Interior Style */ .headerContainer{/*@editable*/background-color:transparent; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:0; /*@editable*/padding-bottom:0;}/* @tab Header @section Header Text */ .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/color:#808080; /*@editable*/font-family:Helvetica; /*@editable*/font-size:16px; /*@editable*/line-height:160%; /*@editable*/text-align:left;}/* @tab Header @section Header Link */ .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{/*@editable*/color:#00ADD8; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline;}/* @tab Body @section Body Container Style */ #templateBody{/*@editable*/background-color:#FFFFFF; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:0; /*@editable*/padding-bottom:63px;}/* @tab Body @section Body Interior Style */ .bodyContainer{/*@editable*/background-color:transparent; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:0; /*@editable*/padding-bottom:0;}/* @tab Body @section Body Text */ .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/color:#808080; /*@editable*/font-family:Helvetica; /*@editable*/font-size:16px; /*@editable*/line-height:160%; /*@editable*/text-align:left;}/* @tab Body @section Body Link */ .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{/*@editable*/color:#00ADD8; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline;}/* @tab Footer @section Footer Style */ #templateFooter{/*@editable*/background-color:#333333; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:45px; /*@editable*/padding-bottom:63px;}/* @tab Footer @section Footer Interior Style */ .footerContainer{/*@editable*/background-color:transparent; /*@editable*/background-image:none; /*@editable*/background-repeat:no-repeat; /*@editable*/background-position:center; /*@editable*/background-size:cover; /*@editable*/border-top:0; /*@editable*/border-bottom:0; /*@editable*/padding-top:0; /*@editable*/padding-bottom:0;}/* @tab Footer @section Footer Text */ .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/color:#FFFFFF; /*@editable*/font-family:Helvetica; /*@editable*/font-size:12px; /*@editable*/line-height:160%; /*@editable*/text-align:center;}/* @tab Footer @section Footer Link */ .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{/*@editable*/color:#FFFFFF; /*@editable*/font-weight:normal; /*@editable*/text-decoration:underline;}@media only screen and (min-width:768px){.templateContainer{width:600px !important;}}@media only screen and (max-width: 480px){body,table,td,p,a,li,blockquote{-webkit-text-size-adjust:none !important;}}@media only screen and (max-width: 480px){body{width:100% !important; min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnRetinaImage{max-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImage{width:100% !important;}}@media only screen and (max-width: 480px){.mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer,.mcnImageCardLeftImageContentContainer,.mcnImageCardRightImageContentContainer{max-width:100% !important; width:100% !important;}}@media only screen and (max-width: 480px){.mcnBoxedTextContentContainer{min-width:100% !important;}}@media only screen and (max-width: 480px){.mcnImageGroupContent{padding:9px !important;}}@media only screen and (max-width: 480px){.mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{padding-top:9px !important;}}@media only screen and (max-width: 480px){.mcnImageCardTopImageContent,.mcnCaptionBottomContent:last-child .mcnCaptionBottomImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{padding-top:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardBottomImageContent{padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockInner{padding-top:0 !important; padding-bottom:0 !important;}}@media only screen and (max-width: 480px){.mcnImageGroupBlockOuter{padding-top:9px !important; padding-bottom:9px !important;}}@media only screen and (max-width: 480px){.mcnTextContent,.mcnBoxedTextContentColumn{padding-right:18px !important; padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{padding-right:18px !important; padding-bottom:0 !important; padding-left:18px !important;}}@media only screen and (max-width: 480px){.mcpreview-image-uploader{display:none !important; width:100% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Heading 1 @tip Make the first-level headings larger in size for better readability on small screens. */ h1{/*@editable*/font-size:30px !important; /*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Heading 2 @tip Make the second-level headings larger in size for better readability on small screens. */ h2{/*@editable*/font-size:26px !important; /*@editable*/line-height:125% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Heading 3 @tip Make the third-level headings larger in size for better readability on small screens. */ h3{/*@editable*/font-size:20px !important; /*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Heading 4 @tip Make the fourth-level headings larger in size for better readability on small screens. */ h4{/*@editable*/font-size:18px !important; /*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Boxed Text @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{/*@editable*/font-size:14px !important; /*@editable*/line-height:160% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Header Text @tip Make the header text larger in size for better readability on small screens. */ .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{/*@editable*/font-size:16px !important; /*@editable*/line-height:160% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Body Text @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px. */ .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{/*@editable*/font-size:16px !important; /*@editable*/line-height:150% !important;}}@media only screen and (max-width: 480px){/* @tab Mobile Styles @section Footer Text @tip Make the footer content text larger in size for better readability on small screens. */ .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{/*@editable*/font-size:14px !important; /*@editable*/line-height:160% !important;}}</style> </head> <body> <center> <tabl align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"> <tr> <td align="center" valign="top" id="bodyCell"> <table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td align="center" valign="top" id="templateHeader" data-template-container><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;"> <tr> <td align="center" valign="top" width="600" style="width:600px;"><![endif]--> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer"> <tr> <td valign="top" class="headerContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;"> <tbody class="mcnImageBlockOuter"> <tr> <td valign="top" style="padding:9px" class="mcnImageBlockInner"> <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;"> <tbody> <tr> <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0;"> <a href="https://madeinplan.fr/_nuxt/img/logo-made-in-plan@2x.45aff3c.png" title="" class="" target="_blank"> <img align="left" alt="" src="https://gallery.mailchimp.com/43f19bd587800b0a7429fd2a4/images/b967b039-5d97-4ea7-98cf-4f6080d23a54.png" width="200" style="max-width:200px; padding-bottom: 22px; display: inline !important; vertical-align: bottom;" class="mcnImage"> </a> </td></tr></tbody> </table> </td></tr></tbody> </table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr><tr> <td align="center" valign="top" id="templateBody" data-template-container><!--[if (gte mso 9)|(IE)]> <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;"> <tr> <td align="center" valign="top" width="600" style="width:600px;"><![endif]--> <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer"> <tr> <td valign="top" class="bodyContainer"> <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;"> <tbody class="mcnTextBlockOuter"> <tr> <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;"><!--[if mso]> <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"> <tr><![endif]--><!--[if mso]> <td valign="top" width="600" style="width:600px;"><![endif]--> <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer"> <tbody> <tr> <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 150%;"> <p style="color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 160%;">Bonjour 😊,</p><p style="color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 160%;">Nous avons bien enregistré la modification du mot de passe de votre compte Made in Plan.</p><p style="color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 160%;">Si vous n’êtes pas à l’origine de cette demande, avertissez nous au plus vite à l'adresse <a href="mailto:contact@madeinplan.fr">contact@madeinplan.fr</a></p><p style="color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 160%;">À très vite ! </p><p style="color: #253155;font-family: &quot;Source Sans Pro&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size: 16px;line-height: 160%;">Morgan </p></td></tr></tbody> </table><!--[if mso]> </td><![endif]--><!--[if mso]> </tr></table><![endif]--> </td></tr></tbody> </table> </td></tr></table><!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]--> </td></tr></table> </td></tr></table> </center> </body></html>`
                }
                smtpTransport.sendMail(mailOptions, (err) => {
                    if (err) return res.status(500).json({ message: 'ERROR sendMail' });
                    return res.status(200).json({ message: 'Votre mot de passe a bien été modifié' });
                });
            }
        });
    });

    app.use('/account', accountRouter);
}
