'use server';

import { compareToolPrices } from '@/lib/comparison/engine';
import { ToolComparisonResult } from '@/lib/comparison/types';

export type CompareActionResult =
  | { success: true; data: ToolComparisonResult }
  | { success: false; error: string };

/**
 * Server action to compare tool prices across 9 Canadian hardware stores.
 * Accepts either a retailer product URL or a freeform tool name/model (e.g. "Milwaukee M18 hammer drill").
 */
export async function compareTool(input: string): Promise<CompareActionResult> {
  try {
    const trimmed = (input || '').trim();
    if (!trimmed) {
      return {
        success: false,
        error: 'Please enter a tool name or Canadian retailer URL to compare prices.',
      };
    }

    const comparison = await compareToolPrices(trimmed);
    return {
      success: true,
      data: comparison,
    };
  } catch (error) {
    console.error('Error executing compareTool server action:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to compare Canadian tool prices.',
    };
  }
}
