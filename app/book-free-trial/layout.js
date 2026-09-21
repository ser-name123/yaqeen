import { supabase } from "@/lib/supabase";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  return pageMetadata(supabase, "bookTrial");
}

export default function BookTrialLayout({ children }) {
  return children;
}
