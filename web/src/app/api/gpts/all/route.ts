import {
  getLatestRows,
  getMysqlContactStatus,
  // getMysqlContactStatus,
  getRandRows,
  getTotalCount,
  queryPosts,
} from "@/src/app/models/gpts";
import { respData, respErr } from "@/src/app/utils/resp";
import { every } from "lodash";
export async function POST(req: Request) {
  try {

    if (req.body) {
 
      const params = await req.json();
      const { last_id, limit, tab } = params;

      const result_1 = await getMysqlContactStatus(limit)

      const count = await getTotalCount();

      // if (tab === "recommended") {
      //   const rows = await getRecommendedRows(last_id, limit);
      //   return respData({
      //     rows: rows,
      //     count: count,
      //   });
      // }

      // if (tab === "hot") {
      //   const rows = await getRecommendedRows(last_id, limit);
      //   return respData({
      //     rows: rows,
      //     count: count,
      //   });
      // }

    //   const rows = await getRandRows(last_id, limit);
    //   // return respData({
    //   //   rows: rows,
    //   //   count: count,
    //   // });
    console.log('返回数据')
    return respData({result:result_1,count})
   }
  }catch (e) {
    console.log("get all gpts failed: ", e);
    return respErr("get gpts failed");
  }
}

