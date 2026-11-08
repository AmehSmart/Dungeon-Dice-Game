import { createDiceGameEngine } from '../domain/diceGameEngine.js'
import { getAllHeroes } from '../db/heroes.js';
import { recordBattleResult } from './statisticController.js';

const heroes = await getAllHeroes();
const engine = createDiceGameEngine(heroes);


export async function heroController(req, res){
  res.json({
    heroes: engine.getHeroes(),
  });
}

export async function battleStartController(req, res) {
    const {heroId} = req.body
    if(heroId === undefined){
        return res.status(400).json({
            error: 'HeroId is required'
        })
    }

    const battle = engine.startBattle(heroId)
    if(battle.error){
        return res.status(400).json({
            error : battle.error
        })
    }

    res.status(200).json({
    playerHero: battle.playerHero,
    computerHero: battle.computerHero,
    playerHp: battle.playerHp,
    computerHp: battle.computerHp,
    message: 'Battle started. Roll to attack!',
    })

}

export async function battleRoundController(req, res) {
    const round = engine.playRound()

    if(round.error){
        console.log(round.error)
        return res.status(400).json({
            error : round.error
        })
    }

    if (round.outcome !== 'ongoing') {
        await recordBattleResult(req.session.userId, round.outcome)
    }

    return res.status(200).json({
     playerHero: round.playerHero,
    computerHero: round.computerHero,
    playerAttackRoll: round.playerAttackRoll,
    playerDefenseRoll: round.playerDefenseRoll,
    computerAttackRoll: round.computerAttackRoll,
    computerDefenseRoll: round.computerDefenseRoll,
    playerHp: round.playerHp,
    computerHp: round.computerHp,
    outcome: round.outcome,
    message: round.message,
    })
}

export async function battleResetController(req, res) {
    const reset = engine.resetBattle()
    return res.status(200).json({ "message": "Battle reset." })

}