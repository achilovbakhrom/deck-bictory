module.exports = (sequelize, Sequelize) => {
    const Nationality = sequelize.define("nationality", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Nationality;
  };