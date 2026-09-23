import { redirect } from "next/navigation";

export default function BookFreeTrialRedirect() {
  redirect("/register");
}
