import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns'
import AppError from '@shared/errors/AppErros';
// import User from '../infra/typeorm/entities/Users';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider'

interface IRequestDTO {
  token: string;
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exist')
    }

    const user = await this.usersRepository.findById(userToken?.user_id)

    if (!user) {
      throw new AppError('User does not exist')
    }

    const hoursDifference = differenceInHours(Date.now(), userToken.created_at)

    if (hoursDifference > 2) {
      throw new AppError('Token expired')
    }

    user.password = await this.hashProvider.generateHash(password)

    await this.usersRepository.save(user)
  }
}

export default ResetPasswordService;