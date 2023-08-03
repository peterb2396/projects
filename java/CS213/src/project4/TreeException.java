package project4;

/**
 * Represents an exception thrown from a tree when operations fail. 
 * @author Peter
 * @version 1.0
 */
@SuppressWarnings("serial")
public class TreeException extends RuntimeException {
	  /**
	   * Construct an exception object with a message.
	   * @param s A reference to an exception message
	   */
	  public TreeException(String s) {
	    super(s);
	  }
	} 
