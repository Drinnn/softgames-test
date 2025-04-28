import { EntityError } from "./entity.error";
import { GameProps, GameType } from "./game.entity";

export class GameValidator {
    static validate(props: GameProps) {
        if(props.name === '') {
            throw new EntityError('Game', 'Name is required');
        }

        if(props.players.min < 1) {
            throw new EntityError('Game', 'Minimum players must be greater than 0');
        }

        if(props.players.max < props.players.min) {
            throw new EntityError('Game', 'Maximum players must be greater than minimum players');
        }

        if(props.publisher === '') {
            throw new EntityError('Game', 'Publisher is required');
        }

        if(props.expansions.length > 0) {
            props.expansions.forEach(expansion => {
                if(expansion < 1) {
                    throw new EntityError('Game', 'Expansion must be greater than 0');
                }
            });
        }

        if(props.type === GameType.BaseGame && props.baseGame) {
            throw new EntityError('Game', 'Base game cannot have a base game');
        }

        if(props.type === GameType.Expansion && !props.baseGame) {
            throw new EntityError('Game', 'Expansion must have a base game');
        }
    }
}