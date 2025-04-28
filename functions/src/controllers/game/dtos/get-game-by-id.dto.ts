import { z } from "zod";

export const getGameByIdDto = z.object({
  gameId: z.number().int().min(1),
});

export type GetGameByIdDto = z.infer<typeof getGameByIdDto>;

export const validateGetGameByIdDto = (data: unknown) => {
  return getGameByIdDto.safeParse(data);
};
