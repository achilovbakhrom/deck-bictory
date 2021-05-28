module.exports = (sequelize, Sequelize) => {
    const homeEmail = sequelize.define("homeEmail", {
        email: {
            type: Sequelize.STRING
          },
        value: {
            type: Sequelize.STRING
        }
    });
  
    return homeEmail;
  };