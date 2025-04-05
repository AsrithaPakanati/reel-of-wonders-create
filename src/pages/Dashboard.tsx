
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get user display name
  const getUserName = () => {
    if (!user) return 'User';
    return user.user_metadata?.name || 
           user.user_metadata?.full_name || 
           user.email?.split('@')[0] || 
           'User';
  };

  // Mock story data
  const stories = [
    {
      id: '1',
      title: 'Ocean Adventure',
      theme: 'education',
      style: 'animation',
      imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&auto=format&fit=crop',
      date: '2 days ago',
    },
    {
      id: '2',
      title: 'Forest Friends',
      theme: 'bedtime',
      style: 'ghibli',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop',
      date: '1 week ago',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {getUserName()}</h1>
            <p className="text-muted-foreground">Create and manage your visual stories</p>
          </div>
          
          <Button onClick={() => navigate('/create')} size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Create Story
          </Button>
        </div>
        
        {stories.length > 0 ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <Card key={story.id} className="story-card overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-semibold">{story.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">{story.theme}</span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded-full">{story.style}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground">
                    Created {story.date}
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="story-card flex flex-col items-center justify-center border-dashed cursor-pointer h-[272px]" onClick={() => navigate('/create')}>
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium">Create New Story</p>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <h2 className="text-2xl font-semibold">You haven't created any stories yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start creating your first magical story by clicking the button below
            </p>
            <Button onClick={() => navigate('/create')} size="lg" className="mt-4">
              Create Your First Story
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
