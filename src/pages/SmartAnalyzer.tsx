import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, CheckCircle2, Loader2, FileSearch, ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type Stage = 'idle' | 'running' | 'done';

const pipeline = [
  { key: 'filetype', label: 'File Type', result: 'PNG image data, 1920×1080, non-interlaced' },
  { key: 'entropy', label: 'Entropy', result: '7.94 / 8.0 — likely contains compressed/encrypted data' },
  { key: 'strings', label: 'Strings', result: '212 printable strings extracted, 3 flagged as interesting' },
  { key: 'artifacts', label: 'Interesting Artifacts', result: 'Embedded ZIP signature at offset 0x8A21' },
  { key: 'challenge', label: 'Potential Challenge Type', result: 'Forensics — steganography (image + archive)' },
  { key: 'ai', label: 'AI Suggestions', result: 'Try extracting the trailing ZIP with a hex editor, then inspect archive contents.' },
  { key: 'tools', label: 'Recommended Tools', result: 'Hex Viewer → Archive Extractor → Strings Viewer' },
];

export function SmartAnalyzer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [fileName, setFileName] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const runAnalysis = useCallback((name: string) => {
    setFileName(name);
    setStage('running');
    setVisibleCount(0);
    pipeline.forEach((_, i) => {
      setTimeout(() => {
        setVisibleCount((v) => v + 1);
        if (i === pipeline.length - 1) setTimeout(() => setStage('done'), 400);
      }, 500 * (i + 1));
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    runAnalysis(f?.name ?? 'suspicious_capture.png');
  };

  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      {stage === 'idle' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center py-20 gap-4 cursor-pointer ${
            dragOver ? 'border-signal bg-signal/5' : 'border-line hover:border-fog-dim'
          }`}
          onClick={() => runAnalysis('evidence_final.png')}
        >
          <div className="w-14 h-14 rounded-2xl bg-signal/10 flex items-center justify-center">
            <UploadCloud size={24} className="text-signal" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Drop a file, paste text, or a URL</p>
            <p className="text-xs text-fog-dim mt-1">
              Files · Text · URLs · HTTP requests · JWTs · PCAPs · Executables · Images · Archives
            </p>
          </div>
          <Button variant="primary" size="sm">Browse files</Button>
        </div>
      )}

      {stage !== 'idle' && (
        <>
          <Card className="p-4 flex items-center gap-3">
            <FileSearch size={16} className="text-signal" />
            <span className="text-sm font-mono">{fileName}</span>
            {stage === 'running' && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-signal">
                <Loader2 size={13} className="animate-spin" /> analyzing…
              </span>
            )}
            {stage === 'done' && <Badge tone="mint" className="ml-auto">Analysis complete</Badge>}
          </Card>

          <div className="space-y-2">
            <AnimatePresence>
              {pipeline.slice(0, visibleCount).map((step) => (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => setExpanded(expanded === step.key ? null : step.key)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <CheckCircle2 size={15} className="text-mint shrink-0" />
                      <span className="text-[13px] font-medium">{step.label}</span>
                      <ChevronDown
                        size={14}
                        className={`ml-auto text-fog-dim transition-transform ${expanded === step.key ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <AnimatePresence>
                      {expanded === step.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <div className="px-4 pb-3 pt-0 text-[12px] font-mono text-fog border-t border-line-soft mt-1 pt-3">
                            {step.result}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {stage === 'done' && (
            <div className="flex gap-2">
              <Button variant="primary" size="sm">Open in Forensics workbench</Button>
              <Button variant="outline" size="sm" onClick={() => setStage('idle')}>New analysis</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
