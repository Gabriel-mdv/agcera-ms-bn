'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('Variations', [{
        name: 'Basic',
        detail: 'Basic',
        costPrice: 100,
        sellingPrice: 200,
        createdAt: new Date(),
        productId: '987fbc97-4bed-5078-9f07-9141ba07c9f3'
      }], {});

  },

  async down (queryInterface, Sequelize) {

     await queryInterface.bulkDelete('Variations', null, {});

  }
};
