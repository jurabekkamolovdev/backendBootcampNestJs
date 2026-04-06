import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const CreateUserSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export class CreateUserRequestDto extends createZodDto(CreateUserSchema) {}
