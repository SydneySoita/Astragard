import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-astragard-dark flex items-center justify-center text-primary-foreground/60 font-ui">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
