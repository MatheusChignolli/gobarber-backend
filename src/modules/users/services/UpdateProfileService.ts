import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppErrors';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/Users';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.UsersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.UsersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('E-mail already in use');
    }

    if (password && !old_password) {
      throw new AppError('You need to inform the old password');
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        user.password,
        old_password,
      );

      if (!checkOldPassword) {
        throw new AppError('You need to inform the old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.UsersRepository.save(user);
  }
}

export default UpdateProfileService;
