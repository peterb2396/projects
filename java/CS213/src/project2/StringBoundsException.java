package project2;
/**
 * Exception class for if an invalid index is accessed for ADT LinkedString program
 * @author Peter
 * @version 1.0
 */
@SuppressWarnings("serial")

public class StringBoundsException extends IndexOutOfBoundsException {
	
	/**
	 * Print string when this exception is thrown
	 * @param string to display
	 */
	public StringBoundsException(String string) {
		System.out.println(string);
	}
}
