'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sp_brands', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp_coating', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp_color_palitry', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp_masonry', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp-sale-type', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp_size_rate', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('spTextureModels', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('sp-facture', 'position', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sp_brands', 'position');
    await queryInterface.removeColumn('sp_coating', 'position');
    await queryInterface.removeColumn('sp_color_palitry', 'position');
    await queryInterface.removeColumn('sp_masonry', 'position');
    await queryInterface.removeColumn('sp-sale-type', 'position');
    await queryInterface.removeColumn('sp_size_rate', 'position');
    await queryInterface.removeColumn('spTextureModels', 'position');
    await queryInterface.removeColumn('sp-facture', 'position');
  }
};
