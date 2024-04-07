'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
      await queryInterface.bulkInsert('Stores', [{
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        location: 'Maputo 12',
        phone: '258840000000',
        createdAt: new Date(),
     }], {});

  },
  
  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Stores', null, {});
  }
};
