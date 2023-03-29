package project1;

import java.io.FileNotFoundException;

/**
 * Driver class for the ADT bag
 * @author Peter
 * @version 1.0
 */
public class BagDriver {//Be sure the note pad to test with is named 'bag' and in the same directory as this file!
	/**
	 * instance of our helper class, used in the main to start testing
	 */
	static BagHelper helper = new BagHelper();
	
	/**
	 * Tell our instance of the Helper to start the testing process
	 * @param args
	 * @throws FileNotFoundException if we can't find a file to test
	 */
	public static void main(String[] args) throws FileNotFoundException {
		helper.start();

	}

}
