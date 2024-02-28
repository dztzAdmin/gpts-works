import { getUuids, insertRow } from "@/src/app/models/gpts";

import { getGptsFromFile } from "@/src/app/services/gpts";

export async function POST() {
  try {
    const uuids = await getUuids();
    const allGpts = await getGptsFromFile();
    const allGptsCount = allGpts.length;

    console.log(
      `all gpts count: ${allGptsCount}, exist gpts count: ${uuids.length}`
    );

    let existCount = 0;
    let newCount = 0;
    let failedCount = 0;
    for (let i = 0; i < allGptsCount; i++) {
      const gpt = allGpts[i];
      if (!gpt.id) {
        continue;
      }

      if (uuids && uuids.includes(gpt.id.toString())) {
        console.log("gpt exist: ", gpt.id, gpt.company_name);
        existCount += 1;
        continue;
      }

      try {
        await insertRow(gpt);
        newCount += 1;
        console.log(
          "insert new gpts: ",
          gpt.id,
          gpt.company_name,
          i,
          allGptsCount - i
        );
      } catch (e) {
        failedCount += 1;
        console.log("insert gpts failed: ", gpt.id, gpt.company_name, i, e);
      }
    }

    return Response.json({
      data: {
        all_count: allGptsCount,
        exist_count: existCount,
        new_count: newCount,
        failed_count: failedCount,
      },
    });
  } catch (e) {
    console.log("update gpts failed: ", e);
    return Response.json({ error: e });
  }
}
