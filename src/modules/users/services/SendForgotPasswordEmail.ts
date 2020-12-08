import { injectable, inject } from 'tsyringe';
// import AppError from '@shared/errors/AppErros';
// import User from '../infra/typeorm/entities/Users';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
class SendForgotPasswordEmail {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    this.mailProvider.sendEmail(
      email,
      'Pedido de recuperação de senhar recebido',
    );
  }
}

export default SendForgotPasswordEmail;
