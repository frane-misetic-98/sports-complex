import { JwtPayload } from './jwt-payload';
import { Type } from 'class-transformer';

export class RestRequest {
  @Type(() => JwtPayload)
  user: JwtPayload;
}
