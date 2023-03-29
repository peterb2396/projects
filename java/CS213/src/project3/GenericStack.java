package project3;

import java.util.ArrayList;

/**
 * 
 */
public class GenericStack<E> implements GenericStackInterface<E>{
	
	/**
	 * The list of objects of this stack
	 */
	private ArrayList<E> list;
	  
	/**
	 * Instantiates the stack
	 */
    public GenericStack() {
    	list = new ArrayList<E>();
	  }

	/**
	 * Get the size of the stack
	 * @return int num of items in stack
	 */
	public int getSize() {
		return list.size();
	}

	/**
	 * Get the element on top of the stack
	 * @return Element on top
	 * @throws StackException if stack is empty
	 */
	public E peek() throws StackException{
		if (!isEmpty())
			return list.get(getSize()-1);
		else throw new StackException("Can not peek at an empty stack!");
	}

	/**
	 * add element 'o' to top of stack
	 * @param o the element to add
	 */
	public void push(E o) {
		list.add(o);
	}

	/**
	 * View and remove the top element
	 * @return E top element 
	 * @throws StackException if stack empty
	 */
	public E pop() throws StackException {
		if (!isEmpty()) 
		{
			E topItem = peek(); //Store a reference to the last item
			list.remove(getSize()-1); //Remove the last item
			
			return topItem;
		}
		else throw new StackException("Trying to pop from an empty stack");
	}

	/**
	 * Check to see if the stack is empty
	 * @return boolean status of empty
	 */
	public boolean isEmpty() {
		if (getSize() > 0)
			return false;
		else return true;
	}
	  
}
