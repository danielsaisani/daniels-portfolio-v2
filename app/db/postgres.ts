import postgres from 'postgres';

const testing = process.env.TESTING==="true"

export const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: !testing,
});