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

  describe('update', () => {
    it('should update a base game with valid props', () => {
      const game = Game.create(validBaseGameProps);
      const updatedProps = {
        ...validBaseGameProps,
        name: 'Updated Catan',
        releaseYear: 2000,
        publisher: 'New Publisher'
      };
      
      game.update(updatedProps);
      
      expect(game.name).toBe('Updated Catan');
      expect(game.releaseYear).toBe(2000);
      expect(game.publisher).toBe('New Publisher');
      expect(game.type).toBe(GameType.BaseGame);
    });

    it('should update an expansion game with valid props', () => {
      const game = Game.create(validExpansionProps);
      const updatedProps = {
        ...validExpansionProps,
        name: 'Updated Seafarers',
        baseGame: 456
      };
      
      game.update(updatedProps);
      
      expect(game.name).toBe('Updated Seafarers');
      expect(game.baseGame).toBe(456);
      expect(game.type).toBe(GameType.Expansion);
    });

    it('should change a game from base game to expansion', () => {
      const game = Game.create(validBaseGameProps);
      const updatedProps = {
        ...validBaseGameProps,
        type: GameType.Expansion,
        baseGame: 789,
        standalone: false
      };
      
      game.update(updatedProps);
      
      expect(game.type).toBe(GameType.Expansion);
      expect(game.baseGame).toBe(789);
      expect(game.standalone).toBe(false);
    });

    it('should change a game from expansion to base game', () => {
      const game = Game.create(validExpansionProps);
      const updatedProps = {
        ...validExpansionProps,
        type: GameType.BaseGame,
        baseGame: undefined
      };
      
      game.update(updatedProps);
      
      expect(game.type).toBe(GameType.BaseGame);
      expect(game.baseGame).toBeUndefined();
    });

    it('should throw error when updating with empty name', () => {
      const game = Game.create(validBaseGameProps);
      const invalidProps = { ...validBaseGameProps, name: '' };
      
      expect(() => game.update(invalidProps)).toThrow(EntityError);
      expect(() => game.update(invalidProps)).toThrow('Game: Name is required');
      expect(game.name).toBe(validBaseGameProps.name);
    });

    it('should throw error when updating with invalid players', () => {
      const game = Game.create(validBaseGameProps);
      const invalidProps = {
        ...validBaseGameProps, 
        players: { min: 3, max: 2 }
      };
      
      expect(() => game.update(invalidProps)).toThrow(EntityError);
      expect(() => game.update(invalidProps)).toThrow('Game: Maximum players must be greater than minimum players');
      expect(game.players).toEqual(validBaseGameProps.players);
    });

    it('should throw error when updating expansion without base game', () => {
      const game = Game.create(validExpansionProps);
      const invalidProps = {
        ...validExpansionProps,
        baseGame: undefined
      };
      
      expect(() => game.update(invalidProps)).toThrow(EntityError);
      expect(() => game.update(invalidProps)).toThrow('Game: Expansion must have a base game');
      expect(game.baseGame).toBe(validExpansionProps.baseGame);
    });

    it('should handle partial updates', () => {
      const game = Game.create(validBaseGameProps);
      
      game.update({ name: 'Partially Updated Catan' });
      expect(game.name).toBe('Partially Updated Catan');
      expect(game.publisher).toBe(validBaseGameProps.publisher); 
      
      game.update({ releaseYear: 2001 });
      expect(game.name).toBe('Partially Updated Catan');
      expect(game.releaseYear).toBe(2001);
      expect(game.publisher).toBe(validBaseGameProps.publisher);
      
      game.update({ players: { min: 2, max: 6 } });
      expect(game.players.min).toBe(2);
      expect(game.players.max).toBe(6);
      expect(game.name).toBe('Partially Updated Catan');
    });

    it('should validate partial updates against the complete object', () => {
      const game = Game.create(validExpansionProps);
      
      expect(() => game.update({ baseGame: undefined })).toThrow(EntityError);
      expect(game.baseGame).toBe(validExpansionProps.baseGame);
      
      game.update({ baseGame: 999 });
      expect(game.baseGame).toBe(999);
    });
  });
});
