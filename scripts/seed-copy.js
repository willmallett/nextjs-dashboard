const { db } = require('@vercel/postgres');
const postgres = require('postgres');
const {users, invoices, customers, revenue} = require("../app/lib/placeholder-data");
const bcrypt = require("bcrypt");

async function seedUsers(sql) {
  try {
    const insertedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);

          return sql`
            INSERT INTO dashboard.users (id, name, email, password)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
            ON CONFLICT (id) DO NOTHING;
          `;
        }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCustomers(sql) {
  try {
    const insertedCustomers = await Promise.all(
        customers.map(
            (customer) => sql`
        INSERT INTO dashboard.customers (id, name, email, image_url)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    console.log(`Seeded ${insertedCustomers.length} customers`);

    return {
      customers: insertedCustomers,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}


async function seedInvoices(sql) {
  try {
    const insertedInvoices = await Promise.all(
        invoices.map(
            (invoice) => sql`
        INSERT INTO dashboard.invoices (customer_id, amount, status, date)
        VALUES (${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
        ON CONFLICT (id) DO NOTHING;
      `,
        ),
    );

    console.log(`Seeded ${insertedInvoices.length} invoices`);

    return {
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedRevenue(sql) {
  try {
    const insertedRevenue = await Promise.all(
        revenue.map(
            (rev) => sql`
        INSERT INTO dashboard.revenue (month, revenue)
        VALUES (${rev.month}, ${rev.revenue})
        ON CONFLICT (month) DO NOTHING;
      `,
        ),
    );

    console.log(`Seeded ${insertedRevenue.length} revenue`);

    return {
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}



async function main() {
  const sql = postgres({
    host: 'localhost',
    port: 5432,
    password: 'dashboard_api_ps',
    database: 'dashboardapidb',
    username: 'dashboard_api',
  });

  await seedUsers(sql);
  await seedCustomers(sql);
  await seedInvoices(sql);
  await seedRevenue(sql);

  sql.end();
  console.log('Database seeding complete');
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
