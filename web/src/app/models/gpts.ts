import { QueryResult, QueryResultRow, createClient, sql } from "@vercel/postgres";

import { GptsItem } from "../types/gpts";

/**未使用 */
export async function createTable() {
  const res = await sql`CREATE TABLE gpts (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(50) UNIQUE NOT NULL,
    org_id VARCHAR(50),
    name VARCHAR(50),
    description TEXT,
    avatar_url VARCHAR(255),
    short_url VARCHAR(100),
    author_id VARCHAR(50),
    author_name VARCHAR(50),
    created_at timestamptz,
    updated_at timestamptz,
    detail JSON 
);`;

  return res;
}

export async function queryPosts() {
  const client = createClient();
  await client.connect();
 
  try {
    const res =
      await client.sql`SELECT * FROM gpts`;
      return res
  } finally {
    await client.end();
  }
}

export async function getMysqlContactStatus(limit: number): Promise<any> {
  console.log(process.env.POSTGRES_URL,'process.env.POSTGRES_URL')
  const res = await sql`SELECT * FROM gpts`;
  console.log(res,'res')
  if (res.rowCount === 0) {
    return [];
  }


  return res
}


export async function insertRow(gpts: GptsItem) {
//   const res = await sql`INSERT INTO gpts 
//     (uuid, org_id, name, description, avatar_url, short_url, author_id, author_name, created_at, updated_at, detail) 
//     VALUES 
//     (${gpts.uuid}, ${gpts.org_id}, ${gpts.name}, ${gpts.description}, ${gpts.avatar_url}, ${gpts.short_url}, ${gpts.author_id}, ${gpts.author_name}, ${gpts.created_at}, ${gpts.updated_at}, ${gpts.detail})
// `;

  return undefined;
}

export async function getUuids(): Promise<string[]> {
  const res = await sql`SELECT uuid FROM gpts`;
  if (res.rowCount === 0) {
    return [];
  }

  const { rows } = res;
  let uuids: string[] = [];
  rows.forEach((row) => {
    uuids.push(row.uuid);
  });

  return uuids;
}

export async function getRows(last_id: number, limit: number): Promise<GptsItem[]> {
  const res =
    await sql`SELECT * FROM gpts WHERE id > ${last_id} LIMIT ${limit} `;
  if (res.rowCount === 0) {
    return [];
  }

  const gpts: GptsItem[] = [];
  const { rows } = res;

  rows.forEach((row) => {
    const gpt = formatGpts(row);
    if (gpt) {
      gpts.push(gpt);
    }
  });

  return gpts;
}

export async function getRowsByName(name: string): Promise<GptsItem[]> {
  const keyword = `%${name}%`;
  const res =
    await sql`SELECT * FROM gpts WHERE name ILIKE ${keyword} ORDER BY sort DESC LIMIT 50`;

  return getGptsFromSqlResult(res);
}

export async function getRandRows(
  last_id: number,
  limit: number
): Promise<GptsItem[]> {
  const res =
    await sql`SELECT * FROM gpts WHERE id > ${last_id} ORDER BY RANDOM() LIMIT ${limit}`;

  return getGptsFromSqlResult(res);
}

export async function getLatestRows(
  last_id: number,
  limit: number
): Promise<GptsItem[]> {
  const res =
    await sql`SELECT * FROM gpts WHERE id > ${last_id} ORDER BY created_at DESC LIMIT ${limit}`;

  return getGptsFromSqlResult(res);
}

// export async function getRecommendedRows(
//   last_id: number,
//   limit: number
// ): Promise<Gpts[]> {
//   const res =
//     await sql`SELECT * FROM gpts WHERE is_recommended=true AND id > ${last_id} ORDER BY sort DESC LIMIT ${limit}`;

//   return getGptsFromSqlResult(res);
// }

// export async function getHotRows(
//   last_id: number,
//   limit: number
// ): Promise<Gpts[]> {
//   const res =
//     await sql`SELECT * FROM gpts WHERE rating IS NOT null AND id > ${last_id} ORDER BY rating DESC, sort DESC LIMIT ${limit}`;

//   return getGptsFromSqlResult(res);
// }

export async function getTotalCount(): Promise<number> {
  const res = await sql`SELECT count(1) as count FROM gpts LIMIT 1`;
  if (res.rowCount === 0) {
    return 0;
  }

  const { rows } = res;
  const row = rows[0];

  return row.count;
}

export async function findByUuid(uuid: string): Promise<GptsItem | undefined> {
  const res = await sql`SELECT * FROM gpts WHERE id = ${uuid} LIMIT 1`;
  if (res.rowCount === 0) {
    return undefined;
  }

  const { rows } = res;
  const row = rows[0];
  const gpts = formatGpts(row);

  return gpts;
}

function getGptsFromSqlResult(res: QueryResult<QueryResultRow>): GptsItem[] {
  if (res.rowCount === 0) {
    return [];
  }

  const gpts: GptsItem[] = [];
  const { rows } = res;
  rows.forEach((row) => {
    const gpt = formatGpts(row);
    if (gpt) {
      gpts.push(gpt);
    }
  });

  return gpts;
}

function formatGpts(row: QueryResultRow): GptsItem | undefined {
  const gpts: GptsItem = {
    "id": row.id,
    "exhibitors": row.exhibitors,
    "name": row.name,
    "company_url": row.company_url,
    "grede": row.grede,
    "is_listed": row.is_listed,
    "origin_of_brand": row.origin_of_brand,
    "country": row.country,
    "postal_code": row.postal_code,
    "city_town": row.city_town,
    "hall_stand": row.hall_stand
};

  return gpts;
}
