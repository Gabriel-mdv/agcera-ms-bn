'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.bulkInsert('Shops', [{
      id: '8215a8ea-cf39-4037-81e6-86f6b439dcf4',
      name: 'John Doe',
      location: 'maputo',
      isActive: true,
      phone: '+123456789023',
      createdAt: new Date(),
     }], {});

  },

  async down (queryInterface, Sequelize) {
  
      await queryInterface.bulkDelete('Shops', null, {});
    
  }
};
