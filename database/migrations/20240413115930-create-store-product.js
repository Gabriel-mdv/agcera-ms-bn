'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StoreProducts', {
      id: {
        unique: true,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
        },
      },
      storeId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Stores',
          key: 'id',
        },
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
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
    await queryInterface.dropTable('StoreProducts')
  },
}
