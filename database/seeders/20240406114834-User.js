// Const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          id: '8215a8ea-cf39-4037-81e6-86f6b439dcf4',
          name: 'Rukudno Venuste',
          email: 'hellodksd@gmail.com',
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
          storeId: '143e4667-a81d-12d3-c356-469311174300',
          phone: '+123456789023',
          role: 'admin',
          createdAt: new Date(),
        },
        {
          id: '8215a8ea-cf39-4037-81e6-86f6b439dcf5',
          name: 'keeper 1',
          email: 'keeper1@gmail.com',
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
          storeId: '143e4667-a81d-12d3-c356-469311174301',
          phone: '+123456789024',
          role:  'keeper',
          createdAt: new Date(),
        },
        {
          id: '8215a8ea-cf39-4037-81e6-86f6b439dcf6',
          name: 'keeper 2',
          email: 'keeper2@gmail.com',
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
          storeId: '143e4667-a81d-12d3-c356-469311174302',
          phone: '+123456789025',
          role: 'keeper',
          createdAt: new Date(),
        },
        {
          id: '8215a8ea-cf39-4037-81e6-86f6b439dcf7',
          name: 'user 1',
          email: 'user1@gmail.com',
          password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
          storeId: '143e4667-a81d-12d3-c356-469311174301',
          phone: '+123456789026',
          role: 'user',
          createdAt: new Date(),
        },
      ],
      {}
    )
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {})
  },
}
