"use client";
import ProfilePage from "@/components/user/profile/profile-page/profile-page";
import { useParams } from "next/navigation";

export default function UserPage() {
  const { id } = useParams();
  const userId = Array.isArray(id) ? id[0] : id ?? "";

  return <ProfilePage userId={userId}></ProfilePage>;
}
