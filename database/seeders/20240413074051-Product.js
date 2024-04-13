'use strict';
const { v4: uuidv4 } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

      await queryInterface.bulkInsert('Products', [{
      id: '987fbc97-4bed-5078-9f07-9141ba07c9f3',
       name: 'Cera Meister',
       description: 'Cera Meister',
        price: 1000,
        qt_in_stoct: 10,
        type: 'normal',
        costPrice: 500,
        sellingPrice: 1000,
        storeId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: new Date(),
     }], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Products', null, {});

  }
};