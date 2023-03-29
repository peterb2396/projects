package assignment1;

/**
 * Represents a node in a binary tree. Holds a reference to it's two children, and methods
 * to access and modify them. Also contains information about the node's element.
 * @author Peter
 * @version 1.0
 */
public class Node<E> {
	
	/**
	 * This node's data
	 */
	private E element;
	/**
	 * Reference to this node's left child
	 */
	private Node<?> left;
	
	/**
	 * Reference to this node's right child
	 */
	private Node<?> right;
	

	/**
	 * Constructs a node with no info
	 */
	public Node() {
		this(null, null, null);
	}
	
	/**
	 * Constructs a node with a specific element.
	 * @param element A reference to the item of this node
	 */
	public Node(E element) {
		this(element, null, null);
	}

	/**
	 * Constructs a node with an element and two child nodes. 
	 * @param element A reference to the data of this node
	 * @param left Reference to the left child of this node
	 * @param right Reference to the right child of this node
	 */
	public Node(E element, Node<E> left, Node<E> right) {
		this.element = element;
		this.left = left;
		this.right = right;
	}

	/**
	 * Returns the element of this node.
	 * @return A reference to the element of this node
	 */
	public E getElement() {
		return this.element;
	}

	/**
	 * Changes the element of this node.
	 * @param element The element of this node
	 */
	public void setElement(E element) {
		this.element = element;
	}

	/**
	 * Returns the left child of this node.
	 * @return A reference to the left child of this node
	 */
	public Node<?> getLeft() {
		return this.left;
	}

	/**
	 * Changes the left child of this node.
	 * @param leftChild A reference to the left child of this node
	 */
	public void setLeft(Node<?> left) {
		this.left = left;
	}

	/**
	 * Returns the right child of this node. 
	 * @return A reference to the right child of this node
	 */
	public Node<?> getRight() {
		return this.right;
	}

	/**
	 * Changes the right child of this node. 
	 * @param rightChild A reference to the right child of this node
	 */
	public void setRight(Node<?> right) {
		this.right = right;
	}
	
	/**
	 * Overrides the print method to print the element of this node
	 * @return string representation of the element
	 */
	public String toString() {
		return element.toString();
	}
	
	/**
	 * Compares two nodes to see if their content is equal.
	 * @return boolean representation of equality
	 */
	public boolean equals(Node<E> other) {
		if (other.getElement() == this.getElement() && other.getLeft() == this.getLeft() && this.getRight() == other.getRight())
			return true;
		return false; //if all content not equal
	}
}
