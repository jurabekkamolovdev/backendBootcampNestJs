import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateGameSchema = z.object({
  opponent: z.enum(['player', 'computer']),
  board: z.array(z.array(z.number()).length(3)).length(3),
});

export class CreateGameRequestDto extends createZodDto(CreateGameSchema) {}
