import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const MoveGameSchema = z.object({
  newBoard: z.array(z.array(z.number()).length(3)).length(3),
});

export class MoveGameRequestDto extends createZodDto(MoveGameSchema) {}
