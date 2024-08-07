'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sp_masonry', 'brandId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sp_masonry', 'brandId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'sp_brands',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
