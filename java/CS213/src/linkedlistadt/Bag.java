package linkedlistadt;

import project1.BagInterface;

/**
 * Implementations of the operations for a Bag using singly linked list
 * @author Peter
 * @version 1.0
 */
public class Bag implements BagInterface {
	/**
	 * A ref to the first node in the array
	 */
	private Node head;
	
	/**
	 * The size of this Bag (# of Objects within it)
	 */
	private int count;
	
	/**
	 * Generate an empty Bag (linked list)
	 */
	public Bag() {
		this.head = null;
		this.count = 0;
	}
	
	/**
	 * Return a ref to a node at a given index
	 * @return Node at the given index
	 */
	private Node find(int index) {
		int pos = 0;
		Node found = this.head;
		while (pos != index) {
			pos++;
			found = found.getNext();
		}
		return found;
	}
	/**
	 * Add an item to the list
	 * @param item The Object to add to the list
	 */
	
	public void insert(Object item) {
		//If the list is empty, make the parameter the head
		if (this.count == 0) 
			this.head = new Node(item);
		//Otherwise, we're appending the node to the end of this list. For functionality where a true insert must be implemented, we would allow middle insertion.
		else {//Find last node, set its successor to the new node
			find(this.count - 1).setNext(new Node(item));
		}
		this.count++;

	}
	/**
	 * Remove the last item in the bag
	 */
	public void removeLast() {
		//if we only have one element, we need to set the head to null
		if (this.count == 1) {
			this.head = null;
		}	
		//otherwise, we have to set the reference to the next node of the second to last as null
		else {
			find(this.count-2).setNext(null);
		}
		this.count--;
	}

	public void removeRandom() {

	}

	public int get(Object item) {
		return 0;
	}
	/**
	 * Return an element by position
	 * @param index to find the element at
	 * @return Object at the given index
	 * @throws ListIndexOutOfBoundsException if index <0 or > size
	 * @throws ListException if size is 0 (empty)
	 */
	public Object get(int index) throws ListIndexOutOfBoundsException, ListException{
		//If the list is empty throw exception
		if (this.count == 0)
			throw new ListException("The bag is empty!");
		else if (index < 0 || index > this.size())
			throw new ListIndexOutOfBoundsException("The given index is invalid");
		else
			return find(index).getElement();
	}
	
	/**
	 * Remove an item from the list, called by other methods (either random or last)
	 * @throws ListException if list was empty to begin with
	 * @param index The index to remove
	 */
	public void remove(int index) throws ListException {
		//Check to see if the list is already empty
		if (this.count == 0)
			throw new ListException("Cannot remove item from an empty list!");
		else {
			//The bag is not empty so we can remove this item
			//Do we only have one item in the list?
			if (this.count == 1)
				this.makeEmpty();
			else {
				if (index == 0)
				{//Removing the first item and there are other items
					Node prevHead = this.head;
					this.head = this.head.getNext();
					prevHead.setNext(null);
					
					//return temp variable to system
					prevHead = null;
				}
				
				else if(index == this.count-1) {
					//Removing the last item in the bag
					find(index-1).setNext(null);
				}
				else {
					//Removing an item from the middle of the bag.
					Node pred = find(index-1);
					Node target = pred.getNext();
					pred.setNext(target.getNext());
					target.setNext(null);
					
					//Remove temp references
					pred = null; target = null;
				}
			}
		}
	}
	/**
	 * Remove all items from the list
	 * @throws ListException if the list is already empty
	 */
	public void makeEmpty() throws ListException{
		if(this.count==0)
			throw new ListException("The bag is already empty!");
		else {
			//Empty the bag
			this.head = null;
			this.count = 0;
		}
	}

	
	/**
	 * Retrieve the amount of elements in the bag
	 * @return the size of the bag (count; num elements)
	 */
	public int size() {
		return this.count;
	}
	
	
	/**
	 * Check to see if the list is empty
	 * @return boolean If list is empty then true
	 */
	public boolean isEmpty() {
		return this.head == null && this.count == 0;
	}

}
