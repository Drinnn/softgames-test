import { Game, GameProps, GameType } from './game.entity';
import { EntityError } from './entity.error';

describe('Game Entity', () => {
  const validBaseGameProps: GameProps = {
    name: 'Catan',
    releaseYear: 1995,
    players: {
      min: 3,
      max: 4,
    },
    publisher: 'Kosmos',
    expansions: [],
    standalone: true,
    type: GameType.BaseGame,
  };

  const validExpansionProps: GameProps = {
    name: 'Catan: Seafarers',
    releaseYear: 1997,
    players: {
      min: 3,
      max: 4,
    },
    publisher: 'Kosmos',
    expansions: [],
    standalone: false,
    type: GameType.Expansion,
    baseGame: 123, 
  };

  describe('create', () => {
    it('should create a valid base game', () => {
      const game = Game.create(validBaseGameProps);
      
      expect(game.id).toBeDefined();
      expect(game.name).toBe(validBaseGameProps.name);
      expect(game.releaseYear).toBe(validBaseGameProps.releaseYear);
      expect(game.players).toEqual(validBaseGameProps.players);
      expect(game.publisher).toBe(validBaseGameProps.publisher);
      expect(game.expansions).toEqual(validBaseGameProps.expansions);
      expect(game.standalone).toBe(validBaseGameProps.standalone);
      expect(game.type).toBe(validBaseGameProps.type);
      expect(game.baseGame).toBeUndefined();
    });

    it('should create a valid expansion', () => {
      const game = Game.create(validExpansionProps);
      
      expect(game.id).toBeDefined();
      expect(game.name).toBe(validExpansionProps.name);
      expect(game.releaseYear).toBe(validExpansionProps.releaseYear);
      expect(game.players).toEqual(validExpansionProps.players);
      expect(game.publisher).toBe(validExpansionProps.publisher);
      expect(game.expansions).toEqual(validExpansionProps.expansions);
      expect(game.standalone).toBe(validExpansionProps.standalone);
      expect(game.type).toBe(validExpansionProps.type);
      expect(game.baseGame).toBe(validExpansionProps.baseGame);
    });

    it('should create a game with a specific ID', () => {
      const customId = 999;
      const game = Game.create(validBaseGameProps, customId);
      
      expect(game.id).toBe(customId);
    });

    it('should throw error for empty name', () => {
      const invalidProps = { ...validBaseGameProps, name: '' };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Name is required');
    });

    it('should throw error for minimum players less than 1', () => {
      const invalidProps = { 
        ...validBaseGameProps, 
        players: { min: 0, max: 4 } 
      };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Minimum players must be greater than 0');
    });

    it('should throw error when max players less than min players', () => {
      const invalidProps = { 
        ...validBaseGameProps, 
        players: { min: 3, max: 2 } 
      };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Maximum players must be greater than minimum players');
    });

    it('should throw error for empty publisher', () => {
      const invalidProps = { ...validBaseGameProps, publisher: '' };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Publisher is required');
    });

    it('should throw error for invalid expansion ID', () => {
      const invalidProps = { 
        ...validBaseGameProps, 
        expansions: [0] 
      };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Expansion must be greater than 0');
    });

    it('should throw error when base game has a base game property', () => {
      const invalidProps = { 
        ...validBaseGameProps, 
        baseGame: 123 
      };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Base game cannot have a base game');
    });

    it('should throw error when expansion has no base game', () => {
      const invalidProps = { 
        ...validExpansionProps, 
        baseGame: undefined 
      };
      
      expect(() => Game.create(invalidProps)).toThrow(EntityError);
      expect(() => Game.create(invalidProps)).toThrow('Game: Expansion must have a base game');
    });
  });
});
