import { GameValidator } from "./game.validator";

export enum GameType {
    BaseGame = 'BaseGame',
    Expansion = 'Expansion',
}

export interface GameProps {
    name: string;
    releaseYear: number;
    players: {
        min: number;
        max: number;
    };
    publisher: string;
    expansions: number[];
    standalone?: boolean;
    type: GameType;
    baseGame?: number;
}

export class Game {
    private _id: number;
    private props: GameProps;

    private constructor(props: GameProps, id?: number) {
        this.props = props;
        this._id = id ?? Math.floor(Date.now() + Math.random() * 10000);
    }

    static create(props: GameProps, id?: number) {
        GameValidator.validate(props);
        return new Game(props, id);
    }

    update(props: Partial<GameProps>) {
        GameValidator.validate({ ...this.props, ...props });
        this.props = { ...this.props, ...props };
    }

    get id() {
        return this._id;
    }

    get name() {
        return this.props.name;
    }

    get releaseYear() {
        return this.props.releaseYear;
    }

    get players() {
        return this.props.players;
    }
    
    get publisher() {
        return this.props.publisher;
    }

    get expansions() {
        return this.props.expansions;
    }

    get standalone() {
        return this.props.standalone;
    }

    get type() {
        return this.props.type;
    }

    get baseGame() {
        return this.props.baseGame;
    }
}
