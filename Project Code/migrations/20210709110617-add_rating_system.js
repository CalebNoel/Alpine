'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users', 'user_rating', {
      type: Sequelize.DECIMAL
    });
    await queryInterface.addColumn('Rides', 'driver_rating', {
      type: Sequelize.INTEGER
    });
    await queryInterface.addColumn('RideUsers', 'rider_rating', {
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropColumn('Users', 'user_rating', {
      type: Sequelize.DECIMAL
    });

    await queryInterface.dropColumn('Rides', 'driver_rating', {
      type: Sequelize.INTEGER
    });

    await queryInterface.dropColumn('RideUsers', 'rider_rating', {
      type: Sequelize.INTEGER
    });
  }
};
