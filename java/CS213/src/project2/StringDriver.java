package project2;

import java.io.FileNotFoundException;

/**
 * Driver class for the ADT linked string program
 * @author Peter
 * @version 1.0
 */
public class StringDriver {//Be sure the note pad to test with is named 'strings' and in the same directory as this file!
	/**
	 * instance of our helper class, used in the main to start testing
	 */
	static StringHelper helper = new StringHelper();
	
	/**
	 * Tell our instance of the Helper to start the testing process
	 * @param args
	 * @throws FileNotFoundException if we can't find a file to test
	 */
	public static void main(String[] args) throws FileNotFoundException {
		helper.start();

	}

}
