import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppErrors';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatar from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatar;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatar(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to upload avatar', async () => {
    const fileName = 'avatar.jpg';

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileName,
    });

    expect(user.avatar).toBe(fileName);
  });

  it('should not be able to upload avatar if user does not exists', async () => {
    await expect(
      updateUserAvatar.execute({
        userId: '123456',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete avatar', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const fileNameOne = 'avatar.jpg';
    const fileNameTwo = 'avatar2.jpg';

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileNameOne,
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: fileNameTwo,
    });

    expect(deleteFile).toHaveBeenCalledWith(fileNameOne);
    expect(user.avatar).toBe(fileNameTwo);
  });
});
