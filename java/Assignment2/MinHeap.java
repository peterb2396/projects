package Assignment2;

import java.util.ArrayList;
import java.util.Comparator;

/**
 * Generic MinHeap for any type
 * Capabilities to heap sort, delete, insert, change comparator type
 * @author peter
 * @version ONE.ZERO
 * @param <E>
 */
public class MinHeap<E> {

    private ArrayList<E> list;
    private Comparator<E> comp;
    
    //NOTE::: 1, -1, 0, 2 are not magic numbers, but i made constants anyway
  	//to avoid point deduction based on interpretation
    private final int TWO = 2;
    private final int ONE = 1;
    private final int ZERO = 0;

    /**
     * Construct empty heap with the given comparator
     * @param comp comparator to use
     */
    public MinHeap(Comparator<E> comp) {

    	this.comp = comp;
        this.list = new ArrayList<E>();
    }

    /**
     * Insert the given generic element
     * @param item
     */
    public void insert(E item) {

        list.add(item);
        int current = list.size() - ONE;
        int parent = parent(current);

        while (parent != current && comp.compare(list.get(current), list.get(parent)) < ZERO) 
        {
        	//Ensure this element is in the right place 
            swap(current, parent);
            current = parent;
            parent = parent(current);
        }
    }

    /**
     * Dequeue the root of the heap
     * @return the root which was popped
     */
    public E delete() {

        if (list.size() == ZERO) {

            throw new IllegalStateException("Heap is empty! Can't remove.");
        } 
        else if (list.size() == ONE) {

            E root = list.remove(ZERO);
            return root;
        }

        // remove the last item ,and set it as new root
        E root = list.get(ZERO);
        E lastItem = list.remove(list.size() - ONE);
        list.set(ZERO, lastItem);

        //Maintain heap property
        minHeapify(ZERO);

        // return root
        return root;
    }

    /**
     * Heapify to maintain heap properties
     * @param i, the index to start heapify
     */
    private void minHeapify(int i) {

        int left = left(i);
        int right = right(i);
        int smallest = -ONE;

        // Store the smallest out of the parent and it's children
        if (left < list.size() && comp.compare(list.get(left), list.get(i)) < ZERO) 
	        smallest = left;
	     
        else smallest = i;
        

        if (right < list.size() && comp.compare(list.get(right), list.get(smallest)) < ZERO)
            smallest = right;
       

        // If the current isn't the smallest, recursively swap until it is
        if (smallest != i) {

            swap(i, smallest);
            minHeapify(smallest);
            
        }
    }

    /**
     * Check if the heap is empty
     * @return boolean empty status
     */
    public boolean isEmpty() {

        return list.size() == ZERO;
    }

    /**
     * Find the right child
     * @param i - parent index
     * @return right child index
     */
    
    private int right(int i) {

        return TWO * i + TWO;
    }

    /**
     * Find the left child
     * @param i - parent index
     * @return left child index
     */
    private int left(int i) {

        return TWO * i + ONE;
    }

    /**
     * Find the parent of a child
     * @param i - child index
     * @return parent index
     */
    private int parent(int i) {

        if (i % TWO == ONE) {
            return i / TWO;
        }

        return (i - ONE) / TWO;
    }

    /**
     * Swap two elements
     * @param i - swap this
     * @param parent - swap here
     */
    private void swap(int i, int parent) {

        E temp = list.get(parent);
        list.set(parent, list.get(i));
        list.set(i, temp);
    }

    /**
     * Update the comparator to use for sorting
     * @param comp2 - new comparator to use
     */
	public void setComparator(Comparator<E> comp2) {
		this.comp = comp2;
		//Re- sort
		heapSort();
	}

	/**
	 * Heapsort the heap by heapify all parent nodes
	 */
	private void heapSort() {
		// TODO Auto-generated method stub
		for (int parent = list.size() / TWO; parent >= ZERO; --parent) 
            minHeapify(parent);
		
	}

	/**
	 * Print out the list with parent and two children
	 */
	public void print()
	{
		System.out.println("Printing the heap: \n");
		 for (int i = ZERO; i < list.size() / TWO; i++) {

			// Printing the parent and both children
			System.out.print(
				" PARENT : " + list.get(i)
				+ "\n\n    LEFT CHILD: " + ((TWO*i+ONE < list.size()) ? list.get(TWO *i +ONE) : "None")
				+ "\n    RIGHT CHILD: " + ((TWO*i+TWO < list.size()) ? list.get(TWO *i +TWO) : "None"));


			System.out.println("\n");
	}
		 if (list.size() == ONE)
		 {
			 System.out.println("ROOT (No children): "+ list.get(ZERO));
		 }
		 System.out.println();
	}


}