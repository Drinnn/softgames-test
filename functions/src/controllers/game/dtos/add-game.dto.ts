import { z } from 'zod';
import { GameType } from '../../../entities';

export const addGameDtoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  releaseYear: z.number().int().min(1900).max(new Date().getFullYear()),
  players: z.object({
    min: z.number().int().min(1),
    max: z.number().int().min(1)
  }).refine(data => data.min <= data.max, {
    message: "Minimum players must be less than or equal to maximum players",
    path: ["players"]
  }),
  publisher: z.string().min(1, "Publisher is required"),
  expansions: z.array(z.number().int()),
  standalone: z.boolean().optional(),
  type: z.nativeEnum(GameType),
  baseGame: z.number().int().optional()
    .refine(
      (val) => val === undefined || val !== undefined, 
      { message: "Base game ID is required for expansions" }
    )
});

export type AddGameDto = z.infer<typeof addGameDtoSchema>;

export const validateAddGameDto = (data: unknown) => {
  return addGameDtoSchema.safeParse(data);
}; 