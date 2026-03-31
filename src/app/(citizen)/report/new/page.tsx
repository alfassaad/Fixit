"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  ArrowLeft, ArrowRight, Camera, Check, 
  MapPin, Loader2, Sparkles, Plus, X, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CATEGORIES } from '@/data/mockData';
import { useAppContext } from '@/context/AppContext';
import { suggestCategoryAndRefineDescription } from '@/ai/flows/ai-report-categorization-and-refinement';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Dynamically import Leaflet map to avoid SSR issues
const InteractiveMap = dynamic(
  () => import('@/components/map/InteractiveMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    )
  }
);

export default function ReportSubmissionPage() {
  const router = useRouter();
  const { submitReport } = useAppContext();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { lat: 33.6844, lng: 73.0479, address: 'Blue Area, Islamabad' },
    photos: [] as string[]
  });

  const handleAiRefine = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Missing Info",
        description: "Please provide a title and description for AI analysis.",
        variant: "destructive"
      });
      return;
    }
    
    setAiAnalyzing(true);
    try {
      const result = await suggestCategoryAndRefineDescription({
        title: formData.title,
        description: formData.description
      });
      
      setFormData(prev => ({
        ...prev,
        category: result.suggestedCategory,
        description: result.refinedDescription
      }));
      
      toast({
        title: "AI Analysis Complete",
        description: "Suggested a category and refined your description for clarity.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          location: {
            lat: latitude,
            lng: longitude,
            address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
          }
        }));
        setLocating(false);
        toast({
          title: "Location Found",
          description: "Map updated to your current coordinates.",
        });
      },
      (error) => {
        setLocating(false);
        let message = "Could not determine your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Please allow location access in your browser settings.";
        }
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => {
    if (step === 1) {
      router.push('/map');
    } else {
      setStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, base64String]
        }));
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitReport(formData);
      setStep(4);
    } catch (error) {
        toast({
            title: "Error",
            description: "There was an error submitting your report.",
            variant: "destructive",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-8">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        multiple 
        onChange={handleFileChange}
      />

      <div className="bg-white border-b px-4 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step < 4 && (
            <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          )}
          <h1 className="text-xl font-bold text-primary">
            {step === 4 ? "Success" : "Report Issue"}
          </h1>
        </div>
        {step < 4 && (
          <div className="text-xs font-bold text-muted-foreground bg-slate-100 px-3 py-1 rounded-full">
            Step {step} of 3
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="h-1.5 w-full bg-slate-200">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out" 
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      )}

      <div className="flex-1 p-4 max-w-lg mx-auto w-full">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-primary">1. What's the issue?</h2>
              <p className="text-sm text-muted-foreground">Select a category and tell us what's happening.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.name }))}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 relative",
                    formData.category === cat.name 
                      ? "bg-accent/5 border-accent shadow-md" 
                      : "bg-white border-slate-100 hover:border-accent/30"
                  )}
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <span className={cn(
                    "text-xs font-bold text-center",
                    formData.category === cat.name ? "text-accent" : "text-slate-600"
                  )}>{cat.name}</span>
                  {formData.category === cat.name && (
                    <div className="absolute top-2 right-2 bg-accent rounded-full p-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Issue Title</label>
                <Input 
                  placeholder="E.g., Deep pothole on Main St" 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700">Detailed Description</label>
                  <button 
                    onClick={handleAiRefine}
                    disabled={aiAnalyzing || !formData.title || !formData.description}
                    className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
                  >
                    {aiAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Refine
                  </button>
                </div>
                <div className="relative">
                  <Textarea 
                    placeholder="Describe the issue in detail..." 
                    rows={4}
                    maxLength={500}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="rounded-xl resize-none pb-8"
                  />
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold text-slate-400">
                    {formData.description.length}/500
                  </span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-lg font-bold bg-primary mt-4"
              onClick={handleNext}
              disabled={!formData.category || !formData.title}
            >
              Next <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-primary">2. Where is it?</h2>
              <p className="text-sm text-muted-foreground">Mark the location on the map.</p>
            </div>

            <div className="h-64 rounded-3xl overflow-hidden border border-border shadow-inner relative z-0">
              <InteractiveMap 
                pins={[]} 
                selectable
                selectedLocation={formData.location}
                onLocationSelect={(pos) => setFormData(prev => ({ ...prev, location: { ...prev.location, ...pos, address: `Selected (${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)})` } }))}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Estimated Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-accent" />
                  <Input 
                    value={formData.location.address}
                    readOnly
                    className="pl-10 h-11 bg-slate-50 border-slate-200 font-medium"
                  />
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-accent text-accent font-bold hover:bg-accent/5"
                onClick={handleUseCurrentLocation}
                disabled={locating}
              >
                {locating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="mr-2 w-4 h-4" />}
                {locating ? "Locating..." : "Use Current Location"}
              </Button>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={handleBack}>
                Back
              </Button>
              <Button className="flex-[2] h-12 rounded-xl font-bold bg-primary" onClick={handleNext}>
                Next <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-primary">3. Add Evidence</h2>
              <p className="text-sm text-muted-foreground">Photos help our team resolve issues faster.</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button"
                className="aspect-square bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-accent hover:border-accent transition-all"
                onClick={handleFileClick}
              >
                <Camera className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-bold">Add Photo</span>
              </button>
              {formData.photos.map((photo, i) => (
                <div key={i} className="aspect-square bg-slate-200 rounded-2xl relative overflow-hidden">
                  <img src={photo} alt={`Evidence ${i}`} className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  >
                    <Plus className="w-3 h-3 rotate-45" />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Summary Review</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white shrink-0">
                  {CATEGORIES.find(c => c.name === formData.category)?.icon || '❓'}
                </div>
                <div>
                  <div className="font-bold text-primary line-clamp-1">{formData.title || 'Untitled Issue'}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {formData.location.address}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-8">
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-accent hover:bg-accent/90 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Submit Report 🚀"}
              </Button>
              <button 
                type="button"
                className="text-slate-400 font-bold text-sm hover:text-slate-600"
                onClick={() => router.push('/map')}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-8 animate-in zoom-in fade-in duration-500">
            <div className="relative">
              <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-24 h-24 bg-success rounded-full flex items-center justify-center shadow-lg shadow-success/30">
                  <Check className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                New!
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black text-primary">Report Submitted!</h2>
              <p className="text-slate-500 font-medium">Thank you for helping us fix the city. Your contribution makes a difference.</p>
            </div>

            <div className="bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Report ID:</span>
              <span className="text-lg font-black text-primary">ISS-007</span>
            </div>

            <div className="w-full space-y-4 pt-8">
              <Button 
                className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg"
                onClick={() => router.push('/my-reports')}
              >
                Track your report
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold border-slate-200"
                onClick={() => router.push('/map')}
              >
                Back to Map
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}