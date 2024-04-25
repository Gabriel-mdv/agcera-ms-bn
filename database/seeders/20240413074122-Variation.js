'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Variations',
      [
        {
          id: '3f33b9d1-9b11-4d85-a3c3-8d1676a67110',
          name: 'Basic',
          description: 'Basic',
          costPrice: 100,
          sellingPrice: 200,
          createdAt: new Date(),
          productId: '123e4567-e89b-12d3-a456-426614174001',
        },
        {
          id: '3f33b9d1-9b11-4d85-a3c3-8d1676a67111',
          name: 'Standard',
          description: 'Standard',
          costPrice: 200,
          sellingPrice: 400,
          createdAt: new Date(),
          productId: '123e4567-e89b-12d3-a456-426614174002',
        },
        {
          id: '3f33b9d1-9b11-4d85-a3c3-8d1676a67112',
          name: 'Premium',
          description: 'Premium',
          costPrice: 300,
          sellingPrice: 600,
          createdAt: new Date(),
          productId: '123e4567-e89b-12d3-a456-426614174003',
        },
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Variations', null, {});
  },
};
