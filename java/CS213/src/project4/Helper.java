package project4;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Scanner;

import javax.swing.JOptionPane;

/**
 * Tests the design of ADT binary tree. 
 * @author Qi Wang
 * @version 1.0
 */
public class Helper {
	/**
	 * 
	 */
	
	private static final String path = Helper.class.getProtectionDomain().getCodeSource().getLocation().getPath() + Helper.class.getPackage().getName() + "/contacts";
	private static AddressBook book;
	private static String[] responses = {"No", "Yes"};
	
	
	public static void start() throws FileNotFoundException {
		
		  book = new AddressBook(); //Constructs an empty address book with a tree and iterator
		  
		  loadFile(); //Load contacts from file to test
		  traverse(); //Traverse the tree in 3 ways
		  
		  if (shouldTestInsertion())
		  {
			  testInsertion(); //Insert a user defined contact
			  traverse(); //Traverse with the new contact in the tree
		  }
		  
		  if (shouldTestSearch())
		  {
			  testSearching();
		  }
		  
		  if (shouldTestRemove())
		  {
			  book.removeContact(book.search(JOptionPane.showInputDialog("Enter info to search, get, and remove the contact.")));
		  }
		}
	
	private static boolean shouldTestInsertion() {
		return 1 == JOptionPane.showOptionDialog(null, "Would you like to Insert a new contact?", "Address Book", 0, 0, null, responses, responses[1]);
	}
	
	private static boolean shouldTestSearch() {
		return 1 == JOptionPane.showOptionDialog(null, "Would you like to search for a contact?", "Address Book", 0, 0, null, responses, responses[1]);
	}
	
	private static boolean shouldTestRemove() {
		return 1 == JOptionPane.showOptionDialog(null, "Would you like to remove a contact?", "Address Book", 0, 0, null, responses, responses[1]);
	}
	
	private static void traverse() {
		//Traverse inorder
		  book.getIterator().setInorder();
		  System.out.println("Inorder traversal");
		  while(book.getIterator().hasNext()){
				  System.out.println(book.getIterator().next());
			  
		  }
		  System.out.println();
		  
		  // iterate through the left subtree in preorder
		  book.getIterator().setPreorder();
        System.out.println("Preorder traversal");
		  while(book.getIterator().hasNext()){
				  System.out.println(book.getIterator().next());
			  
		  }
		  System.out.println();
		  
		  // iterate through the left subtree in preorder
		  book.getIterator().setPostorder();
        System.out.println("Postorder traversal");
		  while(book.getIterator().hasNext()){
				  System.out.println(book.getIterator().next());
			  
		  }
		  System.out.println("");
	}
	
	private static void loadFile() throws FileNotFoundException{
		File contactList = new File(path);
		 ArrayList<Contact> contacts = new ArrayList<Contact>();
		 
		 Scanner sc = new Scanner(contactList);

			while (sc.hasNextLine()) {
				String[] tokens = sc.nextLine().split("  ");
				if (tokens.length >= 6) {
					
				Contact newContact = new Contact(
						tokens[0], 
						new Address(tokens[1], tokens[2], tokens[3], tokens[4]), 
						tokens[5]);
				
				contacts.add(newContact);
				}
			}
			sc.close();
			
			for (Contact c: contacts)
				book.addContact(c);
	}
	
	private static void testInsertion() {
		String name = JOptionPane.showInputDialog("Enter a name");
		String street = JOptionPane.showInputDialog("Enter Street name");
		String city = JOptionPane.showInputDialog("Enter City");
		String state = JOptionPane.showInputDialog("Enter State");
		String zip = JOptionPane.showInputDialog("Enter zip");
		String phone = JOptionPane.showInputDialog("Enter phone number");
		
		book.addContact(new Contact(name, new Address(street, city, state, zip), phone));
		
		System.out.println("/// INSERTED NEW CONTACT! ///");
	}
	
	private static void testSearching() {
		Contact result = book.search(JOptionPane.showInputDialog(null, "Enter details to search"));
		if (result == null)
			JOptionPane.showMessageDialog(null, "Not found!");
		else JOptionPane.showMessageDialog(null, result);
	}
	
	}
