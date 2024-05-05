import Store from '@database/models/store';
import User from '@database/models/user';
import { GetAllRequestQuery } from '@src/types/sales.types';
import { UserRolesEnum } from '@src/types/user.types';
import { findQueryGenerators } from '@src/utils/generators';
import { IncludeOptions, WhereOptions } from 'sequelize';

class UserService {
  static DEFAULT_STORE_INCLUDES: IncludeOptions = {
    model: Store,
    as: 'store',
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
  };

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

  static async getOneUser(where: WhereOptions, deleted: boolean = false) {
    return await User.findOne({ paranoid: deleted, where: { ...where }, attributes: { exclude: ['password'] } });
  }

  //update user
  static async getAllUsers(queryData?: GetAllRequestQuery, where?: WhereOptions, includes?: IncludeOptions[]) {
    const include: IncludeOptions[] = [this.DEFAULT_STORE_INCLUDES, ...(includes ?? [])];

    const { count, rows } = await User.findAndCountAll(
      findQueryGenerators(Store.getAttributes(), queryData, { where, include, attributes: { exclude: ['password'] } })
    );

    return { users: rows, total: count };
  }
}

export default UserService;
