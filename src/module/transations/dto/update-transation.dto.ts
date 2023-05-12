import { PartialType } from '@nestjs/mapped-types';

import { CreateTransactionDto } from './create-transation.dto';

export class UpdateTransationDto extends PartialType(CreateTransactionDto) {}
