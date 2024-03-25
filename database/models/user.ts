import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { Sequelize, sequelize } from ".";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: String |null;
  declare name: String;
  declare password: String;
  declare email: String | null;
  declare phone: String;
  declare gender: String |null;
  declare location: String ;
  declare role: String;
  declare isActive: Boolean |null;
  declare readonly createdAt: Date |null;
  declare updatedAt:  Date | null;
  declare deletedAt: Date | null;

}

// class User extends Model {}

User.init(
  {
    id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unspecified'
    },

    location: {
      type: DataTypes.STRING,
      allowNull:false,
      defaultValue: 'Maputo Center'
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
 
  
  },

  
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);

export default User;
