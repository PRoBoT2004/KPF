import Link from "next/link";
import { MOCKS } from "@/components/lab/registry";

export default function LabIndex() {
  return (
    <main className="min-h-screen bg-[#111] p-10 text-white">
      <h1 className="mb-6 text-2xl font-bold">Lab</h1>
      <ul className="grid grid-cols-3 gap-2">
        {Object.keys(MOCKS).map((id) => (
          <li key={id}><Link className="underline" href={`/lab/${id}`}>{id}</Link></li>
        ))}
      </ul>
    </main>
  );
}
