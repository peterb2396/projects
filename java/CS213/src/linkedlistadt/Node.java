package linkedlistadt;

/*Node to be implemented in ADTs (Linked lists)
 * @author Peter Buonaiuto
 * @version 1.0
 */
public class Node {
	/**
	 * The node's element
	 */
	private Object element;
	/**
	 * The linked (next) node after this one
	 */
	private Node next;
	/**
	 * Default constructor for an empty node with null element and next ref
	 */
	public Node() {
		this(null, null); //Calls master constructor for initialization
	}
	
	/**
	 * Constructor for a node with a valid element but a null link
	 * @param element is a reference to this node's element
	 */
	public Node(Object element) {
		this (element, null); //Calls master constructor for initialization
	}
	
	/**
	 * Master constructor - saves the passed through element and link if valid
	 * @param next A reference to the next node in the list
	 * @param element is a reference to this node's element
	 */
	public Node(Object element, Node next)
	{
		this.element = element;
		this.next = next;
	}
	
	/**
	 * Returns the element associated with the given node
	 * @return
	 */
	public Object getElement()
	{
		return this.element;
	}
	/**
	 * Returns a reference to the next node
	 * @return A reference to the next node
	 */
	public Node getNext() {
		return this.next;
	}
	
	/**
	 * Sets the next node to a new reference
	 * @param next The new node to come after this one
	 */
	public void setNext(Node next) {
		this.next = next;
	}
	
}
