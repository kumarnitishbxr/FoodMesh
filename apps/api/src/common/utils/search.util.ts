export interface SearchableField {
  name: string;
  mode?: 'default' | 'insensitive';
}

export interface SearchOptions {
  term?: string | null;
  fields: SearchableField[];
}

type SearchCondition = Record<string, unknown>;

export class SearchUtil {
  static buildContainsWhere({ term, fields }: SearchOptions): { OR: SearchCondition[] } | undefined {
    const normalizedTerm = term?.trim();

    if (!normalizedTerm) {
      return undefined;
    }

    return {
      OR: fields.map((field) => ({
        [field.name]: {
          contains: normalizedTerm,
          ...(field.mode === 'insensitive' ? { mode: 'insensitive' } : {}),
        },
      })),
    };
  }
}
