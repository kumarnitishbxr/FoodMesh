import { Prisma } from '@prisma/client';
import { PrismaService } from '../persistence/prisma.service';

export interface SoftDeleteModelDelegate<
  TFindManyArgs,
  TFindUniqueArgs,
  TCreateArgs,
  TUpdateArgs,
  TUpdateManyArgs,
> {
  findMany(args?: TFindManyArgs): Promise<unknown>;
  findFirst(args?: TFindManyArgs): Promise<unknown>;
  findUnique(args: TFindUniqueArgs): Promise<unknown>;
  create(args: TCreateArgs): Promise<unknown>;
  update(args: TUpdateArgs): Promise<unknown>;
  updateMany(args: TUpdateManyArgs): Promise<Prisma.BatchPayload>;
}

export abstract class BaseRepository<
  TEntity,
  TFindManyArgs,
  TFindUniqueArgs,
  TCreateArgs,
  TUpdateArgs,
  TUpdateManyArgs,
> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly delegate: SoftDeleteModelDelegate<
      TFindManyArgs,
      TFindUniqueArgs,
      TCreateArgs,
      TUpdateArgs,
      TUpdateManyArgs
    >,
  ) {}

  protected findMany(args?: TFindManyArgs): Promise<TEntity[]> {
    return this.delegate.findMany(args) as Promise<TEntity[]>;
  }

  protected findFirst(args?: TFindManyArgs): Promise<TEntity | null> {
    return this.delegate.findFirst(args) as Promise<TEntity | null>;
  }

  protected findUnique(args: TFindUniqueArgs): Promise<TEntity | null> {
    return this.delegate.findUnique(args) as Promise<TEntity | null>;
  }

  protected create(args: TCreateArgs): Promise<TEntity> {
    return this.delegate.create(args) as Promise<TEntity>;
  }

  protected update(args: TUpdateArgs): Promise<TEntity> {
    return this.delegate.update(args) as Promise<TEntity>;
  }

  protected softDelete(args: TUpdateManyArgs): Promise<Prisma.BatchPayload> {
    return this.delegate.updateMany(args);
  }

  protected transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => callback(tx));
  }
}
