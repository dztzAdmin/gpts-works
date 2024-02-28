import { BsDownload } from "react-icons/bs";
import { GptsItem } from "@/src/app/types/gpts";
import GptsDetail from "@/src/app/components/GptsDetail";
import Image from "next/image";
import extensionSrc from "@/public/extension.png";
import { findByUuid } from "@/src/app/models/gpts";

async function getData(uuid: string): Promise<GptsItem | undefined> {
  if (!uuid) {
    return;
  }

  const gpts = await findByUuid(uuid);

  return gpts;
}

export default async ({ params }: { params: { uuid: string } }) => {
  const data = await getData(params.uuid);

  return (
    <section className="relatve">
      <div className="mx-auto w-full max-w-7xl px-5 py-2">
        {data && <GptsDetail gpts={data} />}
      </div>
    </section>
  );
};
