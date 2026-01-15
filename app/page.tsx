"use client";

import { useState } from "react";
import {
  Lightbulb,
  Users,
  AlertTriangle,
  Box,
  XCircle,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import clsx from "clsx";

interface analysisResult {
  product: string;
  audience: string;
  problem: string;
  mvp: string;
  not_feature: string;
  next_step: string;
}

export default function HomePage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<analysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (res.ok) {
        try {
          // Clean up markdown code blocks if they exist despite instruction
          const cleanJson = data.result.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          setResult(parsed);
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
            What’s the Product?
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Turn your frustrated observations into concrete, solo-founder-ready product concepts.
          </p>
        </header>

        {/* Input Area */}
        <div className="w-full max-w-2xl relative group z-10">
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
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {loading ? "Distilling..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Results Grid */}
        {result && (
          <div className="w-full mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* 1. The Product (Featured) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-3xl rounded-full" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-1">The Product</h2>
                  <div className="text-3xl font-bold text-white leading-tight">
                    {result.product}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Audience */}
            <Card
              icon={<Users className="w-5 h-5" />}
              title="Who It's For"
              color="text-blue-400"
              bg="bg-blue-400/10"
            >
              {result.audience}
            </Card>

            {/* 3. Problem */}
            <Card
              icon={<AlertTriangle className="w-5 h-5" />}
              title="The Real Problem"
              color="text-amber-400"
              bg="bg-amber-400/10"
            >
              {result.problem}
            </Card>

            {/* 4. MVP (Simple) */}
            <Card
              icon={<Box className="w-5 h-5" />}
              title="Simplest Version"
              color="text-emerald-400"
              bg="bg-emerald-400/10"
            >
              {result.mvp}
            </Card>

            {/* 5. Anti-Feature */}
            <Card
              icon={<XCircle className="w-5 h-5" />}
              title="What This Is Not"
              color="text-rose-400"
              bg="bg-rose-400/10"
            >
              {result.not_feature}
            </Card>

            {/* 6. Next Step */}
            <Card
              icon={<ArrowRight className="w-5 h-5" />}
              title="Next Monday Morning"
              color="text-slate-100"
              bg="bg-slate-700/50"
              className="md:col-span-2 lg:col-span-1 border-slate-600"
            >
              {result.next_step}
            </Card>

          </div>
        )}

        <footer className="mt-24 text-slate-600 text-sm py-6 border-t border-slate-900 w-full text-center">
          built for people with too many ideas
        </footer>
      </div>
    </div>
  );
}

function Card({ icon, title, children, color, bg, className = "" }: any) {
  return (
    <div className={clsx("bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col gap-4 hover:border-slate-700 transition-colors", className)}>
      <div className="flex items-center gap-3">
        <div className={clsx("p-2 rounded-lg", bg, color)}>
          {icon}
        </div>
        <h3 className={clsx("text-sm font-semibold uppercase tracking-wider", color)}>{title}</h3>
      </div>
      <p className="text-slate-300 leading-relaxed">
        {children}
      </p>
    </div>
  )
}
