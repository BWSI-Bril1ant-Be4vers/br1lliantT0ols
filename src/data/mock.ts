export const weeklyActivity = [
  { day: 'Mon', analyses: 4 },
  { day: 'Tue', analyses: 7 },
  { day: 'Wed', analyses: 3 },
  { day: 'Thu', analyses: 9 },
  { day: 'Fri', analyses: 12 },
  { day: 'Sat', analyses: 6 },
  { day: 'Sun', analyses: 8 },
];

export const categoryBreakdown = [
  { name: 'Crypto', value: 34, color: '#5b8def' },
  { name: 'Forensics', value: 28, color: '#47c9d6' },
  { name: 'Web', value: 19, color: '#e0a458' },
  { name: 'RevEng', value: 15, color: '#e0637a' },
  { name: 'Misc', value: 9, color: '#5fc98a' },
];

export const recentAnalyses = [
  { id: 1, name: 'firmware_dump.bin', type: 'Binary', result: 'Packed (UPX)', time: '4m ago', tone: 'amber' as const },
  { id: 2, name: 'capture_final.pcap', type: 'Network', result: '3 credentials found', time: '22m ago', tone: 'rose' as const },
  { id: 3, name: 'flag_ciphertext.txt', type: 'Crypto', result: 'Vigenère — solved', time: '1h ago', tone: 'mint' as const },
  { id: 4, name: 'profile_photo.png', type: 'Forensics', result: 'Hidden ZIP in EXIF', time: '2h ago', tone: 'signal' as const },
  { id: 5, name: 'login.php', type: 'Web', result: 'SQLi confirmed', time: '3h ago', tone: 'rose' as const },
];

export const favoriteTools = [
  { name: 'Hash Identifier', category: 'Crypto', uses: 142 },
  { name: 'XOR Brute-Force', category: 'Crypto', uses: 98 },
  { name: 'EXIF Extractor', category: 'Forensics', uses: 87 },
  { name: 'JWT Inspector', category: 'Web', uses: 76 },
  { name: 'Strings Viewer', category: 'RevEng', uses: 61 },
  { name: 'Entropy Analyzer', category: 'Forensics', uses: 54 },
];

export const aiSuggestions = [
  'Recent upload firmware_dump.bin shows high entropy in .text — likely packed.',
  'capture_final.pcap contains cleartext FTP auth — try the Credential Extractor.',
  'flag_ciphertext.txt key length converges to 6 via Kasiski examination.',
];

export const recentlySolved = [
  { name: 'Cold Boot', category: 'Forensics', points: 250 },
  { name: 'Substitution Sam', category: 'Crypto', points: 150 },
  { name: 'Header Games', category: 'Web', points: 200 },
];

export const pinnedNotes = [
  { title: 'RSA — common modulus attack', updated: '2d ago' },
  { title: 'PNG chunk structure cheatsheet', updated: '5d ago' },
];

export const workbenchGraph = {
  nodes: [
    { id: 'pcap', label: 'capture.pcap', x: 60, y: 140, kind: 'file' },
    { id: 'jpeg', label: 'extracted.jpg', x: 260, y: 60, kind: 'image' },
    { id: 'zip', label: 'hidden.zip', x: 260, y: 220, kind: 'archive' },
    { id: 'exe', label: 'payload.exe', x: 460, y: 220, kind: 'binary' },
    { id: 'str', label: 'flag string', x: 460, y: 340, kind: 'flag' },
  ],
  edges: [
    ['pcap', 'jpeg'],
    ['pcap', 'zip'],
    ['zip', 'exe'],
    ['exe', 'str'],
  ],
};

export const utilityCategories = [
  { name: 'Encoding', tools: ['Base64', 'Base32', 'URL Encode', 'HTML Entities'] },
  { name: 'Decoding', tools: ['Base64', 'ROT13', 'QR Decode', 'Morse'] },
  { name: 'Hashing', tools: ['MD5', 'SHA-1', 'SHA-256', 'bcrypt Check'] },
  { name: 'Base Conversion', tools: ['Dec ↔ Hex', 'Dec ↔ Bin', 'ASCII Table'] },
  { name: 'Regex', tools: ['Tester', 'Extractor', 'Cheatsheet'] },
  { name: 'JWT', tools: ['Decode', 'Verify', 'Forge (edu)'] },
  { name: 'URL', tools: ['Parser', 'Encoder', 'Shortener Lookup'] },
  { name: 'JSON', tools: ['Formatter', 'Diff', 'Path Query'] },
  { name: 'XML', tools: ['Formatter', 'XXE Tester'] },
  { name: 'Binary', tools: ['Bit Viewer', 'Two’s Complement'] },
  { name: 'Hex', tools: ['Hex ↔ ASCII', 'Hex Diff'] },
  { name: 'Time', tools: ['Unix Timestamp', 'Timezone Convert'] },
  { name: 'Networking', tools: ['CIDR Calc', 'Subnet Splitter', 'Whois'] },
];

export const forensicsFindings = [
  { label: 'File Type', value: 'PNG image data, 1920 x 1080, 8-bit/color RGBA' },
  { label: 'MD5', value: 'a3f5e9c21b4d8f0012e7c9a4b6d1f3e8' },
  { label: 'Entropy', value: '7.94 / 8.0 — likely contains compressed data' },
  { label: 'EXIF Software', value: 'GIMP 2.10' },
  { label: 'Hidden Signature', value: 'PK\\x03\\x04 found at offset 0x8A21' },
];

export const pngChunks = [
  { type: 'IHDR', offset: '0x0000', size: '13 B', note: 'Header — 1920×1080' },
  { type: 'IDAT', offset: '0x0019', size: '842 KB', note: 'Image data stream' },
  { type: 'tEXt', offset: '0xD3A2', size: '48 B', note: 'Comment: "nothing to see here"' },
  { type: 'zTXt', offset: '0xD3D8', size: '212 B', note: 'Compressed text chunk' },
  { type: 'IEND', offset: '0xD4B0', size: '0 B', note: 'End marker' },
];

export const freqAnalysis = [
  { letter: 'E', freq: 12.4 }, { letter: 'T', freq: 10.1 }, { letter: 'A', freq: 8.7 },
  { letter: 'O', freq: 8.2 }, { letter: 'I', freq: 7.5 }, { letter: 'N', freq: 6.9 },
  { letter: 'S', freq: 6.1 }, { letter: 'H', freq: 5.8 }, { letter: 'R', freq: 5.3 },
  { letter: 'D', freq: 4.2 },
];

export const pluginList = [
  { name: 'Ghidra Bridge', desc: 'Send binaries directly to a running Ghidra instance.', rating: 4.8, installs: '12.3k' },
  { name: 'HTB Sync', desc: 'Pull active machine info and submit flags without leaving the workbench.', rating: 4.6, installs: '9.1k' },
  { name: 'Wordlist Manager', desc: 'Curated + custom wordlists for cracking modules.', rating: 4.4, installs: '7.8k' },
  { name: 'CyberChef Bridge', desc: 'Import/export recipes from CyberChef.', rating: 4.7, installs: '15.6k' },
];
