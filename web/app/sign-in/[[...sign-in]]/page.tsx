import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Suspense fallback={null}>
        <SignIn />
      </Suspense>
    </div>
  );
}
