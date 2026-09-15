import type { Metadata } from "next";
import { PersonnelRecord } from "@/components/personnel/PersonnelRecord";

export const metadata: Metadata = {
  title: "Personnel Record | Spencer Fisher",
};

export default function PersonnelPage() {
  return <PersonnelRecord />;
}
