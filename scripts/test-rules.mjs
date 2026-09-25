// Pure JavaScript test runner for Stone Paper Pencil Scissors rules

const WINS_AGAINST = {
  stone: ['scissors', 'pencil'],
  scissors: ['paper', 'pencil'],
  pencil: ['paper'],
  paper: ['stone'],
};

function determineRoundWinner(player1, player2) {
  if (player1 === player2) return 'draw';
  if (WINS_AGAINST[player1]?.includes(player2)) return 'player1';
  if (WINS_AGAINST[player2]?.includes(player1)) return 'player2';
  return 'draw';
}

const testCases = [
  // Defined wins for player 1
  { p1: 'stone', p2: 'scissors', expected: 'player1', description: 'STONE beats SCISSORS' },
  { p1: 'stone', p2: 'pencil', expected: 'player1', description: 'STONE beats PENCIL' },
  { p1: 'scissors', p2: 'paper', expected: 'player1', description: 'SCISSORS beats PAPER' },
  { p1: 'scissors', p2: 'pencil', expected: 'player1', description: 'SCISSORS beats PENCIL' },
  { p1: 'pencil', p2: 'paper', expected: 'player1', description: 'PENCIL beats PAPER' },
  { p1: 'paper', p2: 'stone', expected: 'player1', description: 'PAPER beats STONE' },

  // Inverse wins for player 2
  { p1: 'scissors', p2: 'stone', expected: 'player2', description: 'SCISSORS loses to STONE' },
  { p1: 'pencil', p2: 'stone', expected: 'player2', description: 'PENCIL loses to STONE' },
  { p1: 'paper', p2: 'scissors', expected: 'player2', description: 'PAPER loses to SCISSORS' },
  { p1: 'pencil', p2: 'scissors', expected: 'player2', description: 'PENCIL loses to SCISSORS' },
  { p1: 'paper', p2: 'pencil', expected: 'player2', description: 'PAPER loses to PENCIL' },
  { p1: 'stone', p2: 'paper', expected: 'player2', description: 'STONE loses to PAPER' },

  // Draws
  { p1: 'stone', p2: 'stone', expected: 'draw', description: 'STONE vs STONE is DRAW' },
  { p1: 'paper', p2: 'paper', expected: 'draw', description: 'PAPER vs PAPER is DRAW' },
  { p1: 'pencil', p2: 'pencil', expected: 'draw', description: 'PENCIL vs PENCIL is DRAW' },
  { p1: 'scissors', p2: 'scissors', expected: 'draw', description: 'SCISSORS vs SCISSORS is DRAW' },
];

let failed = 0;
console.log('--- Testing Stone Paper Pencil Scissors Rules ---');
for (const tc of testCases) {
  const result = determineRoundWinner(tc.p1, tc.p2);
  if (result === tc.expected) {
    console.log(`✓ PASS: ${tc.description}`);
  } else {
    console.error(`✗ FAIL: ${tc.description} (Got ${result}, expected ${tc.expected})`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed!`);
  process.exit(1);
} else {
  console.log(`\nAll ${testCases.length} game rule tests passed successfully!\n`);
}
