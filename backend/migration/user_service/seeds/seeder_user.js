/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  await knex('transaction_koin').del();
  await knex('koin').del();
  await knex('users').del();

  const usersData = Array.from({ length: 100 }, () => {
    const firstName = faker.person.firstName().toLowerCase().replace(/[^a-z]/g, '');
    const lastName = faker.person.lastName().toLowerCase().replace(/[^a-z]/g, '');
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const email = `${firstName}_${lastName}@gmail.com`;
    const role = 'guest';
    const plainPassword = 'password123';
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds)
      .then(hashedPassword => ({
        username: username,
        first_name: firstName,
        last_name: lastName,
        email: email,
        role: role,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      }));
  });

  let insertedUserIds = [];
  try {
    const resolvedUsers = await Promise.all(usersData);
    await knex('users').insert(resolvedUsers);
    insertedUserIds = await knex('users').select('user_id').orderBy('created_at', 'desc').limit(100); // Ambil 100 ID terakhir yang di-insert
    console.log(`${insertedUserIds.length} users berhasil ditambahkan.`);
    console.log('insertedUserIds:', insertedUserIds);
  } catch (error) {
    console.error('Error saat menambahkan users:', error);
    return;
  }

  const koinData = insertedUserIds.map(user => ({
    user_id: user.user_id,
    amount: Math.floor(Math.random() * 100) + 50,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  try {
    await knex('koin').insert(koinData);
    console.log(`${koinData.length} data koin berhasil ditambahkan.`);
  } catch (error) {
    console.error('Error saat menambahkan koin:', error);
  }

  // Seed transaction_koin
  const transactionKoinData = [];
  const methodTargets = ['BCA', 'BRI', 'MANDIRI', 'GOPAY', 'DANA', 'OVO'];

  for (const user of insertedUserIds) {
    const numTransactions = Math.floor(Math.random() * 3) + 1; // 1-3 transactions per user
    for (let i = 0; i < numTransactions; i++) {
      transactionKoinData.push({
        user_id: user.user_id,
        number_target: Math.floor(Math.random() * 100000), // Random number target
        method_target: faker.helpers.arrayElement(methodTargets), // Random method target
        method_pay: null, // method_pay is null
        amount: Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000, // Amount between 1000 and 50000
        status: 'pending', // Default status
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  try {
    await knex('transaction_koin').insert(transactionKoinData);
    console.log(`${transactionKoinData.length} transaction_koin data added.`);
  } catch (error) {
    console.error('Error adding transaction_koin data:', error);
  }
};