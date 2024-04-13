'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Product 1',
          description: 'Description 1',
          type: 'NORMAL',
          costPrice: 10.0,
          sellingPrice: 15.0,
          createdAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Product 2',
          description: 'Description 2',
          type: 'NORMAL',
          costPrice: 20.0,
          sellingPrice: 25.0,
          createdAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Product 3',
          description: 'Description 3',
          type: 'NORMAL',
          costPrice: 30.0,
          sellingPrice: 35.0,
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {})
  },
}
