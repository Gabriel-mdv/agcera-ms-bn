'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Stores',
      [
        { // This should always be there. It is the main store
          id: '143e4667-a81d-12d3-c356-469311174300',
          name: 'main',
          location: 'Maputo 12',
          phone: '+258840000000',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: '143e4667-a81d-12d3-c356-469311174301',
          name: 'Store 2',
          location: 'Maputo 13',
          phone: '+258840000001',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: '143e4667-a81d-12d3-c356-469311174302',
          name: 'Store 3',
          location: 'Maputo 14',
          phone: '+258840000002',
          isActive: true,
          createdAt: new Date(),
        },
      ],
      {}
    )
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Stores', null, {})
  },
}
