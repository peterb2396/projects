package Assignment2;

import java.util.Comparator;

/**
 * Generic priority queue class
 * @author peter
 * Takes a generic type and makes a queue sorted by a custom comparator.
 * @param <E>
 */
public class PriorityQueue<E>
{
	//Define a generic heap
	private MinHeap<E> heap;
	
	/**
	 * Constructor to tell the queue how to sort
	 * @param comp
	 */
	public PriorityQueue(Comparator<E> comp)
	{
		heap = new MinHeap<E>(comp);
	}
	
	/**
	 * Inserts an element into the respective heap
	 * @param element
	 */
	public void insert(E element)
	{
		heap.insert(element);
	}
	
	/**
	 * Pops the root out of the queue. Removes element of lowest
	 * priority and sorts the heap to maintain properties
	 * @return E from the heap root
	 */
	public E delete()
	{
		return heap.delete();
	}
	
	/**
	 * Is the heap empty?
	 * @return boolean status
	 */
	public boolean isEmpty()
	{
		return heap.isEmpty();
	}
	
	/**
	 * Display the heap in a readable manner through MinHeap.java
	 */
	public void print()
	{
		heap.print();
	}
	
	/**
	 * Change the comparator method for dynamic comparing changes
	 * Can compare in multiple ways in one runtime exec
	 * @param comp to switch to
	 */
	public void setComparator(Comparator<E> comp)
	{
		heap.setComparator(comp);
	}
	
}