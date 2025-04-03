
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ThemeSelector, Theme } from '@/components/story/ThemeSelector';
import { StyleSelector, Style } from '@/components/story/StyleSelector';
import { TopicSelector } from '@/components/story/TopicSelector';
import { StoryGenerator } from '@/components/story/StoryGenerator';
import { toast } from '@/components/ui/use-toast';

type Step = 'theme' | 'style' | 'topic' | 'generate';

const CreateStory = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('theme');
  const [theme, setTheme] = useState<Theme | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [topic, setTopic] = useState<string | null>(null);

  const handleThemeSelect = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setStep('style');
  };

  const handleStyleSelect = (selectedStyle: Style) => {
    setStyle(selectedStyle);
    setStep('topic');
  };

  const handleTopicSelect = (selectedTopic: string) => {
    setTopic(selectedTopic);
    setStep('generate');
  };

  const handleFinish = () => {
    toast({
      title: "Story Created!",
      description: "Your story has been successfully created and saved to your library.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {step === 'theme' && (
            <ThemeSelector onSelect={handleThemeSelect} />
          )}
          
          {step === 'style' && theme && (
            <StyleSelector 
              onSelect={handleStyleSelect} 
              onBack={() => setStep('theme')} 
            />
          )}
          
          {step === 'topic' && theme && style && (
            <TopicSelector 
              theme={theme}
              style={style}
              onSelect={handleTopicSelect}
              onBack={() => setStep('style')}
            />
          )}
          
          {step === 'generate' && theme && style && topic && (
            <StoryGenerator 
              theme={theme}
              style={style}
              topic={topic}
              onBack={() => setStep('topic')}
              onFinish={handleFinish}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateStory;
