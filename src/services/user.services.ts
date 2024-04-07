import User from "../../database/models/user";


class userService {
    static async registerUser(name: string, hashedPassword: string, email: string, phone: string, gender: string, location: string, storeId: string, role: string){
        // remove the password and return the new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            location,
            storeId,
            role
        })

        const newUserObject = newUser.toJSON();

        // delete the password from the object
        newUserObject.password = null as unknown as string;
        return newUserObject;
}

    //login service
    static async loginUser(phone: string){

        const user = await User.findOne({where: {phone}});
        if(!user){
            return null;
        }
        return user;
    }

    //get user by id
    static async getUserById(id: string){
        const user = await User.findByPk(id);
        if(!user){
            return null;
        }
        return user;
    }

    //update user
    static async getAllUsers(){
        const users = await User.findAll({where: {deletedAt: null}, attributes: {exclude: ['password']}});
        return users;
    }
}


export default userService;
