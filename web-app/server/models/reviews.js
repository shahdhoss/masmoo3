module.exports = (sequelize, DataTypes) => {
    const reviews = sequelize.define(
      "reviews",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        review_text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        rating: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            min: 1,
            max: 10,
          },
        },
        audiobookid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        userid: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        tableName: "reviews",
      }
    )
  
    return reviews
  }