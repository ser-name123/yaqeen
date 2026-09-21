import { supabase } from "@/lib/supabase";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata(supabase, "contact");
}

export default function ContactLayout({ children }) {
  return children;
}
