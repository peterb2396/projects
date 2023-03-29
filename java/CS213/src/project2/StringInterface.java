package project2;

/**
 * Specifies the operations for the LinkedString ADT
 * @author Peter Buonaiuto
 * @version 1.0
 */
public interface StringInterface {
  
  /**
   * Check how many chars are in the string
   * @return int representation of the amount of characters
   */
  public int length();
  
  /**
   * Check to see if this string (linked list) is empty
   * @return Boolean corresponding to empty status
   */
  public boolean isEmpty();
  
  /**
   * return a new linked string that is a substring of this linked string
   * @throws StringBoundsException if unreachable bound
   * @param from Index to start substring
   * @param to One more than the index we stop at\
   * @return LinkedString that is a substring via the parameters
   */
  public LinkedString substring(int from, int to) throws StringBoundsException;
  
  /**
   * Append a specified LinkedString to the end of this one.
   * @param other string to append
   * @return LinkedString that represents both previous strings rogether
   */
  public LinkedString concat(LinkedString other);
  
  /**
   * Returns the char at the specified index.
   * @param index char to return at this index
   * @throws StringBoundsException if invalid index
   * @return char at index
   */
  public char charAt(int index) throws StringBoundsException;
}
