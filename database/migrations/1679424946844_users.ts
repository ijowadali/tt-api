import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.integer("shop_id").unsigned().nullable().references("shops.id");
      table.string("email").notNullable().unique().index();
      table.string("phone_number").nullable();
      table.string("password").notNullable();
      table.string("user_type").nullable();
      table.boolean("remember_token").nullable();
      table.boolean("is_email_verified").defaultTo(false).index();
      table.timestamp("email_verified_time").nullable();
      table.boolean("is_phone_verified").defaultTo(false).index();
      table.timestamp("phone_verified_time").nullable();
      table.boolean("status").defaultTo(false).index();

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).defaultTo(this.now());
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
