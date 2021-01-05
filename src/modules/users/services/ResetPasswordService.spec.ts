import AppError from '@shared/errors/AppErros';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUsersTokensRepository;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUsersTokensRepository();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );
  });

  it('should be able to reset password', async () => {
    const email = 'johndoe@exemple.com'

    const user = await fakeUsersRepository.create({
      email,
      name: 'johndoe',
      password: 'password'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    const newPassword = 'newPassword'

    await resetPassword.execute({ token, password: newPassword })

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(updatedUser?.password).toBe(newPassword);
  })
});
