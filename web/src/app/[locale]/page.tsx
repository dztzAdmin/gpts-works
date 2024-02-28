"use client";

import { useEffect, useState } from "react";

import Brand from "@/src/app/components/Brand";
import { GptsItem } from "@/src/app/types/gpts";
import GptsList from "@/src/app/components/GptsList";
import ProductHunt from "@/src/app/components/ProductHunt";
import Search from "@/src/app/components/Search";
import Tab from "@/src/app/components/Tab";
import { every } from "lodash";

type PageParams = {
  params: {
    locale: string;
  };
  searchParams: any;
};

export default (param: PageParams) => {
  const [gpts, setGpts] = useState<GptsItem[]>([]);
  const [gptsCount, setGptsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("hot");
  console.log(param, "param");
  const fetchGpts = async (tab: string) => {
    const params = {
      last_id: 0,
      limit: 50,
      tab: tab,
    };

    setLoading(true);
    const resp = await fetch("/api/gpts/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    setLoading(false);

    console.log(resp, "resp");
    if (resp.ok) {
      const res = await resp.json();
      console.log(res, "res");
      console.log(
        (res.data.result.rows as GptsItem[]).filter((i) => {
          return (
            i.city_town &&
            i.name &&
            i.company_url &&
            i.country &&
            i.exhibitors &&
            i.hall_stand &&
            i.is_listed &&
            i.postal_code
          );
        }),
        "过滤后"
      );
      // if (res.data) {
      setGptsCount(res.data.count);
      setGpts(
        (res.data.result.rows as GptsItem[]).filter((i) => {
          return (
            i.city_town &&
            i.name &&
            i.company_url &&
            i.country &&
            i.exhibitors &&
            i.hall_stand &&
            i.is_listed &&
            i.postal_code
          );
        })
      );
      // }
    }
  };

  useEffect(() => {
    fetchGpts(tabValue);
  }, [tabValue]);

  return (
    <>
      <Brand count={gptsCount} />
      {/* <ProductHunt /> */}
      <Search setGpts={setGpts} setLoading={setLoading} />
      <Tab tabValue={tabValue} setTabValue={setTabValue} />
      <GptsList gpts={gpts} loading={loading} />
    </>
  );
};
