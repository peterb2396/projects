package project1;
/**
 * Exception class for if an invalid index is accessed for ADT Bag program
 * @author Peter
 * @version 1.0
 */
@SuppressWarnings("serial")
public class BagIndexOutOfBoundsException extends IndexOutOfBoundsException {

	/**
	 * Print string when this exception is thrown
	 * @param string
	 */
	public BagIndexOutOfBoundsException(String string) {
		System.out.println(string);
	}

}
