/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Tabel utama: postingan
  await knex.schema.createTable("postingan", (table) => {
    table.increments("id").primary(); // id sebagai primary key
    table.integer("user_id").notNullable(); // user_id sebagai foreign key
    table.enum("type", ["text", "image", "video", "polling", "map"]).notNullable().defaultTo("text"); // type sebagai enum
    table.text("content").notNullable(); // content sebagai teks postingan
    table.enum("status", ["active", "draft"]).notNullable().defaultTo("active"); // status sebagai enum active/draft
    table.timestamp("created_at").defaultTo(knex.fn.now()); // timestamp created_at
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // timestamp updated_at
  });

  // Tabel khusus: postingan_image
  await knex.schema.createTable("postingan_image", (table) => {
    table.increments("id").primary(); // id sebagai primary key
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE"); // foreign key ke tabel postingan
    table.text("image").notNullable(); // kolom URL gambar
    table.timestamp("created_at").defaultTo(knex.fn.now()); // timestamp created_at
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // timestamp updated_at
  });

  // Tabel khusus: postingan_video
  await knex.schema.createTable("postingan_video", (table) => {
    table.increments("id").primary(); // id sebagai primary key
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE"); // foreign key ke tabel postingan
    table.text("url_video").notNullable(); // kolom URL video
    table.timestamp("created_at").defaultTo(knex.fn.now()); // timestamp created_at
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // timestamp updated_at
  });

  // Tabel khusus: postingan_polling
  await knex.schema.createTable("postingan_polling", (table) => {
    table.increments("id").primary(); // id sebagai primary key
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE"); // foreign key ke tabel postingan
    table.text("content").notNullable(); // kolom untuk isi polling
    table.integer("select_percentage").notNullable().defaultTo(0); // persentase pemilih polling
    table.integer("select_user_id").unsigned(); // user yang memilih polling
    table.timestamp("created_at").defaultTo(knex.fn.now()); // timestamp created_at
    table.timestamp("updated_at").defaultTo(knex.fn.now()); // timestamp updated_at
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
