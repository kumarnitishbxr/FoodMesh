export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationUtil {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 20;
  static readonly MAX_LIMIT = 100;

  static normalize(params: PaginationParams): Required<PaginationParams> {
    const page = Number.isFinite(params.page) ? Number(params.page) : this.DEFAULT_PAGE;
    const limit = Number.isFinite(params.limit) ? Number(params.limit) : this.DEFAULT_LIMIT;

    return {
      page: Math.max(1, page),
      limit: Math.min(this.MAX_LIMIT, Math.max(1, limit)),
    };
  }

  static toSkipTake(params: PaginationParams): { page: number; limit: number; skip: number; take: number } {
    const { page, limit } = this.normalize(params);

    return {
      page,
      limit,
      skip: (page - 1) * limit,
      take: limit,
    };
  }

  static buildMeta(total: number, params: PaginationParams): PaginationMeta {
    const { page, limit } = this.normalize(params);
    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: totalPages > page,
      hasPreviousPage: page > 1,
    };
  }

  static buildResult<T>(data: T[], total: number, params: PaginationParams): PaginatedResult<T> {
    return {
      data,
      meta: this.buildMeta(total, params),
    };
  }
}
