'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
      unique: true,
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    name: {
      unique: true,
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('STANDARD', 'SPECIAL'),
      allowNull: false,
      defaultValue: 'STANDARD',
    },
    description: Sequelize.STRING,
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: new Date(),
    },
    updatedAt: Sequelize.DATE,
    deletedAt: Sequelize.DATE,
    })
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Products')
  },
}
