// Const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('Users', [{
      id: '8215a8ea-cf39-4037-81e6-86f6b439dcf4',
      name: 'Rukudno Venuste',
      email: 'hellodksd@gmail.com',
      password: '1234',
      storeId: '123e4567-e89b-12d3-a456-426614174000',
      phone: '+123456789023',
      createdAt: new Date(),
    }], {});
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
