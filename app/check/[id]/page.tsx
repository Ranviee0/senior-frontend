import { getTempLandById } from "@/lib/server-api";
import { notFound } from "next/navigation";
import type { TempLandDetailOut } from "@/types/data";
import CheckDetailContent from "./CheckDetailContent";

type Props = {
  params: { id: string };
};

export default async function CheckDetailPage({ params }: Props) {
  const id = parseInt(params.id);

  let land: TempLandDetailOut;
  try {
    land = await getTempLandById(id);
  } catch {
    return notFound();
  }

  return <CheckDetailContent land={land} />;
}
