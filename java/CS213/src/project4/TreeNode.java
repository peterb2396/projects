package project4;

/**
 * Represents a node in a binary tree. Each tree node contains a data portion - a name 
 * and two references, one for each of the node's children.
 * @author Peter
 * @version 1.0
 */
public class TreeNode<E> {
	
	/**
	 * The data portion of this node
	 */
	private E element;
	/**
	 * The reference to left child of this node
	 */
	private TreeNode<E> left;
	
	/**
	 * The TreeNode<T> to right child of this node
	 */
	private TreeNode<E> right;
	

	/**
	 * Constructs a default node.
	 */
	public TreeNode() {
		this(null, null, null);
	}
	
	/**
	 * Constructs a node with a specific element.
	 * @param element A reference to the item of this node
	 */
	public TreeNode(E element) {
		this(element, null, null);
	}

	/**
	 * Constructs a node with an element and two descendant nodes. 
	 * @param element A reference to the data of this node
	 * @param left Reference to the left child of this node
	 * @param right Reference to the right child of this node
	 */
	public TreeNode(E element, TreeNode<E> left, TreeNode<E> right) {
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
	public TreeNode<E> getLeft() {
		return this.left;
	}

	/**
	 * Changes the left child of this node.
	 * @param leftChild A reference to the left child of this node
	 */
	public void setLeft(TreeNode<E> left) {
		this.left = left;
	}

	/**
	 * Returns the right child of this node. 
	 * @return A reference to the tight child of this node
	 */
	public TreeNode<E> getRight() {
		return this.right;
	}

	/**
	 * Changes the right child of this node. 
	 * @param rightChild A reference to the right child of this node
	 */
	public void setRight(TreeNode<E> right) {
		this.right = right;
	}
}
