import { redirect } from "next/navigation";

// Setup removido — workspace é único e fixo (WebGenios). Redireciona pra home.
export default function SetupPage() {
  redirect("/");
}
