
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Theme } from './ThemeSelector';
import { Style } from './StyleSelector';

interface TopicSelectorProps {
  theme: Theme;
  style: Style;
  onSelect: (topic: string) => void;
  onBack: () => void;
}

const formSchema = z.object({
  customTopic: z.string().min(5, { message: 'Topic must be at least 5 characters' }).max(100),
});

export function TopicSelector({ theme, style, onSelect, onBack }: TopicSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const form = useForm<{ customTopic: string }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customTopic: '',
    },
  });

  // Popular topics based on theme
  const popularTopics: Record<Theme, string[]> = {
    education: ['The Water Cycle', 'Solar System Adventure', 'Dinosaur Discovery', 'Ocean Explorers'],
    planet: ['Journey to Mars', 'Underwater City', 'Rainforest Secrets', 'Arctic Wonders'],
    bedtime: ['Dream Castle', 'Friendly Dragon', 'Starlight Adventure', 'Forest Friends'],
    rhyme: ['Dancing Animals', 'Musical Ocean', 'Singing Trees', 'Rhyming Journey'],
  };

  const handlePopularTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    onSelect(topic);
  };

  const onSubmit = (values: { customTopic: string }) => {
    onSelect(values.customTopic);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Choose a Topic</h1>
        <p className="text-muted-foreground">Select a topic or create your own for your {theme} story in {style} style</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {popularTopics[theme].map((topic) => (
              <Card 
                key={topic}
                className={`p-4 cursor-pointer transition-all hover:bg-secondary ${selectedTopic === topic ? 'bg-secondary border-primary' : ''}`}
                onClick={() => handlePopularTopicSelect(topic)}
              >
                <p className="font-medium text-center">{topic}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h2 className="text-xl font-semibold mb-4">Create Your Own Topic</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your own topic" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button type="submit">Create Story</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
