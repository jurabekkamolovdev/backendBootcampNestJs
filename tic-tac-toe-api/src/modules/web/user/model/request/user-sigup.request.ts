import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const JwtRequest = z.object({
  login: z.string(),
  password: z.string(),
});

export class JwtRequestDto extends createZodDto(JwtRequest) {}
