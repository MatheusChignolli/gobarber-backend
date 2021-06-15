import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to authenticate', async () => {
    const email = 'johndoe@exemple.com';
    const password = '123456';

    await createUser.execute({
      name: 'John Doe',
      email,
      password,
    });

    const response = await authenticateUserService.execute({
      email,
      password,
    });

    expect(response).toHaveProperty('token');
  });

  it('should not be able to authenticate with wrong email', async () => {
    const password = '123456';

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password,
    });

    await expect(
      authenticateUserService.execute({
        email: 'anne@example.com',
        password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'johndoe@exemple.com';

    await createUser.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
