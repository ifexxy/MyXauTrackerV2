import AuthGuard from '@/components/auth/AuthGuard';
import PredictContent from '@/components/predict/PredictContent';

export default function PredictPage() {
  return (
    <AuthGuard>
      <PredictContent />
    </AuthGuard>
  );
}
