import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import uploadConfig from '@config/upload';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = container.resolve(CreateUserService);

  const user = await createUser.execute({ name, email, password });

  delete user.password;

  return res.json(user);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (req, res) => {
    const { file, user } = req;

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFilename: file.filename,
    });

    delete updatedUser.password;

    return res.json(updatedUser);
  },
);

export default usersRouter;
