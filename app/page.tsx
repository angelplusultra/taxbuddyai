import { Metadata } from "next";
import { AppSteps } from "@/components/app-steps";

export const metadata: Metadata = {
  title: "Tax Buddy AI",
  description: "Automated Tax Return Preparation",
};

const Index = () => {
  return <AppSteps />;
};

export default Index;
