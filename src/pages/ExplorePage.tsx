
import { Header } from '@/components/common/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ExplorePage = () => {
  const navigate = useNavigate();

  // Mock popular stories
  const popularStories = [
    {
      id: '1',
      title: 'The Friendly Dragon',
      theme: 'bedtime',
      style: 'ghibli',
      imageUrl: 'https://images.unsplash.com/photo-1577083552778-fbe2eee57bb3?w=500&auto=format&fit=crop',
      author: 'Sarah Johnson',
    },
    {
      id: '2',
      title: 'Ocean Explorers',
      theme: 'education',
      style: 'animation',
      imageUrl: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&auto=format&fit=crop',
      author: 'Michael Chen',
    },
    {
      id: '3',
      title: 'Journey to Mars',
      theme: 'planet',
      style: 'cartoon',
      imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop',
      author: 'Alex Rivera',
    },
    {
      id: '4',
      title: 'Dancing Animals',
      theme: 'rhyme',
      style: 'watercolor',
      imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=500&auto=format&fit=crop',
      author: 'Emma Wilson',
    },
    {
      id: '5',
      title: 'Forest Friends',
      theme: 'bedtime',
      style: 'ghibli',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=500&auto=format&fit=crop',
      author: 'David Park',
    },
    {
      id: '6',
      title: 'Solar System Adventure',
      theme: 'education',
      style: 'animation',
      imageUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=500&auto=format&fit=crop',
      author: 'Olivia Taylor',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-8 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Stories</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover magical stories created by our community. Get inspired and create your own!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularStories.map((story) => (
            <Card key={story.id} className="story-card overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={story.imageUrl} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-1">{story.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">{story.theme}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">{story.style}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">by {story.author}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to create your own magical story?</p>
          <Button size="lg" onClick={() => navigate('/create')}>
            Create Your Story
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;
