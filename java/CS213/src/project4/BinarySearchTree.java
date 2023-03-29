package project4;

import java.util.ArrayList;

/**
 * Represents a binary tree with additional operations:
 * 1. Creates a binary tree whose root contains rootItem and has left tree and right tree, respectively, as its left 
 *    and right subtrees.
 * 2. Replaces the data item in the root of a binary tree with newItem, if the tree is not empty. If the
 *    tree is empty, creates a root node whose data item is newItem and inserts the new node into the tree.
 * 3. Attaches a left child containing new item to the root of a binary tree. Throws TreeException if the binary
 *    tree is empty (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
 * 4. Attaches a right child containing new item to the root of a binary tree. Throws TreeException if the binary
 *    tree is empty (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
 * 5. Attaches left Tree as the left subtree of the root of a binary tree and makes leftTree empty
 *    so that it cannot be used as a reference into this tree. Throws TreeException if the binary tree is empty
 *    (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
 * 6. Attaches right Tree as the right subtree of the root of a binary tree and makes rightTree empty
 *    so that it cannot be used as a reference into this tree. Throws TreeException if the binary tree is empty
 *    (no root node to attach to) or a right subtree already exists (should explicitly detach it first).
 * 7. Detaches and returns the left subtree of a binary tree's root. Throws TreeException if the binary tree is empty
 *    (no root node to detach from).
 * 8. Detaches and returns the right subtree of a binary tree's root. Throws TreeException if the binary tree is empty 
 *    (no root node to detach from).
 * @author Qi Wang
 * @version 1.0
 * @param <T>
 */
@SuppressWarnings("unchecked")
public class BinarySearchTree<E> extends BaseBinaryTree<E> {

	  
	  /**
	   * Creates an empty  binary tree.
	   */
	  public BinarySearchTree() {
		  super();  	
	  }

	  /**
	   * Creates a one node binary tree.
	   * @param rootItem The root of this tree
	   */
	  public BinarySearchTree(E rootItem) {
		  super(rootItem);
	  }

	  /**
	   * Creates a binary tree whose root contains rootItem and has left tree and right tree, respectively, 
	   * as its left and right subtrees.
	   * @param rootItem A reference to the root
	   * @param leftTree A reference to the left subtree
	   * @param rightTree A reference to the right subtree
	   */
	  public BinarySearchTree(E rootItem, BinarySearchTree<E> leftTree, BinarySearchTree<E> rightTree) {
		  super(rootItem);
		  this.attachLeftSubtree(leftTree);
		  this.attachRightSubtree(rightTree);
	  }
	  
	  /**
	   * Creates a binary tree with root.
	   * @param rootNode A reference to a node
	   */
	   protected BinarySearchTree(TreeNode<E> rootNode) {
		   // subtree only
		   this.root = rootNode; 
	   }  
	   
	//Search the tree given key of element
	   
	public TreeNode<E> search(TreeNode<E> root, String s)
	   {
	       //method ends when element is either not found or found
	       if (root==null || root.getElement().toString().contains(s))
	    	   return root;
	    
	       // Key is greater than root's key
	       if ((root.getElement()).toString().compareTo(s) < 0)
	          return search(root.getRight(), s);
	    
	       // Key is smaller than root's key
	       return search(root.getLeft(), s);
	   }
	   
	   //Insertion
	   public TreeNode<E> insert(E key)
	    {
		   if (this.root == null){
			   this.root = new TreeNode<E>((E) key);
			   
		   }
		   else 
			   {
			   this.root = insertRec(root, key);
			   }
		   
		   //setRoot(key);
		   return this.root;
	    }
	 
	    //Recursive Insertion
	    public TreeNode<E> insertRec(TreeNode<E> root, E key)
	    {
	        if (root == null)
	        { //The tree is empty so insert as the root
	            root = new TreeNode<E>((E) key);
	            // good System.out.println(root.getElement());
	            return root;
	        }
	 
	        //Is the item less than the root?
	        if (((Comparable<E>) key).compareTo(root.getElement()) < 0)
	        {
	        	//good System.out.println(root.getElement());
	        	root.setLeft(insertRec(root.getLeft(), key));
	        }
	            
	        
	        else if (((Comparable<E>) key).compareTo(root.getElement()) > 0)
	        {
	        	//System.out.println(root.getElement() == null);
	        	//System.out.println(((Comparable<E>) key).compareTo(root.getElement()));
	        	//System.out.println(root.getElement());
	        	root.setRight(insertRec(root.getRight(), key));
	        }
	        
	        //System.out.println("added "+ key);
	        
	        return root;
	    }
	    
	    public void delete(E key) 
	    { 
	    	root = deleteRec(root, key); 
	    }
	    
	    //Recursively delete the key
	    public TreeNode<E> deleteRec(TreeNode<E> root, E key)
	    {
	        //If the tree is empty...
	        if (root == null)
	            return root;
	 
	        //Tree is not empty
	        if (((Comparable<E>) key).compareTo(root.getElement()) < 0)
	            root.setLeft(deleteRec(root.getLeft(), key));
	        
	        else if (((Comparable<E>) key).compareTo(root.getElement()) > 0)
	            root.setRight(deleteRec(root.getRight(), key));
	 
	        // if key is same as root's
	        // key, then This is the
	        // node to be deleted
	        else {
	            //Node has 0 or 1 children - will return null if 0
	            if (root.getLeft() == null)
	                return root.getRight();
	            else if (root.getRight() == null)
	                return root.getLeft();
	 
	            //If the code continues to here the root has 2 children.
	            //Find inorder successor and replace the root data with its, then delete it.
	            
	            root.setElement(findSuccessorRec(root, root).getElement());
	 
	            // Delete successor -- may not work, might just have to delete root?
	            root.setRight(deleteRec(root.getRight(), root.getElement()));
	        }
	 
	        return root;
	    }
	 
	    //Returns the successor of the root (the node to replace the root with in deletion)
	    public TreeNode<E> findSuccessorRec(TreeNode<E> base, TreeNode<E> current)
	    {
	    	ArrayList<TreeNode<E>> orderedKeys = new ArrayList<TreeNode<E>>();
	    	
	        if (current != null) {
	            findSuccessorRec(base, current.getLeft());
	            orderedKeys.add(current);
	            findSuccessorRec(base, current.getRight());
	        }
	        else //root is null and recursion is finished
	        {
	        	return orderedKeys.get(orderedKeys.indexOf(base)+1);
	        }
			return null;
	    }
	   
      /**
       * Replaces the data item in the root of a binary tree with new item, if the tree is not empty. If the
       * tree is empty, creates a root node whose data item is newItem and inserts the new node into the tree.
       * @param newItem A reference to a new root item
       */
	  public void setRoot(E newItem) {
	    if (this.root != null) {
	       this.root.setElement(newItem);
	    }else {
	       this.root = new TreeNode<E>(newItem, null, null);
	    }
	  }

	  /**
	   * Attaches a left child containing a new item to the root of a binary tree. Throws TreeException if the binary
       * tree is empty (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
	   * @param newItem The item of a left child
	   * @throws TreeException if this tree is empty or it has a left child
	   */
	  public void attachLeft(E newItem) throws TreeException{
		  if(!isEmpty() && this.root.getLeft() == null){
			  this.root.setLeft(new TreeNode<E>(newItem, null, null));
		  }else if(isEmpty()){
			  throw new TreeException("The tree is empty, and can not be attached.");
		  }else if(this.root.getLeft() != null){
			  throw new TreeException("A left child is existed.");
		  }
	  }

	  /**
	   * Attaches a right child containing new item to the root of a binary tree. Throws TreeException if the binary
       * tree is empty (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
	   * @param newItem The item of the right child
	   * @throws TreeException if this tree is empty or it has a right child
	   */
	  public void attachRight(E newItem) throws TreeException{
		  if(!isEmpty() && this.root.getRight() == null){
			  this.root.setRight(new TreeNode<E>(newItem, null, null));
		  }else if(isEmpty()){
			  throw new TreeException("The tree is empty, and can not be attached.");
		  }else if(this.root.getRight() != null){
			  throw new TreeException("A right child is existed.");
		  } 
	  }

	  /**
	   * Attaches left Tree as the left subtree of the root of a binary tree and makes left Tree empty
       * so that it cannot be used as a reference into this tree. Throws TreeException if the binary tree is empty
       * (no root node to attach to) or a left subtree already exists (should explicitly detach it first).
	   * @param leftTree A reference to a left tree to be attached
	   * @throws TreeException if this tree is empty or it has a left tree
	   */
	  public void attachLeftSubtree(BinarySearchTree<E> leftTree) throws TreeException {
	    if (isEmpty()) {
	      throw new TreeException("TreeException:  Empty tree");
	    }else if (this.root.getLeft() != null) {
	      // a left subtree already exists; it should have been deleted first
	      throw new TreeException("TreeException: " +  "Cannot overwrite left subtree");
	    }else {
	    	//attach the subtree
	    	this.root.setLeft(leftTree.root);
	    	//remove the external reference to the subtree
	    	leftTree.makeEmpty();
	    }
	  }

	  /**
	   * Attaches right Tree as the right subtree of the root of a binary tree and makes rightTree empty
       * so that it cannot be used as a reference into this tree. Throws TreeException if the binary tree is empty
       * (no root node to attach to) or a right subtree already exists (should explicitly detach it first).
	   * @param rightTree A reference to a right tree to be attached
	   * @throws TreeException if this tree is empty or it has a right tree
	   */
	  public void attachRightSubtree(BinarySearchTree<E> rightTree) throws TreeException {
	    if (isEmpty()) {
	      throw new TreeException("TreeException:  Empty tree");
	    }else if (this.root.getRight() != null) {
	      // a right subtree already exists; it should have been deleted first
	      throw new TreeException("TreeException: " +  "Cannot overwrite right subtree");
	    }else {
	    	this.root.setRight(rightTree.root);
	    	rightTree.makeEmpty();
	    }
	  }

	  
      /**
       * Detaches and returns the left subtree of a binary tree's root. Throws TreeException if this tree is empty
       * (no root node to detach from).
       * @return A reference to the left tree of this tree
       * @throws TreeException if this tree is empty
       */
	  public BinarySearchTree<E> detachLeftSubtree() throws TreeException {
	    if (isEmpty()) {
	      throw new TreeException("TreeException:  Empty tree");
	    }else if(this.root.getLeft() == null){
	    	throw new TreeException("TreeException:  No left subtree");
	    }else {
	      // create a new binary tree that has root's left node as its root
	    	BinarySearchTree<E> leftTree = new BinarySearchTree<E>(this.root.getLeft());
	        this.root.setLeft(null);
	        return leftTree;
	    }
	  }

	  /**
       * Detaches and returns the right subtree of a binary tree's root. Throws TreeException if the binary tree is empty
       * (no root node to detach from).
       * @return A reference to the right tree of this tree
       * @throws TreeException if the tree is empty
       */
	  public BinarySearchTree<E> detachRightSubtree() throws TreeException {
	    if (isEmpty()) {
	      throw new TreeException("TreeException:  Empty tree");
	    }else if(this.root.getRight() == null){
	    	throw new TreeException("TreeException:  No right subtree");
	    }else {
	    	BinarySearchTree<E> rightTree = new BinarySearchTree<E>(this.root.getRight());
	        this.root.setRight(null);
	        return rightTree;
	    }
	  }
	  
	  public TreeIterator<E> iterator() {
		  return new TreeIterator<E>(this);
	  }
	}
