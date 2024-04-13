/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'SaleProducts',
      [
        {
          id: '5d432d64-5991-4c00-9f70-7bc89e4375e0',
          quantity: 20,
          saleId: '7ffdcde2-a8dc-427f-bac2-863f52401fc0',
          productId: '123e4567-e89b-12d3-a456-426614174001',
          createdAt: new Date(),
        },
        {
          id: '5d432d64-5991-4c00-9f70-7bc89e4375e1',
          quantity: 10,
          saleId: '7ffdcde2-a8dc-427f-bac2-863f52401fc0',
          productId: '123e4567-e89b-12d3-a456-426614174002',
          createdAt: new Date(),
        }
      ],
      {}
    )
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('SaleProducts', null, {})
  },
}
