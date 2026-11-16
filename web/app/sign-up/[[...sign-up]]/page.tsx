import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Suspense fallback={null}>
        <SignUp />
      </Suspense>
    </div>
  );
}
