package project3;


public interface GenericStackInterface<E>{
	/**
	 * Get the size of this stack
	 * @return int num of items in stack
	 */
	public int getSize();
	
	/**
	 * View the top item
	 * @return Element reference to the item on top
	 * @throws StackException if stack empty
	 */
	public E peek() throws StackException;
	
	/**
	 * Add an item to the top of the stack
	 * @param o the object to add
	 */
	public void push(E o);
	
	/**
	 * Remove and return the top item of the stack
	 * @return Object on top of stack
	 * @throws StackException if already empty
	 */
	public E pop() throws StackException;
	
	/**
	 * Determine if the stack is empty
	 * @return boolean of empty status
	 */
	public boolean isEmpty();
	}
