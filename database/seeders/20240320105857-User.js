
// const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      id: '8215a8ea-cf39-4037-81e6-86f6b439dcf4',
      name: 'John Doe',
      email: 'hjdksd@gmail.com',
      password: '1234',
      createdAt: new Date(),
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};



