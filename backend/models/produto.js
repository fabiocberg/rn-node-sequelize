'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Produto.belongsTo(models.Loja, {
        foreignKey: 'lojaId',
        onDelete: 'CASCADE',
      })
    }
  };
  Produto.init({
    nome: DataTypes.STRING,
    quantidade: DataTypes.INTEGER,
    lojaId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Produto',
  });
  return Produto;
};