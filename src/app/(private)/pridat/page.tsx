// src/app/private/pridat/page.tsx
import AuthGuard from '@/components/AuthGuard';

export default function PridatPage() {
  return (
    <AuthGuard>
      <div>Private Content Only for Authenticated Users</div>
    </AuthGuard>
  );
}
