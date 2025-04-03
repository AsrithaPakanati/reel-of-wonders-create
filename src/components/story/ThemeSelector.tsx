
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Film, Globe, Music } from 'lucide-react';

export type Theme = 'education' | 'planet' | 'bedtime' | 'rhyme';

interface ThemeSelectorProps {
  onSelect: (theme: Theme) => void;
}

interface ThemeOption {
  id: Theme;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function ThemeSelector({ onSelect }: ThemeSelectorProps) {
  const [selected, setSelected] = useState<Theme | null>(null);

  const themes: ThemeOption[] = [
    {
      id: 'education',
      title: 'Education',
      description: 'Learn fascinating facts through engaging stories',
      icon: <Book className="h-10 w-10" />,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'planet',
      title: 'Planet',
      description: 'Explore worlds beyond our imagination',
      icon: <Globe className="h-10 w-10" />,
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 'bedtime',
      title: 'Bedtime Story',
      description: 'Perfect for winding down before sleep',
      icon: <Film className="h-10 w-10" />,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'rhyme',
      title: 'Rhyme',
      description: 'Poetic tales with rhythmic patterns',
      icon: <Music className="h-10 w-10" />,
      color: 'bg-amber-100 text-amber-800',
    },
  ];

  const handleSelect = (theme: Theme) => {
    setSelected(theme);
  };

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose a Story Theme</h1>
        <p className="text-muted-foreground">Select a theme for your story creation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme) => (
          <Card 
            key={theme.id}
            className={`theme-card cursor-pointer border-2 ${selected === theme.id ? 'border-primary' : 'border-border'}`}
            onClick={() => handleSelect(theme.id)}
          >
            <div className={`p-4 rounded-full ${theme.color} mb-4`}>
              {theme.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{theme.title}</h3>
            <p className="text-muted-foreground text-center">{theme.description}</p>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          onClick={handleContinue} 
          disabled={!selected}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
