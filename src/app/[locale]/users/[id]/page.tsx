"use client";
import ProfilePage from "@/components/user/profile/profile-page/profile-page";
import { useSearchParams, useParams } from "next/navigation";

export default function UserPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id ?? "";
  const searchParams = useSearchParams();
  const searchParamTab = searchParams.get("tab");
  return (
    <ProfilePage userId={userId} tabActive={searchParamTab ?? "general"} />
  );
}
