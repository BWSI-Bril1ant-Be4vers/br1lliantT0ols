import {
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardContent,
} from '../components/ui/Card';
import {
  Textarea,
  Input,
} from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  ArrowDown,
  ArrowUp,
  Clipboard,
  Copy,
  History,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

const algorithms = [
  'Caesar',
  'Vigenère',
  'XOR',
  'Base64',
  'ROT13',
  'RSA (modular)',
] as const;

type Algo = (typeof algorithms)[number];

type OperationMode = 'encode' | 'decode';

interface Operation {
  id: number;
  algo: Algo;
  key: string;
  mode: OperationMode;
}

interface HistoryEntry {
  op: string;
  time: string;
}

interface FreqPoint {
  letter: string;
  freq: number;
  baseline: number;
}

interface XorByte {
  index: number;
  input: number;
  key: number;
  output: number;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const ENGLISH_FREQ: Record<string, number> = {
  a: 8.2,
  b: 1.5,
  c: 2.8,
  d: 4.3,
  e: 12.7,
  f: 2.2,
  g: 2.0,
  h: 6.1,
  i: 7.0,
  j: 0.2,
  k: 0.8,
  l: 4.0,
  m: 2.4,
  n: 6.7,
  o: 7.5,
  p: 1.9,
  q: 0.1,
  r: 6.0,
  s: 6.3,
  t: 9.1,
  u: 2.8,
  v: 1.0,
  w: 2.4,
  x: 0.2,
  y: 2.0,
  z: 0.1,
};

// -----------------------------------------------------------------------------
// Utility functions
// -----------------------------------------------------------------------------

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value.replace(/\s/g, ''));
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function utf8ToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

function base64ToUtf8(value: string): string {
  return new TextDecoder().decode(base64ToBytes(value));
}

function caesarShift(text: string, shift: number): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;

    return String.fromCharCode(
      ((ch.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base,
    );
  });
}

function vigenere(
  text: string,
  key: string,
  decode: boolean,
): string {
  const cleanKey = key.replace(/[^a-zA-Z]/g, '');

  if (!cleanKey) {
    throw new Error('Vigenère requires a key containing letters.');
  }

  let keyIndex = 0;

  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= 'Z' ? 65 : 97;

    const keyChar =
      cleanKey[keyIndex % cleanKey.length].toLowerCase();

    const keyShift = keyChar.charCodeAt(0) - 97;

    keyIndex++;

    const shift = decode ? -keyShift : keyShift;

    return String.fromCharCode(
      ((ch.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base,
    );
  });
}

function xorCipher(
  text: string,
  key: string,
): string {
  if (!key) {
    throw new Error('XOR requires a key.');
  }

  const inputBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);
  const outputBytes = new Uint8Array(inputBytes.length);

  for (let i = 0; i < inputBytes.length; i++) {
    outputBytes[i] =
      inputBytes[i] ^
      keyBytes[i % keyBytes.length];
  }

  return new TextDecoder().decode(outputBytes);
}

function xorHex(
  text: string,
  key: string,
): string {
  if (!key) {
    throw new Error('XOR requires a key.');
  }

  const inputBytes = new TextEncoder().encode(text);
  const keyBytes = new TextEncoder().encode(key);

  const output = new Uint8Array(inputBytes.length);

  for (let i = 0; i < inputBytes.length; i++) {
    output[i] =
      inputBytes[i] ^
      keyBytes[i % keyBytes.length];
  }

  return Array.from(output)
    .map((byte) =>
      byte.toString(16).padStart(2, '0'),
    )
    .join(' ');
}

function rot13(text: string): string {
  return caesarShift(text, 13);
}

// -----------------------------------------------------------------------------
// RSA helpers
// -----------------------------------------------------------------------------

function parseBigInt(value: string): bigint {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error('RSA parameter cannot be empty.');
  }

  try {
    if (
      trimmed.startsWith('0x') ||
      trimmed.startsWith('0X')
    ) {
      return BigInt(trimmed);
    }

    return BigInt(trimmed);
  } catch {
    throw new Error(
      `Invalid RSA number: ${value}`,
    );
  }
}

function modPow(
  base: bigint,
  exponent: bigint,
  modulus: bigint,
): bigint {
  if (modulus <= 0n) {
    throw new Error(
      'RSA modulus must be greater than zero.',
    );
  }

  if (exponent < 0n) {
    throw new Error(
      'RSA exponent cannot be negative.',
    );
  }

  let result = 1n;
  let currentBase = base % modulus;
  let currentExponent = exponent;

  while (currentExponent > 0n) {
    if (currentExponent % 2n === 1n) {
      result =
        (result * currentBase) % modulus;
    }

    currentBase =
      (currentBase * currentBase) % modulus;

    currentExponent =
      currentExponent / 2n;
  }

  return result;
}

function runRsa(
  input: string,
  key: string,
  mode: OperationMode,
): string {
  /*
   * RSA input format:
   *
   * Ciphertext:
   *   123456
   *
   * Key:
   *   n=3233,e=17
   *
   * For decryption:
   *   n=3233,d=2753
   *
   * Output is the modular exponentiation result.
   */

  const nMatch = key.match(
    /(?:^|[,;\s])n\s*=\s*([0-9xXa-fA-F]+)/i,
  );

  const exponentMatch = key.match(
    /(?:^|[,;\s])(e|d)\s*=\s*([0-9xXa-fA-F]+)/i,
  );

  if (!nMatch || !exponentMatch) {
    throw new Error(
      'RSA key format: n=3233,e=17 for encryption or n=3233,d=2753 for decryption.',
    );
  }

  const n = parseBigInt(nMatch[1]);
  const exponent = parseBigInt(exponentMatch[2]);

  const values = input
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (!values.length) {
    throw new Error(
      'RSA input must contain one or more integer ciphertext/plaintext values.',
    );
  }

  const results = values.map((value) => {
    const message = parseBigInt(value);

    if (message >= n) {
      throw new Error(
        `RSA input ${value} must be smaller than n (${n.toString()}).`,
      );
    }

    return modPow(
      message,
      exponent,
      n,
    ).toString();
  });

  return results.join(' ');
}

// -----------------------------------------------------------------------------
// Operation engine
// -----------------------------------------------------------------------------

function runOperation(
  operation: Operation,
  input: string,
): string {
  switch (operation.algo) {
    case 'Caesar': {
      const shift = Number.parseInt(
        operation.key,
        10,
      );

      if (!Number.isFinite(shift)) {
        throw new Error(
          'Caesar requires a numeric shift.',
        );
      }

      return caesarShift(
        input,
        operation.mode === 'decode'
          ? -shift
          : shift,
      );
    }

    case 'Vigenère':
      return vigenere(
        input,
        operation.key,
        operation.mode === 'decode',
      );

    case 'XOR':
      return xorCipher(
        input,
        operation.key,
      );

    case 'Base64':
      return operation.mode === 'decode'
        ? base64ToUtf8(input)
        : utf8ToBase64(input);

    case 'ROT13':
      return rot13(input);

    case 'RSA (modular)':
      return runRsa(
        input,
        operation.key,
        operation.mode,
      );

    default:
      return input;
  }
}

// -----------------------------------------------------------------------------
// Analysis
// -----------------------------------------------------------------------------

function computeFreq(
  text: string,
): FreqPoint[] {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const ch of text.toLowerCase()) {
    if (ch >= 'a' && ch <= 'z') {
      counts[ch] =
        (counts[ch] || 0) + 1;

      total++;
    }
  }

  return Object.keys(ENGLISH_FREQ).map(
    (letter) => ({
      letter,
      freq: total
        ? +(
            ((counts[letter] || 0) /
              total) *
            100
          ).toFixed(1)
        : 0,
      baseline:
        ENGLISH_FREQ[letter],
    }),
  );
}

function computeXorBytes(
  text: string,
  key: string,
): XorByte[] {
  if (!key) {
    return [];
  }

  const inputBytes =
    new TextEncoder().encode(text);

  const keyBytes =
    new TextEncoder().encode(key);

  return Array.from(inputBytes)
    .slice(0, 64)
    .map((inputByte, index) => ({
      index,
      input: inputByte,
      key:
        keyBytes[
          index % keyBytes.length
        ],
      output:
        inputByte ^
        keyBytes[
          index % keyBytes.length
        ],
    }));
}

function formatHex(
  value: number,
): string {
  return value
    .toString(16)
    .padStart(2, '0')
    .toUpperCase();
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function Cryptography() {
  const [input, setInput] =
    useState<string>(
      'Wkh iodj lv fdhvdu_lv_hdvb_420',
    );

  const [operations, setOperations] =
    useState<Operation[]>([
      {
        id: 1,
        algo: 'Caesar',
        key: '3',
        mode: 'decode',
      },
    ]);

  const [output, setOutput] =
    useState<string>(
      'The flag is caesar_is_easy_420',
    );

  const [error, setError] =
    useState<string>('');

  const [history, setHistory] =
    useState<HistoryEntry[]>([
      {
        op: 'Caesar decode (shift: 3)',
        time: 'just now',
      },
    ]);

  const [autoRun, setAutoRun] =
    useState<boolean>(false);

  const [nextId, setNextId] =
    useState<number>(2);

  // ---------------------------------------------------------------------------
  // Derived data
  // ---------------------------------------------------------------------------

  const freqData = useMemo(
    () => computeFreq(input),
    [input],
  );

  const xorData = useMemo(() => {
    const xorOperation =
      operations.find(
        (operation) =>
          operation.algo === 'XOR',
      );

    if (!xorOperation) {
      return [];
    }

    return computeXorBytes(
      input,
      xorOperation.key,
    );
  }, [input, operations]);

  // ---------------------------------------------------------------------------
  // Operation helpers
  // ---------------------------------------------------------------------------

  function getDefaultKey(
    algo: Algo,
  ): string {
    switch (algo) {
      case 'Caesar':
        return '3';

      case 'Vigenère':
        return 'shadow';

      case 'XOR':
        return 'key';

      case 'RSA (modular)':
        return 'n=3233,e=17';

      default:
        return '';
    }
  }

  function addOperation(
    algo: Algo = 'Caesar',
  ) {
    const operation: Operation = {
      id: nextId,
      algo,
      key: getDefaultKey(algo),
      mode:
        algo === 'Base64' ||
        algo === 'Caesar' ||
        algo === 'Vigenère' ||
        algo === 'RSA (modular)'
          ? 'decode'
          : 'encode',
    };

    setNextId(
      (current) => current + 1,
    );

    setOperations(
      (current) => [
        ...current,
        operation,
      ],
    );
  }

  function removeOperation(
    id: number,
  ) {
    setOperations(
      (current) =>
        current.filter(
          (operation) =>
            operation.id !== id,
        ),
    );
  }

  function updateOperation(
    id: number,
    changes: Partial<Operation>,
  ) {
    setOperations(
      (current) =>
        current.map(
          (operation) =>
            operation.id === id
              ? {
                  ...operation,
                  ...changes,
                }
              : operation,
        ),
    );
  }

  function moveOperation(
    id: number,
    direction: 'up' | 'down',
  ) {
    setOperations(
      (current) => {
        const index =
          current.findIndex(
            (operation) =>
              operation.id === id,
          );

        if (index === -1) {
          return current;
        }

        const newIndex =
          direction === 'up'
            ? index - 1
            : index + 1;

        if (
          newIndex < 0 ||
          newIndex >= current.length
        ) {
          return current;
        }

        const copy = [...current];

        [
          copy[index],
          copy[newIndex],
        ] = [
          copy[newIndex],
          copy[index],
        ];

        return copy;
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Execution
  // ---------------------------------------------------------------------------

  function executePipeline() {
    setError('');

    if (!operations.length) {
      setOutput(input);
      return;
    }

    try {
      let result = input;

      for (const operation of operations) {
        result = runOperation(
          operation,
          result,
        );
      }

      setOutput(result);

      const label =
        operations
          .map((operation) => {
            const mode =
              operation.mode === 'decode'
                ? 'decode'
                : 'encode';

            return `${operation.algo} ${mode}`;
          })
          .join(' → ');

      setHistory(
        (current) => [
          {
            op: label,
            time: 'just now',
          },
          ...current,
        ].slice(0, 10),
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to process input.';

      setError(message);
      setOutput('');
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLTextAreaElement>,
  ) {
    const value =
      event.target.value;

    setInput(value);

    if (autoRun) {
      setTimeout(
        () => executePipeline(),
        0,
      );
    }
  }

  function copyOutput() {
    if (!output) {
      return;
    }

    navigator.clipboard
      ?.writeText(output)
      .catch(() => {
        // Clipboard permissions may be unavailable.
      });
  }

  function swapInputOutput() {
    setInput(output);
    setOutput(input);
    setError('');
  }

  function clearAll() {
    setInput('');
    setOutput('');
    setError('');
  }

  function resetTool() {
    setInput('');
    setOutput('');
    setError('');

    setOperations([
      {
        id: 1,
        algo: 'Caesar',
        key: '3',
        mode: 'decode',
      },
    ]);

    setHistory([]);
  }

  function operationNeedsKey(
    algo: Algo,
  ): boolean {
    return (
      algo === 'Caesar' ||
      algo === 'Vigenère' ||
      algo === 'XOR' ||
      algo === 'RSA (modular)'
    );
  }

  function operationSupportsMode(
    algo: Algo,
  ): boolean {
    return (
      algo === 'Caesar' ||
      algo === 'Vigenère' ||
      algo === 'Base64' ||
      algo === 'RSA (modular)'
    );
  }

  function getKeyPlaceholder(
    algo: Algo,
  ): string {
    switch (algo) {
      case 'Caesar':
        return 'Shift (e.g. 3)';

      case 'Vigenère':
        return 'Key (e.g. shadow)';

      case 'XOR':
        return 'Key (e.g. secret)';

      case 'RSA (modular)':
        return 'n=3233,e=17';

      default:
        return '';
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="p-6 max-w-[1500px] mx-auto space-y-4">

      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-paper">
            Cryptography Workbench
          </h1>

          <p className="text-xs text-fog mt-1">
            Transform, chain, and analyze
            cryptographic operations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setAutoRun(
                (current) => !current,
              )
            }
            className={`text-[11px] px-3 py-1.5 rounded-lg border font-mono transition-colors ${
              autoRun
                ? 'border-signal-dim bg-signal/12 text-signal'
                : 'border-line text-fog hover:text-paper'
            }`}
          >
            Live: {autoRun ? 'ON' : 'OFF'}
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={executePipeline}
          >
            Run Pipeline
          </Button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main Workbench */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Input */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Input
              </CardTitle>

              <Badge tone="mint">
                {input.length} chars
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <Textarea
              rows={9}
              value={input}
              onChange={handleInputChange}
              placeholder="Enter plaintext, ciphertext, encoded data, or CTF challenge data..."
              className="text-xs font-mono"
            />

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                onClick={clearAll}
                className="h-8 px-2.5 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper"
              >
                <Trash2
                  size={12}
                  className="inline mr-1"
                />
                Clear
              </button>

              <button
                type="button"
                onClick={swapInputOutput}
                className="h-8 px-2.5 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper"
              >
                <RefreshCw
                  size={12}
                  className="inline mr-1"
                />
                Swap
              </button>

              <button
                type="button"
                onClick={resetTool}
                className="h-8 px-2.5 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper"
              >
                Reset
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Output
              </CardTitle>

              <div className="flex items-center gap-2">
                <Badge
                  tone={
                    error
                      ? 'amber'
                      : 'mint'
                  }
                >
                  {error
                    ? 'error'
                    : 'result'}
                </Badge>

                <button
                  type="button"
                  onClick={copyOutput}
                  disabled={!output}
                  className="h-7 px-2 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper disabled:opacity-40"
                >
                  <Copy
                    size={12}
                    className="inline mr-1"
                  />
                  Copy
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {error ? (
              <div className="rounded-lg border border-amber/30 bg-amber/5 p-3">
                <p className="text-xs text-amber font-mono">
                  {error}
                </p>
              </div>
            ) : (
              <pre className="min-h-[190px] text-xs font-mono text-mint leading-relaxed whitespace-pre-wrap break-words">
                {output || (
                  <span className="text-fog-dim">
                    Output will appear here...
                  </span>
                )}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pipeline */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>
                Operation Pipeline
              </CardTitle>

              <CardSubtitle>
                Operations run from top to bottom.
              </CardSubtitle>
            </div>

            <button
              type="button"
              onClick={() =>
                addOperation()
              }
              className="h-8 px-3 rounded-lg border border-signal-dim bg-signal/10 text-signal text-[11px] font-mono hover:bg-signal/15"
            >
              <Plus
                size={12}
                className="inline mr-1"
              />
              Add Operation
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">

            {operations.length === 0 && (
              <div className="rounded-lg border border-dashed border-line p-6 text-center">
                <p className="text-xs text-fog">
                  No operations configured.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    addOperation()
                  }
                  className="mt-3 text-xs font-mono text-signal hover:underline"
                >
                  Add your first operation
                </button>
              </div>
            )}

            {operations.map(
              (operation, index) => (
                <div
                  key={operation.id}
                  className="rounded-lg border border-line bg-black/10 p-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2">

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-6 h-6 flex items-center justify-center rounded bg-signal/10 text-signal text-[10px] font-mono">
                        {index + 1}
                      </span>

                      <select
                        value={operation.algo}
                        onChange={(event) =>
                          updateOperation(
                            operation.id,
                            {
                              algo: event
                                .target
                                .value as Algo,
                              key: getDefaultKey(
                                event
                                  .target
                                  .value as Algo,
                              ),
                            },
                          )
                        }
                        className="h-8 rounded-lg border border-line bg-transparent px-2 text-xs font-mono text-paper outline-none"
                      >
                        {algorithms.map(
                          (algorithm) => (
                            <option
                              key={algorithm}
                              value={algorithm}
                              className="bg-[#171b23]"
                            >
                              {algorithm}
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {operationNeedsKey(
                      operation.algo,
                    ) && (
                      <Input
                        value={operation.key}
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>,
                        ) =>
                          updateOperation(
                            operation.id,
                            {
                              key: event
                                .target
                                .value,
                            },
                          )
                        }
                        placeholder={getKeyPlaceholder(
                          operation.algo,
                        )}
                        className="h-8 flex-1 min-w-[180px] text-xs font-mono"
                      />
                    )}

                    {operationSupportsMode(
                      operation.algo,
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          updateOperation(
                            operation.id,
                            {
                              mode:
                                operation.mode ===
                                'decode'
                                  ? 'encode'
                                  : 'decode',
                            },
                          )
                        }
                        className="h-8 px-3 rounded-lg border border-line text-[11px] font-mono text-fog hover:text-paper"
                      >
                        {operation.mode ===
                        'decode'
                          ? 'Decode'
                          : 'Encode'}
                      </button>
                    )}

                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() =>
                          moveOperation(
                            operation.id,
                            'up',
                          )
                        }
                        disabled={index === 0}
                        className="h-8 w-8 rounded-lg border border-line text-fog hover:text-paper disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp
                          size={13}
                          className="mx-auto"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveOperation(
                            operation.id,
                            'down',
                          )
                        }
                        disabled={
                          index ===
                          operations.length - 1
                        }
                        className="h-8 w-8 rounded-lg border border-line text-fog hover:text-paper disabled:opacity-30"
                        title="Move down"
                      >
                        <ArrowDown
                          size={13}
                          className="mx-auto"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeOperation(
                            operation.id,
                          )
                        }
                        className="h-8 w-8 rounded-lg border border-line text-fog hover:text-amber"
                        title="Remove operation"
                      >
                        <X
                          size={13}
                          className="mx-auto"
                        />
                      </button>
                    </div>
                  </div>

                  {operation.algo ===
                    'RSA (modular)' && (
                    <p className="text-[10px] text-fog-dim mt-2 font-mono">
                      Example: n=3233,e=17
                      for encryption or
                      n=3233,d=2753 for
                      decryption. Input may
                      contain multiple
                      space-separated integers.
                    </p>
                  )}
                </div>
              ),
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-line">
            <p className="text-[11px] text-fog-dim font-mono">
              {operations.length}{' '}
              operation
              {operations.length === 1
                ? ''
                : 's'}{' '}
              configured
            </p>

            <Button
              variant="primary"
              size="sm"
              onClick={executePipeline}
            >
              Run Pipeline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Quick Add */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <CardTitle>
            Quick Add Operation
          </CardTitle>

          <CardSubtitle>
            Add a common CTF transformation
            to the pipeline.
          </CardSubtitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2">
            {algorithms.map(
              (algorithm) => (
                <button
                  key={algorithm}
                  type="button"
                  onClick={() =>
                    addOperation(
                      algorithm,
                    )
                  }
                  className="px-3 py-1.5 rounded-lg border border-line text-[11px] font-mono text-fog hover:border-signal-dim hover:text-signal transition-colors"
                >
                  <Plus
                    size={11}
                    className="inline mr-1"
                  />
                  {algorithm}
                </button>
              ),
            )}
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* Analysis */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>
              Frequency Analysis
            </CardTitle>

            <CardSubtitle>
              Letter distribution in current
              input vs. English baseline.
            </CardSubtitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer
              width="100%"
              height={220}
            >
              <BarChart
                data={freqData}
                margin={{
                  left: -20,
                  right: 10,
                  top: 5,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="letter"
                  tick={{
                    fill: '#8890a2',
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: '#8890a2',
                    fontSize: 9,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      '#171b23',
                    border:
                      '1px solid #232733',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />

                <Bar
                  dataKey="freq"
                  name="Input %"
                  fill="#5b8def"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="baseline"
                  name="English %"
                  fill="#8890a2"
                  radius={[
                    3,
                    3,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* XOR */}
        <Card>
          <CardHeader>
            <CardTitle>
              XOR Byte Analysis
            </CardTitle>

            <CardSubtitle>
              First 64 bytes of the XOR
              operation.
            </CardSubtitle>
          </CardHeader>

          <CardContent>
            {xorData.length === 0 ? (
              <div className="h-[220px] flex items-center justify-center">
                <p className="text-xs text-fog-dim font-mono">
                  Add an XOR operation to
                  inspect byte-level
                  transformations.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-[10px] text-fog-dim font-mono border-b border-line pb-2">
                  <span>INDEX</span>
                  <span>INPUT</span>
                  <span>KEY</span>
                  <span>OUTPUT</span>
                </div>

                <div className="max-h-[190px] overflow-y-auto space-y-1">
                  {xorData.map(
                    (byte) => (
                      <div
                        key={byte.index}
                        className="grid grid-cols-4 gap-2 text-[10px] font-mono"
                      >
                        <span className="text-fog-dim">
                          {byte.index
                            .toString()
                            .padStart(
                              2,
                              '0',
                            )}
                        </span>

                        <span className="text-paper">
                          0x
                          {formatHex(
                            byte.input,
                          )}
                        </span>

                        <span className="text-fog">
                          0x
                          {formatHex(
                            byte.key,
                          )}
                        </span>

                        <span className="text-mint">
                          0x
                          {formatHex(
                            byte.output,
                          )}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* History */}
      {/* ------------------------------------------------------------------ */}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History
              size={13}
              className="text-fog"
            />

            <CardTitle>
              Transformation History
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {history.length === 0 ? (
            <p className="text-xs text-fog-dim font-mono">
              No transformations have been
              executed yet.
            </p>
          ) : (
            <div className="space-y-2">
              {history.map(
                (entry, index) => (
                  <div
                    key={`${entry.op}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Clipboard
                        size={12}
                        className="text-fog-dim"
                      />

                      <span className="text-[11px] text-paper font-mono">
                        {entry.op}
                      </span>
                    </div>

                    <span className="text-[10px] text-fog-dim shrink-0">
                      {entry.time}
                    </span>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
