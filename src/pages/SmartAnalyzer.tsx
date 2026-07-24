import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  CheckCircle2,
  Loader2,
  FileSearch,
  ChevronDown,
  ClipboardPaste,
  Link,
  FileText,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';

import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type Stage = 'idle' | 'running' | 'done' | 'error';
type InputMode = 'file' | 'text' | 'url';

type AnalysisStep = {
  key: string;
  label: string;
  result: string;
  details?: string[];
};

type AnalysisResult = {
  name: string;
  type: InputMode;
  size?: number;
  steps: AnalysisStep[];
};

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

const calculateEntropy = (bytes: Uint8Array) => {
  if (!bytes.length) return 0;

  const frequencies = new Array(256).fill(0);

  for (const byte of bytes) {
    frequencies[byte]++;
  }

  let entropy = 0;

  for (const frequency of frequencies) {
    if (frequency === 0) continue;

    const probability = frequency / bytes.length;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
};

const bytesToHex = (bytes: Uint8Array, max = 32) => {
  return Array.from(bytes.slice(0, max))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join(' ');
};

const detectFileType = (bytes: Uint8Array) => {
  const signatures = [
    {
      name: 'PNG image',
      signature: [0x89, 0x50, 0x4e, 0x47],
    },
    {
      name: 'JPEG image',
      signature: [0xff, 0xd8, 0xff],
    },
    {
      name: 'GIF image',
      signature: [0x47, 0x49, 0x46, 0x38],
    },
    {
      name: 'PDF document',
      signature: [0x25, 0x50, 0x44, 0x46],
    },
    {
      name: 'ZIP archive',
      signature: [0x50, 0x4b, 0x03, 0x04],
    },
    {
      name: 'GZIP archive',
      signature: [0x1f, 0x8b],
    },
    {
      name: 'RAR archive',
      signature: [0x52, 0x61, 0x72, 0x21],
    },
    {
      name: 'ELF executable',
      signature: [0x7f, 0x45, 0x4c, 0x46],
    },
    {
      name: 'Windows PE executable',
      signature: [0x4d, 0x5a],
    },
    {
      name: 'WebAssembly module',
      signature: [0x00, 0x61, 0x73, 0x6d],
    },
  ];

  const match = signatures.find(({ signature }) =>
    signature.every((byte, index) => bytes[index] === byte)
  );

  return match?.name ?? 'Unknown binary data';
};

const extractStrings = (bytes: Uint8Array) => {
  const decoder = new TextDecoder('latin1');
  const text = decoder.decode(bytes);

  return text.match(/[\x20-\x7e]{4,}/g) ?? [];
};

const detectInterestingStrings = (strings: string[]) => {
  const patterns = [
    /flag/i,
    /ctf/i,
    /password/i,
    /passwd/i,
    /secret/i,
    /token/i,
    /key/i,
    /admin/i,
    /login/i,
    /root/i,
    /http/i,
    /ssh/i,
    /base64/i,
  ];

  return strings.filter((string) =>
    patterns.some((pattern) => pattern.test(string))
  );
};

const detectArtifacts = (bytes: Uint8Array) => {
  const signatures = [
    {
      name: 'ZIP archive',
      signature: [0x50, 0x4b, 0x03, 0x04],
    },
    {
      name: 'PNG image',
      signature: [0x89, 0x50, 0x4e, 0x47],
    },
    {
      name: 'JPEG image',
      signature: [0xff, 0xd8, 0xff],
    },
    {
      name: 'PDF document',
      signature: [0x25, 0x50, 0x44, 0x46],
    },
    {
      name: 'GZIP archive',
      signature: [0x1f, 0x8b],
    },
    {
      name: 'RAR archive',
      signature: [0x52, 0x61, 0x72, 0x21],
    },
  ];

  const findings: string[] = [];

  for (let offset = 0; offset < bytes.length; offset++) {
    for (const artifact of signatures) {
      const matches = artifact.signature.every(
        (byte, index) => bytes[offset + index] === byte
      );

      if (matches && offset > 0) {
        findings.push(
          `${artifact.name} signature found at offset 0x${offset.toString(16).toUpperCase()}`
        );
      }
    }
  }

  return [...new Set(findings)].slice(0, 20);
};

const detectChallengeType = (
  fileType: string,
  entropy: number,
  interestingStrings: string[],
  artifacts: string[]
) => {
  if (
    fileType.includes('image') &&
    (entropy > 7 || artifacts.some((a) => a.includes('archive')))
  ) {
    return 'Forensics — possible steganography or embedded data';
  }

  if (
    fileType.includes('executable') ||
    fileType.includes('ELF') ||
    fileType.includes('WebAssembly')
  ) {
    return 'Reverse Engineering — executable analysis';
  }

  if (fileType.includes('archive') || artifacts.length > 0) {
    return 'Forensics — archive or embedded file analysis';
  }

  if (interestingStrings.some((value) => /flag|password|secret/i.test(value))) {
    return 'Miscellaneous — hidden data or credential discovery';
  }

  if (entropy > 7.5) {
    return 'Cryptography / Forensics — compressed or encrypted data';
  }

  return 'General Forensics — file and artifact analysis';
};

const generateSuggestions = (
  fileType: string,
  entropy: number,
  artifacts: string[],
  interestingStrings: string[]
) => {
  const suggestions: string[] = [];

  if (entropy > 7.5) {
    suggestions.push(
      'High entropy detected. Check for compressed, encrypted, or packed data.'
    );
  }

  if (artifacts.length > 0) {
    suggestions.push(
      'Embedded file signatures detected. Inspect the indicated offsets for appended or embedded data.'
    );
  }

  if (fileType.includes('image')) {
    suggestions.push(
      'For images, inspect metadata and consider checking for hidden or appended data.'
    );
  }

  if (interestingStrings.length > 0) {
    suggestions.push(
      'Review the flagged strings for credentials, challenge flags, URLs, or other useful indicators.'
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'No obvious indicators were found. Continue with manual analysis and inspect the raw data.'
    );
  }

  return suggestions;
};

const analyzeFile = async (file: File): Promise<AnalysisResult> => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const fileType = detectFileType(bytes);
  const entropy = calculateEntropy(bytes);
  const strings = extractStrings(bytes);
  const interestingStrings = detectInterestingStrings(strings);
  const artifacts = detectArtifacts(bytes);

  const challengeType = detectChallengeType(
    fileType,
    entropy,
    interestingStrings,
    artifacts
  );

  const suggestions = generateSuggestions(
    fileType,
    entropy,
    artifacts,
    interestingStrings
  );

  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);

  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return {
    name: file.name,
    type: 'file',
    size: file.size,
    steps: [
      {
        key: 'filetype',
        label: 'File Type',
        result: fileType,
        details: [
          `Filename: ${file.name}`,
          `Size: ${formatBytes(file.size)}`,
          `Magic bytes: ${bytesToHex(bytes)}`,
        ],
      },
      {
        key: 'hash',
        label: 'SHA-256',
        result: hash,
        details: ['Cryptographic hash calculated locally in your browser.'],
      },
      {
        key: 'entropy',
        label: 'Entropy',
        result: `${entropy.toFixed(4)} / 8.0`,
        details: [
          entropy > 7.5
            ? 'High entropy — data may be compressed, encrypted, or packed.'
            : 'Entropy is not exceptionally high based on the analyzed data.',
        ],
      },
      {
        key: 'strings',
        label: 'Strings',
        result: `${strings.length} printable strings extracted`,
        details:
          interestingStrings.length > 0
            ? interestingStrings.slice(0, 20)
            : ['No obviously interesting strings detected.'],
      },
      {
        key: 'artifacts',
        label: 'Interesting Artifacts',
        result:
          artifacts.length > 0
            ? `${artifacts.length} embedded signature(s) detected`
            : 'No embedded file signatures detected',
        details: artifacts,
      },
      {
        key: 'challenge',
        label: 'Potential Challenge Type',
        result: challengeType,
      },
      {
        key: 'ai',
        label: 'Analysis Suggestions',
        result: suggestions[0],
        details: suggestions,
      },
      {
        key: 'tools',
        label: 'Recommended Next Steps',
        result:
          artifacts.length > 0
            ? 'Hex Viewer → Inspect Artifact Offset → Extract Embedded Data'
            : 'Strings Viewer → Metadata Analysis → Manual Inspection',
      },
    ],
  };
};

const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);

  const entropy = calculateEntropy(bytes);
  const strings = extractStrings(bytes);
  const interestingStrings = detectInterestingStrings(strings);

  const urls = text.match(/https?:\/\/[^\s]+/gi) ?? [];
  const ips = text.match(
    /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  ) ?? [];

  const hashes = text.match(
    /\b[a-fA-F0-9]{32}\b|\b[a-fA-F0-9]{40}\b|\b[a-fA-F0-9]{64}\b/g
  ) ?? [];

  const jwtMatches = text.match(
    /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g
  ) ?? [];

  const base64Matches = text.match(
    /\b[A-Za-z0-9+/]{20,}={0,2}\b/g
  ) ?? [];

  const suggestions: string[] = [];

  if (jwtMatches.length > 0) {
    suggestions.push('JWT-like token detected. Inspect its header and payload.');
  }

  if (hashes.length > 0) {
    suggestions.push('Hash-like values detected. Identify the likely hash algorithm.');
  }

  if (urls.length > 0) {
    suggestions.push('URLs detected. Review domains and paths for useful CTF indicators.');
  }

  if (base64Matches.length > 0) {
    suggestions.push('Base64-like data detected. Consider decoding candidate strings.');
  }

  if (suggestions.length === 0) {
    suggestions.push(
      'Review extracted indicators and look for encoding, hashes, credentials, or challenge flags.'
    );
  }

  return {
    name: 'Pasted text',
    type: 'text',
    steps: [
      {
        key: 'textinfo',
        label: 'Input Analysis',
        result: `${text.length} characters analyzed`,
      },
      {
        key: 'entropy',
        label: 'Entropy',
        result: `${entropy.toFixed(4)} / 8.0`,
      },
      {
        key: 'strings',
        label: 'Interesting Strings',
        result: `${interestingStrings.length} potentially interesting value(s)`,
        details: interestingStrings.slice(0, 20),
      },
      {
        key: 'urls',
        label: 'URLs',
        result: `${urls.length} URL(s) detected`,
        details: urls,
      },
      {
        key: 'ips',
        label: 'IP Addresses',
        result: `${ips.length} IP address(es) detected`,
        details: ips,
      },
      {
        key: 'hashes',
        label: 'Hash Candidates',
        result: `${hashes.length} hash-like value(s) detected`,
        details: hashes,
      },
      {
        key: 'jwt',
        label: 'JWT Candidates',
        result: `${jwtMatches.length} JWT-like token(s) detected`,
        details: jwtMatches,
      },
      {
        key: 'base64',
        label: 'Base64 Candidates',
        result: `${base64Matches.length} Base64-like value(s) detected`,
        details: base64Matches.slice(0, 20),
      },
      {
        key: 'ai',
        label: 'Analysis Suggestions',
        result: suggestions[0],
        details: suggestions,
      },
    ],
  };
};

const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  let validUrl = false;

  try {
    const parsed = new URL(url);
    validUrl = ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    validUrl = false;
  }

  if (!validUrl) {
    throw new Error('Please enter a valid HTTP or HTTPS URL.');
  }

  const parsed = new URL(url);

  const indicators = [
    `Protocol: ${parsed.protocol.replace(':', '')}`,
    `Hostname: ${parsed.hostname}`,
    `Path: ${parsed.pathname || '/'}`,
    parsed.search ? `Query parameters detected: ${parsed.search}` : '',
  ].filter(Boolean);

  return {
    name: url,
    type: 'url',
    steps: [
      {
        key: 'urlinfo',
        label: 'URL Analysis',
        result: 'Valid HTTP/HTTPS URL',
        details: indicators,
      },
      {
        key: 'hostname',
        label: 'Hostname',
        result: parsed.hostname,
      },
      {
        key: 'path',
        label: 'Path',
        result: parsed.pathname || '/',
      },
      {
        key: 'query',
        label: 'Query Parameters',
        result:
          parsed.searchParams.size > 0
            ? `${parsed.searchParams.size} parameter(s) detected`
            : 'No query parameters detected',
        details: Array.from(parsed.searchParams.entries()).map(
          ([key, value]) => `${key} = ${value}`
        ),
      },
      {
        key: 'ai',
        label: 'Analysis Suggestions',
        result:
          'Review the hostname, URL path, and parameters for CTF-relevant indicators.',
      },
    ],
  };
};

export function SmartAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('file');
  const [fileName, setFileName] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [visibleCount, setVisibleCount] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const runAnalysis = useCallback(
    async (input: File | string, mode: InputMode) => {
      try {
        setStage('running');
        setVisibleCount(0);
        setExpanded(null);
        setError(null);

        let result: AnalysisResult;

        if (mode === 'file' && input instanceof File) {
          if (input.size > MAX_FILE_SIZE) {
            throw new Error(
              `File exceeds the ${formatBytes(MAX_FILE_SIZE)} size limit.`
            );
          }

          setFileName(input.name);
          result = await analyzeFile(input);
        } else if (mode === 'text') {
          setFileName('Pasted text');
          result = await analyzeText(String(input));
        } else {
          setFileName(String(input));
          result = await analyzeUrl(String(input));
        }

        setAnalysis(result);

        for (let i = 0; i < result.steps.length; i++) {
          await new Promise((resolve) =>
            setTimeout(resolve, 150)
          );

          setVisibleCount(i + 1);
        }

        setStage('done');
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'An unexpected error occurred.'
        );
        setStage('error');
      }
    },
    []
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setInputMode('file');
      runAnalysis(file, 'file');
    }
  };

  const onFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      runAnalysis(file, 'file');
    }

    e.target.value = '';
  };

  const reset = () => {
    setStage('idle');
    setFileName(null);
    setVisibleCount(0);
    setExpanded(null);
    setAnalysis(null);
    setError(null);
    setTextInput('');
    setUrlInput('');
  };

  const copyHash = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1000px]">
      {stage === 'idle' && (
        <>
          <div className="flex gap-2">
            <Button
              variant={inputMode === 'file' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setInputMode('file')}
            >
              <UploadCloud size={15} />
              File
            </Button>

            <Button
              variant={inputMode === 'text' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setInputMode('text')}
            >
              <ClipboardPaste size={15} />
              Text
            </Button>

            <Button
              variant={inputMode === 'url' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setInputMode('url')}
            >
              <Link size={15} />
              URL
            </Button>
          </div>

          {inputMode === 'file' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={onFileSelect}
              />

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center py-20 gap-4 cursor-pointer ${
                  dragOver
                    ? 'border-signal bg-signal/5'
                    : 'border-line hover:border-fog-dim'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-signal/10 flex items-center justify-center">
                  <UploadCloud
                    size={24}
                    className="text-signal"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop a file here
                  </p>

                  <p className="text-xs text-fog-dim mt-1">
                    Files · PCAPs · Executables · Images · Archives
                  </p>

                  <p className="text-xs text-fog-dim mt-1">
                    Maximum file size: 25 MB
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse files
                </Button>
              </div>
            </>
          )}

          {inputMode === 'text' && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-signal" />
                <span className="text-sm font-medium">
                  Paste text to analyze
                </span>
              </div>

              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste strings, encoded data, logs, headers, JWTs, hashes, or other CTF data..."
                className="w-full min-h-[220px] rounded-xl border border-line bg-transparent p-4 text-sm font-mono outline-none focus:border-signal resize-y"
              />

              <Button
                variant="primary"
                size="sm"
                disabled={!textInput.trim()}
                onClick={() =>
                  runAnalysis(textInput, 'text')
                }
              >
                Analyze text
              </Button>
            </Card>
          )}

          {inputMode === 'url' && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Link size={16} className="text-signal" />
                <span className="text-sm font-medium">
                  Analyze a URL
                </span>
              </div>

              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/challenge?param=value"
                className="w-full rounded-xl border border-line bg-transparent p-3 text-sm font-mono outline-none focus:border-signal"
              />

              <p className="text-xs text-fog-dim">
                SmartAnalyzer currently performs local URL parsing.
                It does not automatically send requests to the target.
              </p>

              <Button
                variant="primary"
                size="sm"
                disabled={!urlInput.trim()}
                onClick={() =>
                  runAnalysis(urlInput.trim(), 'url')
                }
              >
                Analyze URL
              </Button>
            </Card>
          )}
        </>
      )}

      {stage === 'error' && (
        <Card className="p-5 border-red-500/30">
          <p className="text-sm font-medium text-red-400">
            Analysis failed
          </p>

          <p className="text-xs text-fog mt-2">
            {error}
          </p>

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={reset}
            >
              <RotateCcw size={14} />
              Try again
            </Button>
          </div>
        </Card>
      )}

      {stage !== 'idle' && stage !== 'error' && (
        <>
          <Card className="p-4 flex items-center gap-3">
            <FileSearch
              size={16}
              className="text-signal"
            />

            <span className="text-sm font-mono truncate">
              {fileName}
            </span>

            {stage === 'running' && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-signal">
                <Loader2
                  size={13}
                  className="animate-spin"
                />
                analyzing…
              </span>
            )}

            {stage === 'done' && (
              <Badge
                tone="mint"
                className="ml-auto"
              >
                Analysis complete
              </Badge>
            )}
          </Card>

          <div className="space-y-2">
            <AnimatePresence>
              {analysis?.steps
                .slice(0, visibleCount)
                .map((step) => (
                  <motion.div
                    key={step.key}
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <Card className="overflow-hidden">
                      <button
                        onClick={() =>
                          setExpanded(
                            expanded === step.key
                              ? null
                              : step.key
                          )
                        }
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                      >
                        <CheckCircle2
                          size={15}
                          className="text-mint shrink-0"
                        />

                        <span className="text-[13px] font-medium">
                          {step.label}
                        </span>

                        <ChevronDown
                          size={14}
                          className={`ml-auto text-fog-dim transition-transform ${
                            expanded === step.key
                              ? 'rotate-180'
                              : ''
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {expanded === step.key && (
                          <motion.div
                            initial={{
                              height: 0,
                              opacity: 0,
                            }}
                            animate={{
                              height: 'auto',
                              opacity: 1,
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                            }}
                          >
                            <div className="px-4 pb-4 pt-3 text-[12px] font-mono text-fog border-t border-line-soft">
                              <div className="flex gap-2">
                                <span className="break-all flex-1">
                                  {step.result}
                                </span>

                                {step.key === 'hash' && (
                                  <button
                                    onClick={() =>
                                      copyHash(step.result)
                                    }
                                    className="shrink-0 text-fog-dim hover:text-signal"
                                  >
                                    {copied ? (
                                      <Check size={14} />
                                    ) : (
                                      <Copy size={14} />
                                    )}
                                  </button>
                                )}
                              </div>

                              {step.details &&
                                step.details.length > 0 && (
                                  <div className="mt-3 space-y-1">
                                    {step.details.map(
                                      (detail, index) => (
                                        <div
                                          key={`${step.key}-${index}`}
                                          className="break-all"
                                        >
                                          • {detail}
                                        </div>
                                      )
                                    )}
                                  </div>
                                )}
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
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  // Connect this to your existing
                  // Forensics Workbench navigation.
                }}
              >
                Open in Forensics workbench
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={reset}
              >
                <RotateCcw size={14} />
                New analysis
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
