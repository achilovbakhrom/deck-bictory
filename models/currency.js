module.exports = (sequelize, Sequelize) => {
    const Currency = sequelize.define("currency", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      }
    });
  
    return Currency;
  };