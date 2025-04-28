import { z } from 'zod';
import { GameType } from '../../../entities';

export const updateGameDtoSchema = z.object({
  gameId: z.number().int().min(1),
  name: z.string().min(1, "Name is required").optional(),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  players: z.object({
    min: z.number().int().min(1),
    max: z.number().int().min(1)
  }).refine(data => data.min <= data.max, {
    message: "Minimum players must be less than or equal to maximum players",
    path: ["players"]
  }).optional(),
  publisher: z.string().min(1, "Publisher is required").optional(),
  expansions: z.array(z.number().int()).optional(),
  standalone: z.boolean().optional(),
  type: z.nativeEnum(GameType).optional(),
  baseGame: z.number().int().optional()
}).refine(data => {
  if (data.type === GameType.Expansion && data.baseGame === undefined) {
    return false;
  }
  return true;
}, {
  message: "Base game ID is required for expansions",
  path: ["baseGame"]
});

export type UpdateGameDto = z.infer<typeof updateGameDtoSchema>;

export const validateUpdateGameDto = (data: unknown) => {
  return updateGameDtoSchema.safeParse(data);
}; 