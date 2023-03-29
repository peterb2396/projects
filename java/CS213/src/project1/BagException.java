package project1;
/**
 * Exception class for if the bag size is bad such as it is full or already empty and trying to remove, for ADT Bag program
 * @author Peter
 * @version 1.0
 */
@SuppressWarnings("serial")
public class BagException extends RuntimeException {

	/**
	 * When this exception is thrown, the passed string is printed
	 * @param string
	 */
	public BagException(String string) {
		System.out.println(string);
	}

}
