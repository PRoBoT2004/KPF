import { notFound } from "next/navigation";
import { MOCKS } from "@/components/lab/registry";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(MOCKS).map((id) => ({ id }));
}

export default function LabMock({ params }) {
  const Mock = MOCKS[params.id];
  if (!Mock) notFound();
  return <Mock />;
}
