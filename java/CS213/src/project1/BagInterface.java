package project1;

import linkedlistadt.ListException;
import linkedlistadt.ListIndexOutOfBoundsException;

/**
 * Specifies the operations for the Bag ADT
 * @author Peter Buonaiuto
 * @version 1.0
 */
public interface BagInterface {
/**
 * Add an item to the end of the list of this bag
 * @param item An Object to be added to the list
 * @throws BagException if the bag is full and no more items can fit
 */
  public void insert(Object item) throws BagException;
  
  /**
   * Remove the last item in the bag
   * @throws BagException if no element to remove (empty)
   */
  public void removeLast() throws BagException;
  
  /**
   * Remove a random item from the bag
   * @throws BagException if bag is already empty
   */
  public void removeRandom() throws BagException;
  
  /**
   * Get the index of the first occurrence of an item from this bag
   * @param item The item to find the index of
   * @return Integer representing index where the item was found or -1 if not
   */
  public int get(Object item);
  
  /**
   * Get a reference to an item in the bag at this index
   * @param index The index to retrieve the element at
   * @return Object that was stored at the supplied index
   * @throws BagException if bag is empty
   * @throws BagIndexOutOfBoundsException if accessing out of bounds element
 * @throws ListException
 * @throws ListIndexOutOfBoundsException
   * @handle index out of bounds
   */
  public Object get(int index) throws BagIndexOutOfBoundsException, BagException, ListIndexOutOfBoundsException, ListException;
  
  /**
   * Check how many items are in the bag
   * @return size of the bag in items
   */
  public int size();
  
  /**
   * Check to see if this bag is empty
   * @return Boolean corresponding to empty status
   */
  public boolean isEmpty();
  
  /**
   * Empty the bag
   * @throws BagException if bag is empty
 * @throws ListException
   */
  public void makeEmpty() throws BagException, ListException;
}
