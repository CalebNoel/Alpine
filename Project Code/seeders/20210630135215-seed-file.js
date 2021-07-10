'use strict';
const bcrypt = require("bcrypt")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = await bcrypt.genSalt(10);

    await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        email:'john@example.com',
        password: await bcrypt.hash('patientlyWait', salt),
        phone_no: '14155550132',
        user_rating: 0.0,
        dob: new Date('01 Jan 1970'),
        createdAt:new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Doe',
        email:'jane@example.com',
        password: await bcrypt.hash('patientlyWait', salt),
        phone_no: '14155556132',
        user_rating: 0.0,
        dob: new Date('25 Jan 1970'),
        createdAt:new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Slasher Doe',
        email:'slash@example.com',
        password: await bcrypt.hash('patientlyWait', salt),
        phone_no: '14155550135',
        user_rating: 0.0,
        dob: new Date('31 Mar 1992'),
        createdAt:new Date(),
        updatedAt: new Date()
      }
    ], {});


    await queryInterface.bulkInsert('Destinations',[
      {
        name: 'Realization Point',
        lang: 105.308889,
        lat: 36.997222,
        address: 'Flagstaff Rd, Boulder, CO 80302, United States',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Boulder Canyon Trail',
        lang: 105.308611,
        lat: 40.013333,
        address: 'Boulder Creek Path, Boulder, CO 80302, United States',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],{});


    await queryInterface.bulkInsert('UserFavs',[
      {
        dest_id: 1,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dest_id: 1,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dest_id: 2,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        dest_id : 1,
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],{});

    await queryInterface.bulkInsert('Rides',[
      {
        departure: new Date('08 Jul 2021'),
        end_date: new Date('11 Jul 2021'),
        start_point: 'Somewhere',
        fare_share: 300,
        car_model: 'Toyota Camry',
        seats_available: 3,
        driver_id: 1,
        dest_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departure: new Date('05 Jul 2021'),
        fare_share: 150,
        end_date: new Date('7 Jul 2021'),
        start_point: 'Nowhere',
        car_model: 'Toyota Camry',
        seats_available: 1,
        driver_id: 3,
        dest_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        departure: new Date('10 Jul 2021'),
        fare_share: 250,
        end_date: new Date('11 Jul 2021'),
        start_point: 'Anywhere',
        car_model: 'Honda Accord',
        seats_available: 4,
        driver_id: 3,
        dest_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ],{});

    await queryInterface.bulkInsert('RideUsers',[
      {
        ride_id: 1,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ride_id: 1,
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ride_id: 3,
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ride_id: 3,
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    await queryInterface.bulkInsert('RideRates',[
      {
        ride_id: 1,
        ratee_id: 2,
        rater_id: 1,
        rating: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ride_id: 1,
        ratee_id: 3,
        rater_id: 1,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ride_id: 1,
        ratee_id: 1,
        rater_id: 2,
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      
    ]);

    await queryInterface.bulkInsert('Chats',[
      {
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])

    await queryInterface.bulkInsert('ChatLines',[
      {
        user_id: 1,
        chat_id: 1,
        line_text: '::',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        chat_id: 1,
        line_text: '::',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 3,
        chat_id: 2,
        line_text: '::',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        user_id: 2,
        chat_id: 2,
        line_text: '::',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);

    


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('ChatLines', null, {});
     await queryInterface.bulkDelete('RideRates', null, {});
     await queryInterface.bulkDelete('RideUsers', null, {});
     await queryInterface.bulkDelete('UserFavs', null, {});
     await queryInterface.bulkDelete('Chats', null, {});
     await queryInterface.bulkDelete('Rides', null, {});
     await queryInterface.bulkDelete('Users', null, {});
     await queryInterface.bulkDelete('Destinations', null, {});



  }
};
