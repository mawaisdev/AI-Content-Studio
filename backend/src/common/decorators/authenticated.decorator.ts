import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from './public.decorator';

export const Authenticated = () => SetMetadata(IS_PUBLIC_KEY, false);