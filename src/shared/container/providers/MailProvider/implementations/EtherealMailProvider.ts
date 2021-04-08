import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from '../models/IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error(`Failed to create a testing account.\n${err.message}`);
      }

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendEmail(to: string, body: string): Promise<void> {
    this.client.sendMail(
      {
        from: 'Sender Name <sender@example.com>',
        to,
        subject: 'Recuperação de senha',
        text: body,
        html: body,
      },
      (err, info) => {
        if (err) {
          console.log(`Error occurred.\n${err.message}`);
          return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      },
    );
  }
}

export default EtherealMailProvider;
