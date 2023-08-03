package project2;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Random;
import java.util.Scanner; 

/**
 * Helper class for ADT LinkedString program
 * @author Peter
 * @version 1.0
 */
public class StringHelper {
	/**
	 * The file path of our list to insert items from - MUST BE NAMED strings AND IN SAME DIRECTORY AS THIS FILE
	 */
	private static final String path = StringHelper.class.getProtectionDomain().getCodeSource().getLocation().getPath() + StringHelper.class.getPackage().getName() + "/strings.txt";
	//File must be named strings and in the same directory as these java files.
	
	/**
	 * The random generator for testing retrieval via index
	 */
	private static Random gen = new Random();
	
	/**
	 * Start the testing process by making a list, call create()
	 * @throws FileNotFoundException if can't find the file
	 */
	public void start() throws FileNotFoundException {
		ArrayList<LinkedString> adtStrings = new ArrayList<LinkedString>();
		create(adtStrings);
		testOperations(adtStrings);
		
	}
	
	/**
	 * Add items from a text file to the list, then call display
	 * @param adtStrings our list of adt strings 
	 * @throws FileNotFoundException if can't find file
	 */
	public static void create(ArrayList<LinkedString> adtStrings) throws FileNotFoundException {
		File list = new File(path);
		Scanner sc = new Scanner(list);

		while (sc.hasNextLine())//Insert our strings from the note pad into the array of DLLs
			adtStrings.add(new LinkedString(sc.nextLine()));
		sc.close();
		display("Original List", adtStrings);
	}
	/**
	 * Print all items in the array list
	 * @param adtStrings our list of adt strings
	 * @param header Used to tell us what operation should have occurred on the list that we are now viewing
	 */
	public static void display(String header, ArrayList<LinkedString> adtStrings) {
		System.out.println("*** "+header+" ***");
		for(int i = 0; i<adtStrings.size(); i++)
			System.out.println(adtStrings.get(i));
		System.out.println("");
	}
	
	/**
	 * Performs various operations on our initial list so we can verify the integrity of the ADT
	 * @param adtStrings our list of ADT strings
	 */
	public static void testOperations(ArrayList<LinkedString> adtStrings) {

		//Test charAt on a random item from our note pad
		LinkedString string = adtStrings.get(gen.nextInt(adtStrings.size())); //Use random string
		int gettingIndex = gen.nextInt(string.length());
		System.out.println("Reading random character...");
		display("Char at index "+(gettingIndex)+" on the string "+ string + " is "+ string.charAt(gettingIndex), adtStrings);
		
		//Test the size representation
		string = adtStrings.get(gen.nextInt(adtStrings.size())); //Use random string
		System.out.println("Testing size...");
		display("The LinkedString '" + string + "' has " + string.length() + ((string.length() > 1) ? " characters." : " character."), adtStrings);
		
		//Test the empty status
		string = adtStrings.get(gen.nextInt(adtStrings.size())); //Use random string
		System.out.println("Testing if empty...");
		display("The string '" + string +"' " +  ((string.isEmpty()) ? "is" : "is not")+ " empty.", adtStrings);
		
		//Test concatenation
		Collections.shuffle(adtStrings); //SHUFFLE 
		
		if (adtStrings.size() <= 1) //Insufficient size for concatenation
			System.out.println("CAN NOT TEST CONCATENATION WITH LESS THAN 2 ITEMS IN THE NOTEPAD!");
		else {
			System.out.println("Testing concatenation...");
			LinkedString string1 = adtStrings.get(0);
			LinkedString string2 = adtStrings.get(1);
			LinkedString string3 = string1.concat(string2);
			display("The concatenation of " + string1 + " and "+ string2 + " is "+ string3, adtStrings);
		}
		
		//Test substring
		Collections.shuffle(adtStrings); //SHUFFLE 
		boolean fail = true;
		for (LinkedString s: adtStrings)
		{
			if (s.length() > 1)
			{
				string = s;
				fail = false;
				break;
			}
		}
		
		if (fail)
			System.out.println("Strings in the notepad are too short to test substring method!");
		else
		{
			//Generate two discrete integers from 0 to length
			int from = gen.nextInt(string.length());
			int to = from;
			
			while (to == from) {//until bounds vary...
				to = gen.nextInt(string.length());
			}
			//make sure to > from
			if (from > to)
			{
				int temp = to;
				to = from;
				from = temp;
			}
			System.out.println("Testing substrings...");
			display("The substring of " + string + " from "+ from + " to "+to + " is "+ string.substring(from, to), adtStrings);
		}
	}

}
