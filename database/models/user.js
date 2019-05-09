module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        weight: DataTypes.STRING,
        job: DataTypes.STRING
    }, {
        freezeTableName: true
    })
}