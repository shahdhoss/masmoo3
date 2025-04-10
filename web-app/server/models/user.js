module.exports = (sequelize, DataTypes) => {
const users = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fav_books:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    listen_later:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    reviews:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    bio:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_pic:{
        type: DataTypes.BLOB("long"),
        allowNull: true,
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
})
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced with alter mode '))
  .catch(err => console.error('Sync failed:', err));
return users
}