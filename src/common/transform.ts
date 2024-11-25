import { ClassConstructor, plainToInstance } from 'class-transformer';

export const transformArray = <T, K>(
  classConstructor: ClassConstructor<T>,
  plain: K[],
): T[] =>
  plainToInstance(classConstructor, plain, {
    excludeExtraneousValues: true,
  });

export const transformObject = <T, K>(
  classConstructor: ClassConstructor<T>,
  plain: K,
): T =>
  plainToInstance(classConstructor, plain, {
    excludeExtraneousValues: true,
  });
