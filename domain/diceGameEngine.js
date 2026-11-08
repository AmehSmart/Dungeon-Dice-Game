
export function createDiceGameEngine(heroes) {
  let playerHero = null;
  let computerHero = null;
  let playerHp = 0;
  let computerHp = 0;

  const getHeroes = () => heroes;

  const getHeroById = (heroId) => {
    const id = Number(heroId);
    return heroes.find((hero) => hero.id === id) || null;
  };

  const chooseComputerHero = (playerHeroId) => {
    const pool = heroes.filter((hero) => hero.id !== Number(playerHeroId));
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const startBattle = (playerHeroId) => {
    playerHero = getHeroById(playerHeroId);
    if (!playerHero) {
      return { error: 'Hero not found.' };
    }

    computerHero = chooseComputerHero(playerHero.id);
    if (!computerHero) {
      return { error: 'No available opponent.' };
    }

    playerHp = playerHero.maxHp;
    computerHp = computerHero.maxHp;

    return { playerHero, computerHero, playerHp, computerHp };
  };

  const playRound = () => {
    if (!playerHero || !computerHero) {
      return { error: 'Battle has not started.' };
    }

    if (playerHp === 0 || computerHp === 0) {
      return { error: 'Battle is already over.' };
    }

    const playerAttackRoll = Math.floor(Math.random() * playerHero.attackPower) + 1;
    const computerAttackRoll = Math.floor(Math.random() * computerHero.attackPower) + 1;
    const playerDefenseRoll = Math.floor(Math.random() * playerHero.defensePower) + 1;
    const computerDefenseRoll = Math.floor(Math.random() * computerHero.defensePower) + 1;

    const damageToComputer = Math.max(0, playerAttackRoll - computerDefenseRoll);
    const damageToPlayer = Math.max(0, computerAttackRoll - playerDefenseRoll);

    computerHp = Math.max(0, computerHp - damageToComputer);
    playerHp = Math.max(0, playerHp - damageToPlayer);

    const outcome =
      computerHp === 0 && playerHp === 0
        ? 'draw'
        : computerHp === 0
          ? 'player_win'
          : playerHp === 0
            ? 'player_loss'
            : 'ongoing';

    const damageLine =
      `${damageToComputer} damage dealt to your opponent, ${damageToPlayer} damage dealt to you`;

    const message =
      outcome === 'player_win'
        ? `You won the round! ${damageLine}`
        : outcome === 'player_loss'
          ? `You lost the round! ${damageLine}`
          : outcome === 'draw'
            ? `The round ended in a draw! ${damageLine}`
            : `Round continues. ${damageLine}`;

    return {
      playerHero,
      computerHero,
      playerAttackRoll,
      computerAttackRoll,
      playerDefenseRoll,
      computerDefenseRoll,
      damageToComputer,
      damageToPlayer,
      playerHp,
      computerHp,
      outcome,
      message,
    };
  };

  const resetBattle = () => {
    playerHero = null;
    computerHero = null;
    playerHp = 0;
    computerHp = 0;
  };

  return {
    getHeroes,
    getHeroById,
    chooseComputerHero,
    startBattle,
    playRound,
    resetBattle,
  };
}