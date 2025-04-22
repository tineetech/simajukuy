/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Tabel utama: postingan
  await knex.schema.createTable("postingan", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.text("caption").nullable();
    table.enu("type", ["image", "video", "polling", "text"]).notNullable();
    table.boolean("status").defaultTo(true);
    table.integer("like").notNullable().defaultTo(0); // Kolom like ditambahkan di sini
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Tabel khusus: postingan_image
  await knex.schema.createTable("postingan_image", (table) => {
    table.increments("id").primary();
    table
      .integer("postingan_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.text("url").notNullable();
    table.integer("size").notNullable(); // byte
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Tabel khusus: postingan_video
  await knex.schema.createTable("postingan_video", (table) => {
    table.increments("id").primary();
    table
      .integer("postingan_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.text("url").notNullable();
    table.integer("duration").notNullable(); // dalam detik
    table.integer("size").notNullable(); // byte
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Tabel khusus: postingan_polling
  await knex.schema.createTable("postingan_polling", (table) => {
    table.increments("id").primary();
    table
      .integer("postingan_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.string("question").notNullable();
    table.json("options").notNullable(); // array JSON untuk pilihan
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("postingan_polling");
  await knex.schema.dropTableIfExists("postingan_video");
  await knex.schema.dropTableIfExists("postingan_image");
  await knex.schema.dropTableIfExists("postingan");
};
