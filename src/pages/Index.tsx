
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/common/Header';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 space-y-6 mb-10 md:mb-0">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Create Magical <span className="text-primary">Visual Stories</span> with AI
                </h1>
                <p className="text-xl text-muted-foreground">
                  Unleash your creativity with our AI-powered storytelling platform. Choose your theme, style, and topic to generate stunning visual stories.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" onClick={() => navigate(user ? '/create' : '/signup')}>
                    {user ? 'Create a Story' : 'Get Started'}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/explore')}>
                    Explore Stories
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 relative">
                <div className="relative h-[400px] md:h-[500px] w-full">
                  <div className="absolute top-4 right-4 z-10 w-64 h-80 rounded-lg overflow-hidden shadow-2xl animate-float">
                    <img 
                      src="/lovable-uploads/a892baf2-b3e4-442d-a2d1-907259c7d0c7.png" 
                      alt="Child using computer with magical background" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 w-64 h-80 rounded-lg overflow-hidden shadow-2xl animate-float" style={{ animationDelay: '2s' }}>
                    <img 
                      src="/lovable-uploads/28511add-1f90-4ddd-b768-58ca6cf782f7.png" 
                      alt="Children exploring digital world through laptop" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold">Choose Your Theme</h3>
                <p className="text-muted-foreground">Select from educational stories, planet adventures, bedtime tales, or musical rhymes.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold">Pick a Visual Style</h3>
                <p className="text-muted-foreground">Choose between Studio Ghibli, animation, cartoon, or watercolor painting styles.</p>
              </div>
              
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold">Generate Your Story</h3>
                <p className="text-muted-foreground">Our AI creates a beautiful visual story based on your selections and custom topics.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your First Story?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of storytellers who are creating magical stories with our AI-powered platform.
            </p>
            <Button size="lg" onClick={() => navigate(user ? '/create' : '/signup')}>
              {user ? 'Create Now' : 'Sign Up Free'}
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">Reel of Wonders</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Reel of Wonders. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
