import { Model, Sequelize, DataTypes } from "sequelize";

export default class Category extends Model {
  public id?: number;
  public name!: string;
  public parent_id!: number;
}

export const CategoryMap = (sequelize: Sequelize) => {
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
      },
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "categories",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "categories",
      timestamps: true,
    }
  );

  // Define Relationship
  Category.hasMany(Category, {
    foreignKey: "parent_id",
    as: "subcategories",
  });
  Category.belongsTo(Category, { as: "parent", foreignKey: "parent_id" });

  Category.sync();
};
