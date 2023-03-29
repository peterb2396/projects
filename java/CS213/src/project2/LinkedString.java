package project2;

/**
 * Implementations of the operations for a String using doubly linked list
 * @author Peter
 * @version 1.0
 */
public class LinkedString implements StringInterface {
	/**
	 * A ref to the first node in the array
	 */
	private Node head; //Head reference (contains first char in string)
	
	/**
	 * The size of this string (# of nodes within it)
	 */
	public int count; //Length of the string
	
	/**
	 * Generate an empty string (doubly linked list)
	 */
	public LinkedString() { //Calls master constructor to instantiate a null head and 0 count
		this(new char[0]);
	}
	
	/**
	 * Generate a string (doubly linked) with the char array given
	 * @param chars character array to be used to create the string
	 */
	public LinkedString(char[] chars) { //Constructs a new DLL and allocates necessary nodes
		if (chars.length > 0)
		{
			this.head = new Node(chars[0]); //Set head to first of char array
			this.count = 1;
			for (int i = 1; i<chars.length; i++)
			{//Add a node for each element of the chars array
				Node last_node = find(length() - 1);
				
				Node new_node = new Node(chars[i]);
				
				new_node.setPrev(last_node);
				
				last_node.setSuccessor(new_node);
				this.count++;
			}
		}
		else
		{
			this.head = null;
			this.count = 0;
		}
		
	}
	
	/**
	 * Generate a string (doubly linked) with the given string
	 * @param str the string to decompose to nodes of characters
	 */
	public LinkedString(String str) { //Converts a string to chars to construct a DLL with these chars to become nodes
		
		this(str.toCharArray());
	}
	
	/**
	 * Return a ref to a node at a given index
	 * @return Node at the given index
	 * @param index node to find
	 */
	private Node find(int index) {      //Traverse the nodes by repeatedly getting the successor index times.
		int pos = 0;
		Node found = this.head;
		while (pos != index) {
			pos++;
			found = found.getSuccessor();
		}
		return found;
	}
	/**
	 * Retrieve the amount of elements in the bag
	 * @return the size of this string (num chars)
	 */
	public int length() { //Return the fild containing the integer representation of the length of this DLL
		return this.count;
	}
	
	
	/**
	 * Check to see if the list is empty
	 * @return boolean If list is empty then true
	 */
	public boolean isEmpty() { //Are there no characters in the string?
		return length() == 0;
	}

	/**
	 * Returns LinkedString that is a substring of this string at the specified boudns
	 * @throws StringBoundsException if unreachable bound
	 * @param from index to start substring
	 * @param to one more than index to end substring at
	 * @return specified substring of this string if valid
	 */
	public LinkedString substring(int from, int to) throws StringBoundsException {
		//Create a new LinkedString object, and add nodes by reading the characters of this string
		//Check if out of bound
		if (to > length())
			throw new StringBoundsException("The specified substring is not within the bounds of the target!");
		else
		{
			char[] subChars = new char[to-from];
			int i = 0;
			
			for (int c = from; c<to; c++)
			{
				subChars[i] = (char) find(c).getElement();
				i++;
			}
			
			return new LinkedString(subChars);
		}
		
		}

	/**
	 * Join the specified string to the end of this one
	 * @param other string to join to this one
	 * @return LinkedString object of the new combinatorial string
	 */
	public LinkedString concat(LinkedString other) {
		LinkedString string1 = this;
		LinkedString string2 = other;
		
		char[] newChars = new char[string1.length() + string2.length()];
		for(int i = 0; i<newChars.length; i++)
		{
			if (i < string1.length())
				newChars[i] = (char) string1.find(i).getElement();
			else
				newChars[i] = (char) string2.find(i-string1.length()).getElement();
		}
		
		return new LinkedString(newChars);
	}

	/**
	 * get the char at the specified index
	 * @throws StringBoundsException if character index does not exist
	 * @return char at the index
	 * @param index to read the char at
	 */
	public char charAt(int index) throws StringBoundsException{
		//Check if out of bounds
		if (index >= length())
			throw new StringBoundsException("Can not access element "+ index + " because it does not exist!");
		else //Traverse to the node and return it's element casted as a char
			return (char)find(index).getElement();
	}
	
	/**
	 * Overrides the printing of a LinkedString, to return the sequence of characters rather than the memory address.
	 * @return String representation of our LinkedString
	 */
	@Override
    public String toString() {
        char[] chars = new char[length()];
        for (int i = 0; i<length(); i++)
        {
        	chars[i] = (char) this.find(i).getElement();
        }
        //Accumulate each element of node as characters, put them together in a string and return it.
        return new String(chars);
        
    } 
	

}
