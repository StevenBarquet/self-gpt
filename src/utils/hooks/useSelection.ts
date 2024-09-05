import { useState } from 'react';

/**
 * Hook to manage the selection of items in a list.
 * @param {T[]} initialArray The initial array of items.
 * @returns {Object} An object with the following properties:
 * - `selectedIds`: The array of selected item's IDs.
 * - `toggleSelectAll`: A function to toggle the selection of all items in the list.
 * - `toggleSelectOne`: A function to toggle the selection of a single item.
 * - `isSelected`: A function to check if an item is selected.
 */
export const useSelection = <T extends { id: string }>(initialArray: T[]) => {
  const [selectedIds, setSelectedIds] = useState(new Set());

  /**
   * Toggles the selection of all items in the list.
   * If all items are currently selected, it deselects all of them.
   * If not all items are currently selected, it selects all of them.
   */
  const toggleSelectAll = () => {
    if (selectedIds.size === initialArray.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(initialArray.map((item) => item.id)));
    }
  };

  /**
   * Toggles the selection of a single item.
   * @param {string} id The id of the item to toggle.
   */
  const toggleSelectOne = (id: string) => {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  };

  const isSelected = (id: string) => selectedIds.has(id);

  return {
    selectedIds: Array.from(selectedIds) as unknown as string[],
    toggleSelectAll,
    toggleSelectOne,
    isSelected,
  };
};
