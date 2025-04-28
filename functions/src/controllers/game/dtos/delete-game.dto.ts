import { z } from "zod";

export const deleteGameDtoSchema = z.object({
    gameId: z.number().int().min(1),
});

export type DeleteGameDto = z.infer<typeof deleteGameDtoSchema>;

export const validateDeleteGameDto = (data: unknown) => {
    return deleteGameDtoSchema.safeParse(data);
};