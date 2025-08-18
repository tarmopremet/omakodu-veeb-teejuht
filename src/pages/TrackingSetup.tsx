import { TrackingConfig } from '@/components/TrackingConfig';
import { RendiIseHeader } from '@/components/RendiIseHeader';
import { Footer } from '@/components/Footer';

const TrackingSetup = () => {
  return (
    <div className="min-h-screen bg-background">
      <RendiIseHeader />
      <main className="container mx-auto py-8">
        <TrackingConfig />
      </main>
      <Footer />
    </div>
  );
};

export default TrackingSetup;