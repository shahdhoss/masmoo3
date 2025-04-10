module.exports = (sequelize, DataTypes) => {
    const audiobooks = sequelize.define('audiobooks', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        uploader_id:{
            type: DataTypes.INTEGER,
            defaultValue: 21,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
        }, 
        language: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category :{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        author:{
            type: DataTypes.TEXT,
            allowNull: false,
        },  
        episodes:{
            type: DataTypes.JSON,
            allowNull: false,
        }
    })
sequelize.sync({ alter: true })
  .then(() => console.log('Database synced with alter mode '))
  .catch(err => console.error('Sync failed:', err));
return audiobooks
}