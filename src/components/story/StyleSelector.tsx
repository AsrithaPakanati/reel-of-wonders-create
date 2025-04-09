
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export type Style = 'ghibli' | 'animation' | 'cartoon' | 'watercolor';

interface StyleSelectorProps {
  onSelect: (style: Style) => void;
  onBack: () => void;
}

interface StyleOption {
  id: Style;
  title: string;
  description: string;
  image: string;
}

export function StyleSelector({ onSelect, onBack }: StyleSelectorProps) {
  const [selected, setSelected] = useState<Style | null>(null);

  const styles: StyleOption[] = [
    {
      id: 'ghibli',
      title: 'Studio Ghibli',
      description: 'Magical, whimsical worlds with detailed backgrounds',
      image: 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=800&auto=format&fit=crop',
    },
    {
      id: 'animation',
      title: '3D Animation',
      description: 'Modern, vibrant 3D animated style',
      image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop',
    },
    {
      id: 'cartoon',
      title: 'Cartoon',
      description: 'Fun, expressive cartoon characters',
      image: 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?w=800&auto=format&fit=crop',
    },
    {
      id: 'watercolor',
      title: 'Watercolor',
      description: 'Soft, dreamy watercolor illustrations',
      image: 'https://img.freepik.com/premium-photo/watercolor-painting-panda-jungle_391229-1174.jpg',
    },
  ];

  const handleSelect = (style: Style) => {
    setSelected(style);
  };

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose a Visual Style</h1>
        <p className="text-muted-foreground">Select the artistic style for your story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {styles.map((style) => (
          <Card 
            key={style.id}
            className={`style-card cursor-pointer border-2 overflow-hidden ${selected === style.id ? 'border-primary' : 'border-border'}`}
            onClick={() => handleSelect(style.id)}
          >
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={style.image}
                alt={style.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image: ${style.image}`);
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=500&auto=format&fit=crop';
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{style.title}</h3>
              <p className="text-muted-foreground text-center">{style.description}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleContinue} disabled={!selected}>Continue</Button>
      </div>
    </div>
  );
}
