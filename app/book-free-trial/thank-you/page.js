import { redirect } from "next/navigation";

export default function BookFreeTrialThankYouRedirect() {
  redirect("/register/thank-you");
}
