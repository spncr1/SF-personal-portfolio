import type { Metadata } from "next";
import { ActiveOperations } from "@/components/operations/ActiveOperations";

export const metadata: Metadata = {
  title: "Active Operations | Spencer Fisher",
};

export default function OperationsPage() {
  return <ActiveOperations />;
}
