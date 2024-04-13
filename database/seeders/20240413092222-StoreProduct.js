'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'StoreProducts',
      [
        {
          id: 'a5aa7e8b-9306-4ff2-a19a-5ab633c206c0',
          quantity: 50,
          storeId: '143e4667-a81d-12d3-c356-469311174300',
          productId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date(),
        },
        {
          id: 'a5aa7e8b-9306-4ff2-a19a-5ab633c206c1',
          quantity: 50,
          storeId: '143e4667-a81d-12d3-c356-469311174300',
          productId: '123e4567-e89b-12d3-a456-426614174002',
          createdAt: new Date(),
        },
        {
          id: 'a5aa7e8b-9306-4ff2-a19a-5ab633c206c2',
          quantity: 10,
          storeId: '143e4667-a81d-12d3-c356-469311174301',
          productId: '123e4567-e89b-12d3-a456-426614174003',
          createdAt: new Date(),
        },
        {
          id: 'a5aa7e8b-9306-4ff2-a19a-5ab633c206c3',
          quantity: 10,
          storeId: '143e4667-a81d-12d3-c356-469311174301',
          productId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('StoreProducts', null, {})
  },
}
