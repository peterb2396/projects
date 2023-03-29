package project2;

/**Node to be implemented in ADTs (Doubly Linked lists)
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
	private Node successor;
	/**
	 * The linked (previous) node to this one
	 */
	@SuppressWarnings("unused")
	private Node pred;
	/**
	 * Default constructor for an empty node with null element and next ref
	 */
	public Node() {
		this(null, null, null); //Calls master constructor for initialization
	}
	
	/**
	 * Constructor for a node with a valid element but a null link
	 * @param element is a reference to this node's element
	 */
	public Node(Object element) {
		this (element, null, null); //Calls master constructor for initialization
	}
	
	/**
	 * Master constructor - saves the passed through element and link if valid
	 * @param next A reference to the next node in the list
	 * @param element is a reference to this node's element
	 */
	public Node(Object element, Node successor, Node pred)
	{
		this.element = element;
		this.successor = successor;
		this.pred = pred;
	}
	/**
	 * Returns a reference to the element contained in this Node
	 * @return Object in the node
	 */
	public Object getElement() {
		return this.element;
	}
	
	/**
	 * Returns a reference to the next node
	 * @return A reference to the next node
	 */
	public Node getSuccessor() {
		return this.successor;
	}
	
	/**
	 * Sets the next node to a new reference
	 * @param next The new node to come after this one
	 */
	public void setSuccessor(Node successor) {
		this.successor = successor;
	}
	
	/**
	 * Sets the prev node to a new reference
	 * @param next The new node to come before this one
	 */
	public void setPrev(Node prev) {
		this.pred = prev;
	}
}
