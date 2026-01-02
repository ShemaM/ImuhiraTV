/**
 * Utility functions for debate argument validation and transformation
 */

export interface ArgumentInput {
  speakerName?: string;
  argument: string;
}

export interface TransformedArgument {
  debateId: number;
  faction: 'idubu' | 'akagara';
  speakerName: string | null;
  argument: string;
  orderIndex: number;
}

/**
 * Filters out arguments with empty or whitespace-only content
 */
export function filterValidArguments(args: ArgumentInput[] | undefined): ArgumentInput[] {
  return (args || []).filter(
    (arg) => arg.argument && arg.argument.trim().length > 0
  );
}

/**
 * Transforms arguments for database insertion with proper sanitization
 */
export function transformArgumentsForInsert(
  args: ArgumentInput[],
  debateId: number,
  faction: 'idubu' | 'akagara'
): TransformedArgument[] {
  return args.map((arg, index) => {
    const trimmedSpeakerName = arg.speakerName?.trim();
    return {
      debateId,
      faction,
      speakerName: trimmedSpeakerName && trimmedSpeakerName.length > 0 ? trimmedSpeakerName : null,
      argument: arg.argument.trim(),
      orderIndex: index,
    };
  });
}

/**
 * Formats error response with optional details for development mode
 */
export function formatErrorResponse(error: unknown, baseMessage: string) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return {
    error: baseMessage,
    details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
  };
}
