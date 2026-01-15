"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Lightbulb,
  Users,
  AlertTriangle,
  Box,
  XCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  Dices,
  Share2,
  Check,
  RefreshCw,
  RotateCcw
} from "lucide-react";
import clsx from "clsx";
import MindMap from "./mindmap";

interface AnalysisResult {
  product: string;
  audience: string;
  problem: string;
  mvp: string;
  not_feature: string;
  next_step: string;
  pivots: { label: string; description: string }[];
}

interface IdeaNode {
  id: string;
  product: string;
  audience: string;
  problem: string;
  mvp: string;
  not_feature: string;
  next_step: string;
  pivots: { label: string; description: string }[];
  parentId?: string;
  prompt: string;
}

const SAMPLE_IDEAS = [
  "I hate correcting typos in my git commit messages.",
  "I constantly forget to water my plants and they keep dying.",
  "I wish I could find all the specific tools I used for a DIY project in one receipt.",
  "Finding a good spot for stargazing without light pollution is impossible.",
  "I always lose my physical gym membership card but carrying it is annoying.",
  "I struggle to find healthy lunch spots within walking distance of my office.",
  "Extracting data from PDFs is a nightmare every single time.",
  "I want to track how many hours of deep sleep I get without wearing a watch.",
  "Setting up a personal blog takes too much technical configuration.",
  "I wish I could easily see which ingredients in my pantry are about to expire.",
  "I have 50 tabs open of articles I'll never read.",
  "There's no easy way to gift a 'day of work' to a freelancer friend.",
  "Every time I hear a cool bird I wish I knew what it was without pulling out my phone.",
  "I want a way to track the 'vibe' of local cafes without reading 100 Yelp reviews.",
  "Managing subscriptions is basically a second full-time job at this point.",
  "I wish my kitchen scale would automatically log calories to my phone.",
  "There's no 'Shazam' for physical textures or fabrics.",
  "I hate that I can't easily find out if a movie has jump scares before watching.",
  "I want to swap houseplants with neighbors but don't want to use Facebook.",
  "Finding a reliable 10-minute workout that actually builds muscle is confusing.",
  "I wish I could 'undo' a sent physical postcard.",
  "Why is it so hard to find a quiet place to take a 15-minute nap in the city?",
  "I have too many cool stickers and I'm afraid to use them.",
  "I want to listen to local radio in distant cities while I drive.",
  "There's no app for 'anti-bucket list' items I've already realized I hate.",
  "I wish my clothes would tell me how many times I've actually worn them.",
  "Finding the 'best' version of a non-tech product (like a spoon) is surprisingly hard.",
  "I want to see the world from the perspective of a cat for 5 minutes.",
  "I wish my coffee maker knew how tired I was based on my calendar.",
  "There's no easy way to find 'boring' business ideas that actually make money.",
  "I hate that I can't search through my physical notebooks like a PDF.",
  "I wish I could pay someone to just stand in line for me at the post office.",
  "I want to know which books on my shelf I've neglected for more than two years.",
  "There's no tool to help me plan a meal based on a specific 'color palette'.",
  "I wish I could 'mute' specific recurring noises in my apartment (like the fridge).",
  "I hate that I can't easily see the history of a second-hand item before I buy it.",
  "I want to find a group of people to rent a private island for exactly 48 hours.",
  "I wish my car would tell me the 'real' cost of a trip including depreciation.",
  "There's no way to easily trade 10 minutes of my expert time for 10 minutes of yours.",
  "I want a service that sends me a physical polaroid of a random place every week.",
  "I hate that I can't remember the name of that one person I met at a wedding in 2012.",
  "I wish I could see a heatmap of where people actually spend time in a museum.",
  "I want to buy a 'mystery key' that opens a random locker somewhere in the city.",
  "I hate that my smartphone feels too 'loud' even when it's on silent.",
  "I wish I could find a 5-minute documentary about literally anything right now.",
  "There's no marketplace for 'extremely specific' tools like a left-handed offset spatula.",
  "I want to know the 'carbon footprint' of every email I send.",
  "I wish I could swap my commute for a random 30-minute walk in a different city.",
  "I hate that I can't easily find a place to play 1v1 tetris for money in person.",
  "I want to subscribe to 'serendipity'—a service that sends me on a random date with a stranger.",
  "I wish I could see the 'hidden history' of the street I'm standing on via AR.",
  "I hate that I have 20 loyalty cards and they all take up room in my wallet.",
  "I want a tool that helps me write a novel exactly 10 words at a time.",
  "I wish I could easily find the 'quietest' 1% of a city at any given moment.",
  "There's no app for 'intentional boredom'—it just blocks everything for 20 minutes.",
  "I want to see what my room would look like if it was designed by a movie director.",
  "I hate that I can't easily tip the person who actually made my sandwich.",
  "I wish I could find a 'mentor for a day' without a long-term commitment.",
  "I want a way to record the smell of a place and save it for later.",
  "I hate that I can't easily see which of my friends are in the same building as me.",
  "I wish my phone would only unlock if I could remember a specific fact I learned today.",
  "There's no service for 'anti-recommendations'—tell me what I'll definitely hate.",
  "I want to find the 'cheapest' way to feel like a millionaire for 15 minutes.",
  "I hate that I can't easily see the 'energy level' of a bar before walking in.",
  "I wish I could buy a 'time capsule' that only opens when I reach a certain goal.",
  "I want to see the world through the eyes of someone 2 feet taller than me.",
  "I hate that I can't easily find a place to fix a broken zipper in under 10 minutes.",
  "I wish I could 'rent' a dog for a 30-minute walk in the park.",
  "There's no way to easily see which of my clothes no longer fit my 'vibe'.",
  "I want a service that organizes 'dinner for strangers' in private homes.",
  "I hate that I can't easily find a place to record a podcast in a library.",
  "I wish I could see which of my neighbors are also awake at 3 AM.",
  "I want to buy a 'blind box' of artisanal groceries with no labels.",
  "I hate that I can't easily find a place to take a shower in a city for $5.",
  "I wish I could see the 'difficulty level' of a recipe before reading it.",
  "I want to find a group of people to start a 'secret society' with for one week.",
  "I hate that I can't easily find a place to do 'low-stakes' woodworking.",
  "I wish I could find a 'ghostwriter' for my texts when I'm feeling socially anxious.",
  "I hate that I can't easily find a place to play 4-player split-screen games with strangers.",
  "I wish my umbrella would tell me the exact UV index vs. what it was 5 minutes ago.",
  "I want to track the 'mileage' of my favorite pairs of socks.",
  "There's no way to easily see which of my childhood toys are currently 'museum grade'.",
  "I wish I could find a 'professional organizer' who only deals with Lego bricks.",
  "I hate that I can't easily swap physical currency for local digital 'community credits'.",
  "I want to know the 'emotional acoustics' of an apartment before I rent it.",
  "I wish I could see a live map of where 'free fruit' is growing in my city.",
  "There's no app for 'anti-doom-scrolling' that forces you to solve a 100-piece puzzle.",
  "I want to find the nearest place to participate in a 'communal silence' for one hour.",
  "I hate that I can't easily see the 'wear level' of my brake pads on my phone.",
  "I wish I could pay someone to just read the terms and conditions for me.",
  "I want to swap 'failed hobbies' with people—trading my guitar for your telescope.",
  "There's no marketplace for 'extremely specific' scents like 'Old Library' or 'New Rain'.",
  "I wish I could see the 'sunlight path' in my house for every hour of the upcoming year.",
  "I hate that I can't easily find a place to fix a broken mechanical keyboard.",
  "I want to subscribe to 'serendipity'—a random item from a random flea market every month.",
  "I wish my shoes would buzz if I've been walking with 'bad posture' for 10 minutes.",
  "There's no way to find neighbors who want to share a single high-end lawnmower.",
  "I want to see the 'pedigree' of the wood used in the furniture I'm buying.",
  "I hate that I can't easily find a place to do 'experimental' cooking with specialized gear.",
  "I wish I could join a 'book club' that only meets in person to discuss one specific page.",
  "I want to know the 'waiting room vibe' of a doctor's office before I book.",
  "I hate that I can't easily see which of my friends are also currently 'unproductive'.",
  "I wish I could find a 'mentor' who will only talk to me via physical letters.",
  "I want to track how many times I've actually used my 'fancy' dinner plates.",
  "There's no app for 'un-learning'—it blocks your knowledge of a specific topic for a day.",
  "I wish I could see the 'shadow history' of a park—what used to be there 100 years ago.",
  "I hate that I can't easily find a place to fix a broken antique clock.",
  "I want to buy a 'mystery ticket' that puts me on the next available train to anywhere.",
  "I wish my phone would only recharge if I completed a 15-minute specialized workout.",
  "I want to swap 'bad advice' with people to see who can come up with the most creative failure.",
  "There's no service for 'anonymous apologies'—send a sincere note to someone from your past.",
  "I wish I could see the 'flavor profile' of my tap water in real-time.",
  "I hate that I can't easily find a place to practice 'extreme' ventriloquism.",
  "I want to subscribe to 'silence'—one day a month where all my digital devices are disabled.",
  "I wish my fridge would tell me the 'bio-origin' of every single vegetable inside.",
  "I hate that I can't easily find a place to fix a broken fountain pen.",
  "I want to see the world through the eyes of a pigeon for exactly 3 minutes.",
  "I wish I could find a 'professional sleeper' to test the comfort of my guest room.",
  "There's no marketplace for 'lost recipes'—handwritten notes found in old books.",
  "I want to track how many 'micro-moments' of joy I actually experience in a day.",
  "I hate that I can't easily see the 'social battery' level of my close friends.",
  "I wish I could find a 'ghostwriter' for my Tinder bio who is actually honest.",
  "I want to buy a 'mystery box' of historical artifacts from a random 10-year period.",
  "I hate that I can't easily find a place to practice 'professional' tree climbing.",
  "I wish I could 'rent' an expert to just sit next to me while I try to fix my sink.",
  "There's no app for 'intentional failure'—it sets goals that are impossible just for fun.",
  "I want to see the 'vibe' of a hotel room via VR before I actually check in."
];

export default function HomePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"simple" | "pro" | "executive">("simple");
  const [ideaHistory, setIdeaHistory] = useState<IdeaNode[]>([]);
  const [dynamicSamples, setDynamicSamples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch a new unique sample on every visit to "grow" the database
  useEffect(() => {
    const fetchNewSample = async () => {
      try {
        const res = await fetch("/api/samples");
        const data = await res.json();
        if (data.randomFromPool && Array.isArray(data.randomFromPool)) {
          // Add any new unique samples to our state
          setDynamicSamples(prev => {
            const combined = [...new Set([...prev, ...data.randomFromPool])];
            return combined;
          });
        }
      } catch (e) {
        console.error("Failed to fetch dynamic sample", e);
      }
    };
    fetchNewSample();
  }, []);

  const handleRandomize = () => {
    const allSamples = [...SAMPLE_IDEAS, ...dynamicSamples];
    const randomIdea = allSamples[Math.floor(Math.random() * allSamples.length)];
    setInput(randomIdea);
  };

  const handleAnalyze = async (overrideInput?: string, parentId?: string) => {
    const textToAnalyze = (typeof overrideInput === 'string' && overrideInput)
      ? overrideInput
      : input;

    if (!textToAnalyze.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: textToAnalyze, mode }),
      });

      const data = await res.json();

      if (res.ok) {
        try {
          const cleanJson = data.result.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed: AnalysisResult = JSON.parse(cleanJson);

          const newNode: IdeaNode = {
            id: `node-${Date.now()}`,
            ...parsed,
            parentId,
            prompt: textToAnalyze,
          };

          setIdeaHistory(prev => [...prev, newNode]);

          if (typeof overrideInput === 'string') {
            setInput(overrideInput);
          }
        } catch (e) {
          console.error("JSON Parse Error", e);
          setError("Failed to parse the idea. Try again.");
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (e) {
      console.error(e);
      setError("Request failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePivot = useCallback((newPrompt: string, parentId: string) => {
    handleAnalyze(newPrompt, parentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!currentResult) return;
    const text = `
Idea Distiller Concept: ${currentResult.product}
---
Audience: ${currentResult.audience}
Problem: ${currentResult.problem}
MVP: ${currentResult.mvp}
Not a Feature: ${currentResult.not_feature}
Next Step: ${currentResult.next_step}
---
Generated by Idea Distiller
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 20000);
  };

  const [refreshingField, setRefreshingField] = useState<string | null>(null);

  const handleRefreshField = async (field: string) => {
    if (!currentResult || loading || refreshingField) return;
    setRefreshingField(field);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: currentResult.prompt,
          mode,
          fieldToRegenerate: field,
          currentIdea: currentResult
        }),
      });

      const data = await res.json();
      if (data.result) {
        const freshIdea = JSON.parse(data.result) as AnalysisResult;
        setIdeaHistory(prev => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          newHistory[lastIndex] = {
            ...newHistory[lastIndex],
            [field]: (freshIdea as any)[field]
          };
          return newHistory;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshingField(null);
    }
  };

  const [regeneratingAll, setRegeneratingAll] = useState(false);
  const handleRegenerateTotal = async () => {
    if (!currentResult || loading || regeneratingAll) return;
    setRegeneratingAll(true);
    try {
      await handleAnalyze(currentResult.prompt, currentResult.parentId);
    } finally {
      setRegeneratingAll(false);
    }
  };

  const currentResult = ideaHistory.length > 0 ? ideaHistory[ideaHistory.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

        {/* Header */}
        <header className="text-center mb-12 max-w-2xl relative">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center justify-center p-2 mb-4 bg-slate-900/50 rounded-full border border-slate-800 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Idea Distiller</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-slate-400 text-transparent bg-clip-text mb-4">
            What's the Product?
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Turn your frustrated observations into concrete, solo-founder-ready product concepts.
          </p>
        </header>

        {/* Input Area */}
        <div className="w-full max-w-2xl relative group z-10">
          <div className="flex gap-2 mb-4 justify-center">
            {(["simple", "pro", "executive"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={clsx(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                  mode === m
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                )}
              >
                {m}
              </button>
            ))}
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-rose-500 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur-lg"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl">
            <textarea
              className="w-full h-32 bg-transparent text-lg p-4 focus:outline-none resize-none placeholder-slate-600"
              placeholder="e.g. I hate correcting typos in my git commit messages..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex justify-between items-center px-4 pb-2">
              <span className="text-xs text-slate-600">
                {input.length > 0 ? `${input.length} chars` : "Paste your thought"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleRandomize}
                  disabled={loading}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all transform active:scale-95 border border-slate-700"
                  title="Random Idea"
                >
                  <Dices className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleAnalyze()}
                  disabled={loading || !input.trim()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? "Distilling..." : "Analyze"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Results Grid - Show latest result */}
        {currentResult && (
          <div className="w-full mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 1. The Product (Featured) */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-3xl rounded-full" />
                <div className="flex items-start justify-between relative z-10 w-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-1">The Product</h2>
                      <div className="text-3xl font-bold text-white leading-tight">
                        {currentResult.product}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleRegenerateTotal}
                      disabled={loading || regeneratingAll}
                      className="p-2 bg-slate-800/50 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-all border border-slate-700/50 flex items-center gap-2 group"
                      title="Generate New Version of Idea"
                    >
                      <RotateCcw className={clsx("w-4 h-4", regeneratingAll && "animate-spin")} />
                      <span className="text-xs font-medium">Regenerate</span>
                    </button>
                    <button
                      onClick={handleCopy}
                      className="p-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700/50 flex items-center gap-2"
                      title="Copy to Clipboard"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      <span className="text-xs font-medium">{copied ? "Copied!" : "Share"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Audience */}
              <Card
                icon={<Users className="w-5 h-5" />}
                title="Who It's For"
                color="text-blue-400"
                bg="bg-blue-400/10"
                onRefresh={() => handleRefreshField('audience')}
                loading={refreshingField === 'audience'}
              >
                {currentResult.audience}
              </Card>

              {/* 3. Problem */}
              <Card
                icon={<AlertTriangle className="w-5 h-5" />}
                title="The Real Problem"
                color="text-amber-400"
                bg="bg-amber-400/10"
                onRefresh={() => handleRefreshField('problem')}
                loading={refreshingField === 'problem'}
              >
                {currentResult.problem}
              </Card>

              {/* 4. MVP (Simple) */}
              <Card
                icon={<Box className="w-5 h-5" />}
                title="Simplest Version"
                color="text-emerald-400"
                bg="bg-emerald-400/10"
                onRefresh={() => handleRefreshField('mvp')}
                loading={refreshingField === 'mvp'}
              >
                {currentResult.mvp}
              </Card>

              {/* 5. Anti-Feature */}
              <Card
                icon={<XCircle className="w-5 h-5" />}
                title="What This Is Not"
                color="text-rose-400"
                bg="bg-rose-400/10"
                onRefresh={() => handleRefreshField('not_feature')}
                loading={refreshingField === 'not_feature'}
              >
                {currentResult.not_feature}
              </Card>

              {/* 6. Next Step */}
              <Card
                icon={<ArrowRight className="w-5 h-5" />}
                title="Next Monday Morning"
                color="text-slate-100"
                bg="bg-slate-700/50"
                className="md:col-span-2 lg:col-span-1 border-slate-600"
                onRefresh={() => handleRefreshField('next_step')}
                loading={refreshingField === 'next_step'}
              >
                {currentResult.next_step}
              </Card>
            </div>

            {/* Mind Map for Exploration History */}
            {ideaHistory.length > 0 && (
              <div className="w-full mt-16 pt-16 border-t border-slate-900">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-indigo-400">Exploration Map</h2>
                  <p className="text-slate-500">
                    {ideaHistory.length === 1
                      ? "Click a node to explore that direction"
                      : `${ideaHistory.length} ideas explored`}
                  </p>
                </div>
                <MindMap history={ideaHistory} onPivot={handlePivot} />
              </div>
            )}
          </div>
        )}

        <footer className="mt-24 text-slate-600 text-sm py-6 border-t border-slate-900 w-full text-center">
          built for people with too many ideas
        </footer>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
  color,
  bg,
  className,
  onRefresh,
  loading
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  color: string;
  bg: string;
  className?: string;
  onRefresh?: () => void;
  loading?: boolean;
}) {
  return (
    <div className={clsx("p-6 bg-slate-900 border border-slate-800 rounded-2xl group relative", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className={clsx("p-2 rounded-lg", bg, color)}>
          {icon}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-md transition-all disabled:opacity-30"
            title="Generate a different version of this section"
          >
            <RefreshCw className={clsx("w-3.5 h-3.5", loading && "animate-spin")} />
          </button>
        )}
      </div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{title}</h3>
      <div className="text-slate-200 leading-relaxed font-medium">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-slate-800 rounded w-full"></div>
            <div className="h-3 bg-slate-800 rounded w-3/4"></div>
          </div>
        ) : children}
      </div>
    </div>
  );
}
