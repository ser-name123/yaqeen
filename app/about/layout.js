import { supabase } from "@/lib/supabase";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata(supabase, "about");
}

export default function AboutLayout({ children }) {
  return children;
}
