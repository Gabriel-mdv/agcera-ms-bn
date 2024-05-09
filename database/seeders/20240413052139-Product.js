'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Products',
      [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Product 1',
          type: 'STANDARD',
          createdAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Product 2',
          type: 'STANDARD',
          createdAt: new Date(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          name: 'Product 3',
          type: 'STANDARD',
          createdAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Products', null, {});
  },
};
