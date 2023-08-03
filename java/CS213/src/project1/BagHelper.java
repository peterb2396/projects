package project1;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Random;
import java.util.Scanner; 

/**
 * Helper class for ADT bag program
 * @author Peter
 * @version 1.0
 */
public class BagHelper {
	/**
	 * The file path of our list to insert items from - MUST BE NAMED bag AND IN SAME DIRECTORY AS THIS FILE
	 */
	private static final String path = BagHelper.class.getProtectionDomain().getCodeSource().getLocation().getPath() + BagHelper.class.getPackage().getName() + "/bag.txt";
	//File must be named bag and in the same directory as these java files.
	
	/**
	 * The random generator for testing retrieval via index
	 */
	private static Random gen = new Random();
	
	/**
	 * class field of our bag to be operated on
	 */
	private BagArray bag;
	
	/**
	 * Start the testing process by making a bag, call create()
	 * @throws FileNotFoundException if can't find the file
	 */
	public void start() throws FileNotFoundException {
		this.bag = new BagArray();
		create(bag);
		testOperations(bag);
		
	}
	
	/**
	 * Add items from a text file to the bag, then call display
	 * @param bag
	 * @throws FileNotFoundException if can't find file
	 */
	public static void create(BagArray bag) throws FileNotFoundException {
		File list = new File(path);
		Scanner sc = new Scanner(list);

		while (sc.hasNextLine())//Insert our text from the note pad into the bag
			bag.insert(sc.nextLine());
		sc.close();
		display("Original List", bag);
	}
	/**
	 * Print all items in the bag
	 * @param bag
	 * @param header Used to tell us what operation should have occurred on the list that we are now viewing
	 */
	public static void display(String header, BagArray bag) {
		System.out.println("*** "+header+" ***");
		for(int i = 0; i<bag.size(); i++)
			System.out.println(bag.get(i));
		System.out.println("");
	}
	
	/**
	 * Performs various operations on our initial list so we can verify the integrity of the ADT
	 * @param bag
	 */
	public static void testOperations(BagArray bag) {
		//Test inserting an item to the end
		System.out.println("Inserting an item...");
		bag.insert("Cookies");
		display("Inserted 'Cookies'", bag);
		
		//Test removing a random item from the list
		System.out.println("Removing random item...");
		bag.removeRandom();
		display("Removed a random item", bag);
		
		//Test removing the last item from the list
		System.out.println("Removing last item...");
		bag.removeLast();
		display("Removed the last item", bag);
		
		//Test the retrieval by index
		int gettingIndex = gen.nextInt(bag.size());
		System.out.println("Reading random index "+ gettingIndex+ "...");
		display("Item #"+(gettingIndex+1)+" is "+ bag.get(gettingIndex), bag);
		
		//Test the size representation
		System.out.println("Testing size...");
		display("The bag has " + bag.size() +  ((bag.size() > 1) ? " items." : " item."), bag);
		
		//Test the empty status
		System.out.println("Testing if empty...");
		display("The bag " +  ((bag.isEmpty()) ? "is" : "is not")+ " empty.", bag);
		
		//Test making the bag empty and test empty status again
		System.out.println("Emptying the bag...");
		bag.makeEmpty();
		display("The bag " +  ((bag.isEmpty()) ? "is" : "is not")+ " empty.", bag);
	}

}
