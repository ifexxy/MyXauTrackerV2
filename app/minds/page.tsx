import AuthGuard from '@/components/auth/AuthGuard';
import MindsContent from '@/components/minds/MindsContent';

export default function MindsPage() {
  return (
    <AuthGuard>
      <MindsContent />
    </AuthGuard>
  );
}
