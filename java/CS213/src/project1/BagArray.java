package project1;

import java.util.Random;

/**
 * Implementations of the operations for a Bag using Array
 * @author Peter Buonaiuto
 * @version 1.0
 */
public class BagArray implements BagInterface {
	/**
	 * The maximum size of the bag
	 */
	private final int capacity = 100;

	/**
	 * A ref to the first node in the array
	 */
	private Object[] bag;
	
	/**
	 * A ref to our random number generator for removing random item from the bag
	 */
	private Random gen = new Random();

	
	/**
	 * Generate an empty Bag (Array)
	 */
	public BagArray() {
		this.bag = new Object[capacity];
	}
	

	/**
	 * Add an item to the bag
	 * @param item The Object to add to the array
	 * @throws BagException if bag is full
	 */
	
	public void insert(Object item) throws BagException{
		if (size() == capacity)
			throw new BagException("The bag is full, can not add more!");
		else {
			//Add the passed parameter to the end of the array
			this.bag[this.size()] = item;
		}
	}
	/**
	 * Remove the last item in the bag
	 * @throws BagException if the bag is empty but we still tried to remove item
	 */
	public void removeLast() throws BagException{
		if (isEmpty())
			throw new BagException("Cannot remove item from an empty bag!");
		else {
			//Ask our remove() method to remove the last index
			remove(this.size()-1);
		}
		
	}
	
	/**
	 * Remove a random element from the bag
	 * @throws BagException if the bag is empty but we still tried to remove item
	 */
	public void removeRandom() throws BagException{
		//Check to see if the array is already empty
			if (isEmpty())
				throw new BagException("Cannot remove item from an empty bag!");
			else {
				//Ask our remove() method to remove this random index
				remove(this.gen.nextInt(this.size()));
			}
		
	}
	
	/**
	 * Remove an item from the array, called by other methods (either removeRandom or removeLast)
	 * Only executes if no exceptions were thrown
	 * @param index The index to remove
	 */
	private void remove(int index) {
			//The bag is not empty so we can remove this item by creating a new array with one less item but the same capacity of capacity
			Object[] newArray = new Object[capacity];
			for (int i = 0, j = 0; i<size(); i++)
			{
				if (i != index)
				{
					newArray[j] = this.bag[i];
					j++;
				}
					
			}
			this.bag = newArray; //store the new array in our variable
		}
	
	/**
	 * Retrieve the index of the first occurrence of the requested item, or -1 if non existent
	 * @param item The item to find the index of
	 */
	public int get(Object item) {
		for (int i = 0; i<size(); i++)
			if (this.bag[i] == item)
					return i;
		return -1;
	}
	/**
	 * Return an element by position
	 * @param index to find the element at
	 * @return Object at the given index
	 * @throws BagIndexOutOfBoundsException if index <0 or >= size
	 * @throws BagException if size is 0 (empty)
	 */
	public Object get(int index) throws BagIndexOutOfBoundsException, BagException{
		//If the list is empty throw exception
		if (isEmpty())
			throw new BagException("The bag is empty!");
		else if (index < 0 || index >= this.size())
			throw new BagIndexOutOfBoundsException("The given index is invalid");
		else
			return this.bag[index];
	}
	
	/**
	 * Check to see if the list is empty
	 * @return boolean If list is empty then true
	 */
	public boolean isEmpty() {
		return size() == 0;
	}
	

	/**
	 * Remove all items from the list
	 * @throws BagException if the array is already empty
	 */
	public void makeEmpty() throws BagException {
		if (isEmpty())
			throw new BagException("The bag is already empty!");
			//Empty the bag
			for (int i = 0; i<size(); i++)
				this.bag[i] = null;
		}

	/**
	 * Retrieve the amount of elements in the bag
	 * @return the size of the bag (count; num elements)
	 */
	public int size() {
		int size = 0;
		
		for(Object o: this.bag)
		{
			if(o == null) //if we approached a null object, this means we have finished counting the valid items.
				break;
			else 
				size++;
		}
		return size;
	}
}
