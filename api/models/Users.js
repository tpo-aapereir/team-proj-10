const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'First Name is required' },
        notEmpty: { msg: 'First Name cannot be empty' }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Last Name is required' },
        notEmpty: { msg: 'Last Name cannot be empty' }
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'The email entered is already in use. Please use a different email or log in' },
      validate: {
        notNull: { msg: 'Email address is required' },
        notEmpty: { msg: 'Email address cannot be empty' },
        isEmail: { msg: 'Please enter a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        notEmpty: { msg: 'Password cannot be empty' }
      }
    }
  }, { sequelize })

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId'
      }
    })
  }

  return User
}
