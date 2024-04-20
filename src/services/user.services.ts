import Store from '@database/models/store';
import User from '@database/models/user';
import { UserRolesEnum } from '@src/types/user.types';
import { WhereOptions } from 'sequelize';

class userService {
  static async registerUser(
    name: string,
    hashedPassword: string,
    email: string,
    phone: string,
    gender: string,
    location: string,
    storeId: string,
    role: UserRolesEnum
  ) {
    // remove the password and return the new user
    const newUser: Omit<User, 'password'> = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      location,
      storeId,
      role,
    });

    const newUserObject = newUser.toJSON();

    // delete the password from the object
    delete (newUserObject as Partial<User>).password;

    return newUserObject;
  }

  //login service
  static async loginUser(phone: string) {
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return null;
    }
    return user;
  }

  //get user by id
  static async getUserById(id: string) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!user) {
      return null;
    }
    return user;
  }

  static async getOneUser(where: WhereOptions) {
    return await User.findOne({ where: { ...where }, attributes: { exclude: ['password'] } });
  }

  //update user
  static async getAllUsers({ where }: { where: WhereOptions }) {
    return await User.findAll({
      // where: { deletedAt: null },
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'store' }],
    });
  }
}

export default userService;
