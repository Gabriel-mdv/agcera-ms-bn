'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sales', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      paymentMethod: {
        allowNull: false,
        type: Sequelize.ENUM('CASH', 'MOMO'),
        defaultValue: 'MOMO',
      },
      clientId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      clientType: {
        allowNull: false,
        type: Sequelize.ENUM('USER', 'CLIENT'),
        defaultValue: 'USER',
      },
      shopId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Shops',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    })
  },
  async down(queryInterface, _) {
    await queryInterface.dropTable('Sales')
  },
}
