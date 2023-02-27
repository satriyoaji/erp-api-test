import fs from "fs";
import inlineCss from "@point-hub/nodemailer-inlinecss";
import { createTransport, createTestAccount, getTestMessageUrl, SendMailOptions } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import mg from "nodemailer-mailgun-transport";
import { PluginFunction } from "nodemailer/lib/mailer";
import { mailConfig, mailgunConfig } from "@src/config/mail.js";
import { copyrightYear, appName } from "@src/services/mailer/resources/handlebarsHelpers.js";

class Mailer {
  private transporter: any;

  async init() {
    if (process.env.NODE_ENV !== "production") {
      await this.setupDevelopmentAccount();
    } else {
      this.setupMailgunAccount();
    }
    this.setupPlugins();

    return this;
  }

  public async send(data: SendMailOptions) {
    data.from = `${mailConfig.fromName} <${mailConfig.fromAddress}>`;

    const info = await this.transporter.sendMail(data);
    console.log("Message sent: %s", info.messageId);

    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV !== "production") {
      console.log("Preview URL: %s", getTestMessageUrl(info));
    }
  }

  private async setupDevelopmentAccount() {
    const testAccount = await createTestAccount();
    this.transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  private setupMailgunAccount() {
    this.transporter = createTransport(
      mg({
        auth: {
          api_key: mailgunConfig.apiKey,
          domain: mailgunConfig.domain,
        },
      })
    );
  }

  private setupPlugins() {
    // Add Nodemailer Handlebars Plugin
    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          layoutsDir: "./src/services/mailer/resources",
          partialsDir: "./src/services/mailer/resources",
          helpers: { copyrightYear, appName },
          extname: ".hbs",
        },
        viewPath: "./src/modules",
        extName: ".hbs",
      })
    );

    // Add Nodemailer Inlinecss Plugin
    this.transporter.use(
      "compile",
      inlineCss({
        extraCss: fs.readFileSync("./src/services/mailer/resources/styles.css").toString(),
      }) as PluginFunction
    );
  }
}

export default await new Mailer().init();
