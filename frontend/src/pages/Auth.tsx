import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function Auth() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold mb-2">Sign in with Google</h1>
        <p className="text-muted-foreground mb-6">Access your role-based dashboard instantly</p>
        <div className="flex items-center justify-center">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
