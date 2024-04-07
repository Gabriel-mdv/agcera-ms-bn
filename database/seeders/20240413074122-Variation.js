'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('Variations', [{
        id: '3f33b9d1-9b11-4d85-a3c3-8d1676a67115',
        name: 'Basic',
        description: 'Basic',
        costPrice: 100,
        sellingPrice: 200,
        createdAt: new Date(),
        productId: 'ba86b8f0-6fdf-4944-87a0-8a491a19490e'
      }], {});

  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Variations', null, {});

  }
};
