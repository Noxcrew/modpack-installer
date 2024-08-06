import { useEffect } from "react";
import { useRouter } from "next/router";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://noxcrew.com");
  }, [router]);

  return null;
}
